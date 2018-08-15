import { Topic, TOPIC_STATUS } from './topic';

export const TOPIC_HUB_TOPIC = 'topichub';
export const TOPIC_HUB_ACTION_IDENTIFY = 'identify';
export const TOPIC_HUB_ACTION_HEARTBEAT = 'heartbeat';
export const TOPIC_HUB_ACTION_SUBSCRIBE = 'subscribe';
export const TOPIC_HUB_ACTION_UNSUBSCRIBE = 'unsubscribe';
export const TOPIC_HUB_EVENT_PRESENCE = 'presence';
export const TOPIC_HUB_EVENT_ACK_OK = 'ack-ok';
export const TOPIC_HUB_EVENT_ACK_ERROR = 'ack-error';
export const TOPIC_HUB_HEARTBEAT_INTERVAL = 30000; // Heartbeat every 30s.
export const VALID_EVENTS = ['connect', 'identify', 'disconnect'];
export const PRESENCE_CREATE_OP = 'CREATED';
export const PRESENCE_REMOVE_OP = 'REMOVED';
export const PRESENCE_INIT_OP = 'INIT';

export class Socket {
  constructor(uri) {
    this.uri = uri;
    this.connected = false;
    this.identified = false;
    this.socket = null;
    this.token = '';
    this.ref = 0;
    this.topics = [];
    this.eventCallbacks = VALID_EVENTS.reduce((ec, e) => {
      ec[e] = [];
      return ec;
    }, {});
    // Add our internal identify callback to keep track of whether we're identified.
    this.eventCallbacks.identify.push(message => {
      if (message.event === TOPIC_HUB_EVENT_ACK_OK) {
        this.identified = true;
      }
    });
    this.refCallbacks = [];
    this.heartbeatInterval = null;
  }

  isIdentified() {
    return this.identified;
  }

  on(event, cb) {
    if (!VALID_EVENTS.includes(event)) return this;
    this.eventCallbacks[event].push(cb);
    return this;
  }

  connect(token) {
    this.socket = new WebSocket(this.uri);
    this.token = token;

    this.socket.onopen = e => this.handleConnect(e);
    this.socket.onclose = e => this.handleClose(e);
    this.socket.onmessage = e => this.receive(e.data);

    return this;
  }

  topic(topicId, cb) {
    const topic = new Topic(topicId, this, cb);
    this.topics.push(topic);
    return topic;
  }

  handleConnect(e) {
    // If I've just connected I am connected but not identified.
    this.connected = true;
    this.identified = false;

    // Call all of the event callbacks for 'connect'.
    this.eventCallbacks.connect.forEach(cb => cb(e));

    // Start our heartbeat interval.
    this.heartbeatInterval = setInterval(
      () =>
        this.send(
          this.createMessage(TOPIC_HUB_TOPIC, TOPIC_HUB_ACTION_HEARTBEAT),
        ),
      TOPIC_HUB_HEARTBEAT_INTERVAL,
    );

    // Send the "identify" message.
    const message = this.createMessage(
      TOPIC_HUB_TOPIC,
      TOPIC_HUB_ACTION_IDENTIFY,
      {
        token: this.token,
      },
    );

    const cb = message =>
      this.eventCallbacks.identify.forEach(cb => cb(message));
    this.send(message, cb);
  }

  handleClose(e) {
    this.connected = false;
    this.identified = false;

    // Call all of the event callbacks for 'connect'.
    this.eventCallbacks.disconnect.forEach(cb => cb(e));

    // Also close all of the topics.
    this.topics.forEach(t => (t.topicStatus = TOPIC_STATUS.closed));

    clearInterval(this.heartbeatInterval);
  }

  send(message, cb) {
    if (typeof cb === 'function') {
      this.refCallbacks.push({
        ref: message.ref,
        cb,
      });
    }

    this.socket.send(JSON.stringify(message));
  }

  parseJson(data) {
    // Attempt to parse the payload data. If parsing the payload fails then
    // we will simply take it at face value. For example if we are given a string
    // that is just a string parsing will fail annd we will want to retain that payload.
    let payload;
    try {
      payload = JSON.parse(data);
    } catch (_) {
      payload = data;
    }
    return payload;
  }

  receive(data) {
    try {
      // Parse the incoming message.
      const message = this.parseJson(data);
      message.payload = this.parseJson(message.payload);

      if (message.ref) {
        // If the server sent a ref back then we should check for any ref callbacks.
        // Apply all ref callbacks where the ref matches the one on the message.
        this.refCallbacks
          .filter(r => r.ref === message.ref)
          .forEach(r => r.cb(message));
      }

      // Filter out the ref callbacks for this message.
      this.refCallbacks = this.refCallbacks.filter(r => r.ref !== message.ref);

      // If the message is a presence related message, lets handle it specially.
      if (
        message.topic === TOPIC_HUB_TOPIC &&
        message.event === TOPIC_HUB_EVENT_PRESENCE
      ) {
        this.receivePresence(message);
      }
      // Delegate it to the relevant topic.
      const topic = this.topics.find(t => t.id() === message.topic);
      if (topic) {
        topic.receive(message);
      }
    } catch (e) {
      console.warn('Received invalid message from server: ', data, e);
    }
  }

  receivePresence(message) {
    if ([PRESENCE_CREATE_OP, PRESENCE_REMOVE_OP].includes(message.payload.op)) {
      this.processPresence(message.payload.op, message.payload.presenceData);
    } else if (message.payload.op === PRESENCE_INIT_OP) {
      message.payload.presences.forEach(pd => {
        this.processPresence(PRESENCE_CREATE_OP, pd);
      });
    }
  }

  processPresence(op, presenceData) {
    // If it's a standard delta message, fetch the topic
    const topic = this.topics.find(t => t.id() === presenceData.topic);
    if (topic) {
      topic.receivePresence(op, presenceData);
    }
  }

  createMessage(topic, action, payload) {
    return {
      topic,
      action,
      payload,
      ref: this.makeRef(),
    };
  }

  makeRef() {
    this.ref = this.ref === this.ref + 1 ? 0 : this.ref + 1;
    return '' + this.ref;
  }
}

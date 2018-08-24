import { Topic, TOPIC_STATUS } from './topic';
import { Timer } from './timer';

export const TOPIC_HUB_TOPIC = 'topichub';
export const TOPIC_HUB_ACTION_IDENTIFY = 'identify';
export const TOPIC_HUB_ACTION_HEARTBEAT = 'heartbeat';
export const TOPIC_HUB_ACTION_SUBSCRIBE = 'subscribe';
export const TOPIC_HUB_ACTION_UNSUBSCRIBE = 'unsubscribe';
export const TOPIC_HUB_EVENT_PRESENCE = 'presence';
export const TOPIC_HUB_EVENT_ACK_OK = 'ack-ok';
export const TOPIC_HUB_EVENT_ACK_ERROR = 'ack-error';
export const TOPIC_HUB_HEARTBEAT_INTERVAL = 30000; // Heartbeat every 30s.
export const VALID_EVENTS = ['connect', 'identify', 'disconnect', 'status'];
export const PRESENCE_CREATE_OP = 'CREATED';
export const PRESENCE_REMOVE_OP = 'REMOVED';
export const PRESENCE_INIT_OP = 'INIT';
export const SOCKET_STATUS = {
  CLOSED: 'closed',
  CONNECTING: 'connecting',
  RECONNECTING: 'reconnecting',
  IDENTIFYING: 'identifying',
  UNIDENTIFIED: 'unidentified',
  IDENTIFIED: 'identified',
};

export class Socket {
  constructor(uri) {
    this.uri = uri;
    this.status = SOCKET_STATUS.CLOSED;
    this.socket = null;
    this.token = '';
    this.ref = 0;
    this.topics = [];
    this.eventCallbacks = VALID_EVENTS.reduce((ec, e) => {
      ec[e] = [];
      return ec;
    }, {});

    // Bind functions that are used in callbacks.
    this.handleReconnect = this.handleReconnect.bind(this);
    this.handleIdentify = this.handleIdentify.bind(this);
    this.refCallbacks = [];
    this.heartbeatInterval = null;

    // Add our internal identify callback to keep track of whether we're identified.
    this.eventCallbacks.identify.push(this.handleIdentify);
    this.reconnectTimer = new Timer(this.handleReconnect);
  }

  isIdentified() {
    return this.identified;
  }

  on(event, cb) {
    if (!VALID_EVENTS.includes(event)) return this;
    this.eventCallbacks[event].push(cb);
    return this;
  }

  connect(token, uri) {
    this.token = token;
    if (uri) {
      this.uri = uri;
    }

    this.setStatus(SOCKET_STATUS.CONNECTING);

    this.doConnect();

    return this;
  }

  doConnect() {
    this.socket = new WebSocket(this.uri);
    this.socket.onopen = e => this.handleConnect(e);
    this.socket.onclose = e => this.handleClose(e);
    this.socket.onmessage = e => this.receive(e.data);
  }

  close() {
    this.setStatus(SOCKET_STATUS.CLOSED);
    this.socket.close();

    return this;
  }

  topic(topicId, cb) {
    const topic = new Topic(topicId, this, cb);
    this.topics.push(topic);
    return topic;
  }

  handleReconnect() {
    console.log('trying to reconnect');
    delete this.socket;
    this.doConnect();
  }

  handleConnect(e) {
    // Identification callback.
    const previousStatus = this.status;

    const identCallback = message => {
      this.eventCallbacks.identify.forEach(cb => cb(message));
      // If we were reconnecting...
      if (previousStatus === SOCKET_STATUS.RECONNECTING) {
        this.topics.forEach(t => t.subscribe());
      }
    };
    // If I've just connected I am connected but not identified.
    this.setStatus(SOCKET_STATUS.IDENTIFYING, e);

    // Reset the reconnect timer if it is running.
    this.reconnectTimer.reset();

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

    this.send(message, identCallback);
  }

  handleClose(e) {
    if (this.status === SOCKET_STATUS.IDENTIFIED) {
      // If we were connected (e.g. the close isn't due to explicitly requesting
      // the socket to be closed) we should begin the reconnect process.
      this.setStatus(SOCKET_STATUS.RECONNECTING, e);
      console.log('calling set status');
      this.topics.forEach(t => t.setStatus(TOPIC_STATUS.reconnecting));
      this.reconnectTimer.execute();
    } else if (this.status === SOCKET_STATUS.RECONNECTING) {
      // If we're getting a close event and we're reconnecting that indicates that a
      // reconnect attempt failed and we will try again.
      this.setStatus(SOCKET_STATUS.RECONNECTING, e);
      this.reconnectTimer.execute();
      return;
    } else {
      this.setStatus(SOCKET_STATUS.CLOSED, e);
      this.topics.forEach(t => t.setStatus(TOPIC_STATUS.closed));
    }

    // Call all of the event callbacks for 'connect'.
    this.eventCallbacks.disconnect.forEach(cb => cb(e));
    // TODO:MTR

    // Also close all of the topics.
    // this.topics.forEach(t => (t.topicStatus = TOPIC_STATUS.closed));

    clearInterval(this.heartbeatInterval);
  }

  handleIdentify(message) {
    if (message.event === TOPIC_HUB_EVENT_ACK_OK) {
      this.setStatus(SOCKET_STATUS.IDENTIFIED);
    } else {
      this.setStatus(SOCKET_STATUS.UNIDENTIFIED);
    }
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

  setStatus(status, event) {
    this.status = status;
    this.eventCallbacks.status.forEach(cb => cb(status, event));
  }
}

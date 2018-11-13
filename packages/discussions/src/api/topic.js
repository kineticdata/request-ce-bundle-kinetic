import {
  TOPIC_HUB_TOPIC,
  TOPIC_HUB_ACTION_SUBSCRIBE,
  TOPIC_HUB_ACTION_UNSUBSCRIBE,
  PRESENCE_CREATE_OP,
  PRESENCE_REMOVE_OP,
  TOPIC_HUB_EVENT_ACK_OK,
  TOPIC_HUB_EVENT_ACK_ERROR,
} from './socket';

export const TOPIC_STATUS = {
  closed: 'closed',
  reconnecting: 'reconnecting',
  subscribing: 'subscribing',
  subscribed: 'subscribed',
  unsubscribing: 'unsubscribing',
  error: 'error',
};

export class Topic {
  constructor(topicId, socket, cb) {
    this.topicId = topicId;
    this.topicStatus = TOPIC_STATUS.closed;
    this.socket = socket;
    this.eventCallbacks = [];
    this.statusCallbacks = cb ? [cb] : [];
    this.presences = [];
    this.presenceCallbacks = [];

    this.setStatus = this.setStatus.bind(this);
    this.on = this.on.bind(this);
  }

  socket() {
    return this.socket;
  }

  on(event, cb) {
    const events = this.eventCallbacks[event] || [];
    events.push(cb);
    this.eventCallbacks[event] = events;
    return this;
  }

  onPresence(cb) {
    this.presenceCallbacks.push(cb);
    return this;
  }

  onStatus(cb) {
    this.statusCallbacks.push(cb);
    return this;
  }

  subscribe(userInvitationToken) {
    return new Promise((resolve, reject) => {
      this.setStatus(TOPIC_STATUS.subscribing);

      // Wrap the user's callback with our own.
      const handleSubscribe = message => {
        if (message.event === TOPIC_HUB_EVENT_ACK_OK) {
          this.setStatus(TOPIC_STATUS.subscribed, message);
          resolve(message);
        } else if (message.event === TOPIC_HUB_EVENT_ACK_ERROR) {
          this.setStatus(TOPIC_STATUS.error, message);
          reject(message);
        }
      };
      // Craft the message to be sent to the server.
      const action = this.socket.createMessage(
        TOPIC_HUB_TOPIC,
        TOPIC_HUB_ACTION_SUBSCRIBE,
        { topic: this.topicId, userInvitationToken },
      );
      // Send the message.
      this.socket.send(action, handleSubscribe);
    });
  }

  unsubscribe() {
    this.setStatus(TOPIC_STATUS.leaving);

    const handleUnsubscribe = message => {
      if (message.event === TOPIC_HUB_EVENT_ACK_OK) {
        this.setStatus(TOPIC_STATUS.closed, message);
      } else if (message.event === TOPIC_HUB_EVENT_ACK_ERROR) {
        this.setStatus(TOPIC_STATUS.error, message);
      }

      // Remove this topic from the socket.
      delete this.socket.topics[this.topicId];
    };

    // Craft the message to be sent to the server.
    const action = this.socket.createMessage(
      TOPIC_HUB_TOPIC,
      TOPIC_HUB_ACTION_UNSUBSCRIBE,
      { topic: this.topicId },
    );

    // Send the message.
    this.socket.send(action, handleUnsubscribe);
    return this;
  }

  send(action, payload = {}, cb) {
    this.socket.send(
      this.socket.createMessage(this.topicId, action, payload),
      cb,
    );

    return this;
  }

  receive(message) {
    const eventCallbacks = this.eventCallbacks[message.event];
    if (eventCallbacks) {
      eventCallbacks.forEach(cb => cb(message));
    }
  }

  receivePresence(op, data) {
    switch (op) {
      case PRESENCE_CREATE_OP:
        this.presences.push(data);
        break;
      case PRESENCE_REMOVE_OP:
        this.presences = this.presences.filter(
          p => data.connection !== p.connection,
        );
        break;
      default:
        console.warn('Invalid presence delta operation: ' + op);
    }

    this.presenceCallbacks.forEach(cb => cb(op, data));
  }

  presence() {
    return this.presences;
  }

  setStatus(status, message) {
    if (!Object.values(TOPIC_STATUS).includes(status)) return this;

    this.topicStatus = status;
    this.statusCallbacks.forEach(cb => cb(this.topicStatus, message));
    return this;
  }

  status() {
    return this.topicStatus;
  }

  id() {
    return this.topicId;
  }

  isSubscribed() {
    return this.topicStatus === TOPIC_STATUS.subscribed;
  }
}

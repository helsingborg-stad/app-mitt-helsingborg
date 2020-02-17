export const EVENT_USER_MESSAGE = 'user_input';

const EventHandler = {
  events: {},

  dispatch(event, data) {
    if (!this.events[event]) {
      return;
    }

    this.events[event].forEach(callback => callback(data));
  },
  subscribe(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  },
  unSubscribe(event) {
    delete this.events[event];
  },
};

export default EventHandler;

export const EVENT_USER_MESSAGE = 'user_input';

const EventHandler = {
    events: {},
    idEvents: {},

    dispatch: function (event, data) {
        console.log('Setting upp dispash for event: ', event);
        console.log('Setting upp dispash for data: ', data);
        console.log('events registered: ', this.events);

        if (!this.events[event]) {
            return;
        }

        this.events[event].forEach(callback => callback(data))
    },
    subscribe: function (event, callback) {
        console.log('Setting upp subscribe for event: ', event);

        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push(callback);
    },
    unSubscribe: function (event) {
        delete this.events[event];
    }
};


export default EventHandler;

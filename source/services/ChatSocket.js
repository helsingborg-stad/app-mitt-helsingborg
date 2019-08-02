import io from 'socket.io-client';

export default () => {
    const socket = io(
        'ws://localhost:3001/socket/v1/chat',
        {
            query: {
                userId: 1
            }
        }
    );

    const joinChat = (args, callback) => {
        socket.emit('join', args, callback);
    };

    const subscribeToMessages = onMessageRecived => {
        socket.on('message', onMessageRecived);
    };

    const unsubscribeToMessages = onMessageRecived => {
        socket.off('message');
    };

    const message = (message, cb) => {
        socket.emit('message', message, cb);
    };
    
    const disconnect = socket.disconnect;

    socket.on('error', function(err) {
        console.log('received socket error:');
        console.log(err);
    });

    return { joinChat, subscribeToMessages, unsubscribeToMessages, message, disconnect };
};

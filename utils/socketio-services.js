const socketIO = require('socket.io');
let io = null;

module.exports = {
    connect: function(server) {
        io = socketIO(server);
        return io;
    },

    emit: function(event, values) {
        if (io) {
            io.sockets.emit(event, values);
        }
    },

    getIO: function () {
        return io;
    }
};

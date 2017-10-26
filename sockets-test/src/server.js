var io = require('socket.io');


var server = io();


server.listen(5525);

var clients = [];

console.log("server started");

server.on("connection", (socket) => {

    console.log("SERVER: new socket connected to server");

    clients.push(socket);

    socket.on("disconnect", () => {

        console.log("SERVER: socket disconencted from server");

        for (var i=0; i<clients.length; i++)
            if (clients[i] === socket) {
                console.log("SERVER GASIT PT STERS",i);

                socket.disconnect(true);
                clients.splice(i,1);
                return;
            }

    })

});

setInterval(()=>{
    console.log("server stats: ",clients.length);
}, 1000)


module.exports = server;

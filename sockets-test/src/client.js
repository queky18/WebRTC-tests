var io = require('socket.io-client');

class Client{

    constructor(){

        var socket = io.connect("http://127.0.0.1:5525", {
            reconnection: false, //no reconnection because it is managed automatically by the WaitList
        });

        var index = Math.floor(Math.random()*1000);

        socket.once("connect", function(){
            console.log("Client: socket ",index,"successfully connected to server");
        })

        socket.once("disconnect", function(){
            console.log("Client: socket ",index," successfully disconnected from server");
        })

        this.socket = socket;

    }

}


module.exports = Client;
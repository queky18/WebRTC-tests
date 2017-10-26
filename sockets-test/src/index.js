var Client = require('./client.js');
var server = require('./server.js');


var client1 = new Client();
var client2 = new Client();
var client3 = new Client();


setTimeout( ()=>{
    client2.socket.disconnect(true);
}, 500);
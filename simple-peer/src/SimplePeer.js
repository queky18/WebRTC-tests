console.log("SimplePeer Hello World");

//TUTORIAL BASED ON
// https://github.com/feross/simple-peer

if (typeof window === 'undefined') window = global;

if (typeof location === 'undefined') location = global.location||{};

var Peer = require('simple-peer');

params = {
    initiator: initiator,
    trickle: false,
    reconnectTimer: 100,
    iceTransportPolicy: 'relay',
    config: {
        /*
            SUNT/TURN servers list https://gist.github.com/yetithefoot/7592580
         */
        iceServers: [
            {
                urls: "stun:numb.viagenie.ca",
                username: "pasaseh@ether123.net",
                credential: "12345678"
            },
            {
                urls: "turn:numb.viagenie.ca",
                username: "pasaseh@ether123.net",
                credential: "12345678"
            }
        ]
    }
};

if (typeof window === "undefined"){
    var wrtc = require('wrtc');
    params.wrtc=  wrtc;
}

var p = new Peer(params);

p.on('error', function (err) { console.log('error', err) })

p.on('signal', function (data) {
    console.log('SIGNAL', JSON.stringify(data));
    document.querySelector('#outgoing').textContent = JSON.stringify(data)
});

document.querySelector('form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    console.log("am apasat pe button");
    p.signal(JSON.parse(document.querySelector('#incoming').value))
});

let index = Math.floor(Math.random()*100);

p.on('connect', function (data) {

    console.log('CONNECT', data, p);

    setInterval(function() {
        if ((typeof p !== 'undefined')&& ( p !== null)) {
            console.log(p);
            p.send('whatever' + index + " ___ " + Math.random())
        }
    }, 500);

    p.on("hello", function(data){
        alert(data);
    });

    p.emit("hello",55);

})

p.on('data', function (data) {
    console.log('data: ' + data)
});

module.exports = function(){
    console.log("Hello World Server");
};

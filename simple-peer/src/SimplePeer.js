console.log("Server Hello World");

//TUTORIAL BASED ON
// https://github.com/feross/simple-peer

if (typeof window === 'undefined'){
    window = global;
}

if (typeof location === 'undefined') {
    location = global.location||{}
}

var Peer = require('simple-peer')
var p = new Peer({ initiator: (location.hash||'#1') === '#1', trickle: false })

p.on('error', function (err) { console.log('error', err) })

p.on('signal', function (data) {
    console.log('SIGNAL', JSON.stringify(data))
    document.querySelector('#outgoing').textContent = JSON.stringify(data)
})

document.querySelector('form').addEventListener('submit', function (ev) {
    ev.preventDefault()
    p.signal(JSON.parse(document.querySelector('#incoming').value))
})

p.on('connect', function () {
    console.log('CONNECT')
    p.send('whatever' + Math.random())
})

p.on('data', function (data) {
    console.log('data: ' + data)
})

module.exports = function(){
    console.log("Hello World Server");
}
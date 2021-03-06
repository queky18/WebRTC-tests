console.log("Client Hello World");

if (typeof window === 'undefined'){
    window = global;
}

var wrtc = require("wrtc");
RTCPeerConnection = wrtc.RTCPeerConnection;
RTCSessionDescription = wrtc.RTCSessionDescription;
RTCIceCandidate = wrtc.RTCIceCandidate;

console.log(wrtc.RTCPeerConnection);
console.log(wrtc);
console.log(RTCPeerConnection);

var localConnection;
var remoteConnection;
var sendChannel;
var receiveChannel;
var pcConstraint;
var dataConstraint;


function createConnection() {

    var config = {
        iceServers:[
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
    ]};

    pcConstraint = null;
    dataConstraint = null;
    console.log('Using SCTP based data channels');

    // SCTP is supported from Chrome 31 and is supported in FF.
    // No need to pass DTLS constraint as it is on by default in Chrome 31.
    // For SCTP, reliable and ordered is true by default.
    // Add localConnection to global scope to make it visible
    // from the browser console.


    localConnection = localConnection =  new RTCPeerConnection(config, pcConstraint);


    console.log('Created local peer connection object localConnection');

    sendChannel = localConnection.createDataChannel('sendDataChannel', dataConstraint);

    console.log('Created send data channel');

    localConnection.onicecandidate = function(e) {
        onIceCandidate(localConnection, e);
    };
    sendChannel.onopen = onSendChannelStateChange;
    sendChannel.onclose = onSendChannelStateChange;

    // Add remoteConnection to global scope to make it visible
    // from the browser console.
    remoteConnection = remoteConnection = new RTCPeerConnection(config, pcConstraint);


    console.log('Created remote peer connection object remoteConnection');

    remoteConnection.onicecandidate = function(e) {
        onIceCandidate(remoteConnection, e);
    };
    remoteConnection.ondatachannel = receiveChannelCallback;

    localConnection.createOffer().then(
        gotDescription1,
        onCreateSessionDescriptionError
    );


    console.log("ENABLED");
}

function onCreateSessionDescriptionError(error) {
    console.log('Failed to create session description: ' + error.toString());
}

function sendData(data) {

    sendChannel.send(data);
    console.log('Sent Data: ' + data);
}

function closeDataChannels() {
    console.log('Closing data channels');
    sendChannel.close();
    console.log('Closed data channel with label: ' + sendChannel.label);
    receiveChannel.close();
    console.log('Closed data channel with label: ' + receiveChannel.label);
    localConnection.close();
    remoteConnection.close();
    localConnection = null;
    remoteConnection = null;
    console.log('Closed peer connections');

}

function gotDescription1(desc) {
    localConnection.setLocalDescription(desc);
    console.log('Offer from localConnection \n' + desc.sdp);
    remoteConnection.setRemoteDescription(desc);
    remoteConnection.createAnswer().then(
        gotDescription2,
        onCreateSessionDescriptionError
    );
}

function gotDescription2(desc) {
    remoteConnection.setLocalDescription(desc);
    console.log('Answer from remoteConnection original \n' + desc.toString());
    console.log('Answer from remoteConnection \n' + desc.sdp);
    localConnection.setRemoteDescription(desc);
}

function getOtherPc(pc) {
    return (pc === localConnection) ? remoteConnection : localConnection;
}

function getName(pc) {
    return (pc === localConnection) ? 'localPeerConnection' : 'remotePeerConnection';
}

function onIceCandidate(pc, event) {
    getOtherPc(pc).addIceCandidate(event.candidate)
        .then(
            function() {
                onAddIceCandidateSuccess(pc);
            },
            function(err) {
                onAddIceCandidateError(pc, err);
            }
        );
    console.log(getName(pc) + ' ICE candidate: \n' + (event.candidate ? event.candidate.candidate : '(null)'));
}

function onAddIceCandidateSuccess() {
    console.log('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
    console.log('Failed to add Ice Candidate: ' + error.toString());
}

function receiveChannelCallback(event) {
    console.log('Receive Channel Callback');
    receiveChannel = event.channel;
    receiveChannel.onmessage = onReceiveMessageCallback;
    receiveChannel.onopen = onReceiveChannelStateChange;
    receiveChannel.onclose = onReceiveChannelStateChange;
}

function onReceiveMessageCallback(event) {
    console.log('Received Message', event.data);
}

function onSendChannelStateChange() {
    var readyState = sendChannel.readyState;
    console.log('Send channel state is: ' + readyState);
    if (readyState === 'open') {

        console.log("sending...");
    } else {

        console.log("sending finished");
    }
}

function onReceiveChannelStateChange() {
    var readyState = receiveChannel.readyState;
    console.log('Receive channel state is: ' + readyState);
}


createConnection();

setTimeout(function(){sendData("HELLO WebDollar");}, 4000);


module.exports = function(){
    console.log("Hello World Server");
}
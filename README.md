# Demo for Video Conferencing App

This is a small demo for a possible video conferencing application.

It contains an initial chat lobby, implemented in Socket.IO with the UI rendered with React; from which users can choose another person to video-call.

The video-audio call is done via WebRTC (i.e. getUserMedia and RTCPeerConnection), with the same included Socket.IO server for signaling.
It is based on Google's codelab samples and uses a Google's STUN server to lookup each client's public address, and TURN servers for data relay bypassing NAT and firewalls.

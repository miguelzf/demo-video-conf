
import React, { Component } from 'react';
import { render } from 'react-dom';

import io from 'socket.io-client';

import ChatArea from './ChatArea';
import ChatInput from './Input';
import UserList from './Users';


export default class ChatApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = { socket: null, username: curruser };

  }

  componentWillMount() {
    print("Connect to Socket.IO server at " + host);
    var socket = io.connect(host);
    this.setState({socket: socket});

    // Server sent an error
    socket.on('chat:error', function (msg) {
      alert('ERROR!!: ' + msg);
      socket.close();
      window.location.href = '/';
    });

    // Server sent an error
    socket.on('chat:error', function (msg) {
      alert('Connection ERROR!!: ' + msg);
      socket.close();
      window.location.href = '/';
    })

    socket.on('chat:disconnect', function (msg) {
      console.error("Connection lost");
      socket.close();
    });

    print("Send User: " + this.state.username);
    socket.emit('chat:user', this.state.username);
  }

  render(){
    return (
      <div className="ui">
        <UserList socket={this.state.socket} user={this.state.username}> </UserList>

        <div className="chat">
          <ChatArea  socket={this.state.socket} user={this.state.username}></ChatArea>
          <ChatInput socket={this.state.socket} user={this.state.username}></ChatInput>
        </div>
      </div>
    );
  }
}


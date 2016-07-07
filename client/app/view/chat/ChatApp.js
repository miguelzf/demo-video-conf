
import React, { Component } from 'react';
import { render } from 'react-dom';

import io from 'socket.io-client';

import ChatArea from './ChatArea';
import ChatInput from './Input';
import UserList from './Users';


export default class ChatApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = { msgs: [], socket: null, username: curruser };

  }


  componentWillMount() {
    print("Connect to Socket.IO server at " + host);
    var socket = io.connect(host);
    this.setState({socket: socket});

    // Server sent an error
    socket.on('errorr', function (msg) {
      alert('ERROR!!: ' + msg);
      socket.close();
      window.location.href = '/';
    });

    // Server sent an error
    socket.on('error', function (msg) {
      alert('Connection ERROR!!: ' + msg);
      socket.close();
      window.location.href = '/';
    })

    socket.on('disconnect', function (msg) {
      console.error("Connection lost");
      socket.close();
    });

    print("Send User: " + this.state.username);
    socket.emit('user', this.state.username);
  }

  render(){
    return (
      <div className="ui">
        <div className="left-menu">
          <form action="#" className="search">
            <input placeholder="search..." type="search" name="" id=""/>
            <input type="submit" value="&#xf002;"/>
          </form>
          <UserList socket={this.state.socket} user={this.state.username}> </UserList>
        </div>

        <div className="chat">
          <div className="top">
            <div className="avatar">
              <img width="50" height="50" src="foto.jpg" />
            </div>
            <div className="info">
              <div className="name">{this.state.username}</div><div className="count">{this.state.msgs.length} messages</div>
            </div>
            <i className="fa fa-star"></i>
          </div>
          <ChatArea  socket={this.state.socket} user={this.state.username}></ChatArea>
          <ChatInput socket={this.state.socket} user={this.state.username}></ChatInput>
        </div>
      </div>
    );
  }
}


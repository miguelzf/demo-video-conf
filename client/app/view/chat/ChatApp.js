
import React, { Component } from 'react';
import { render } from 'react-dom';

import io from 'socket.io-client';

import ChatArea from './ChatArea';
import ChatInput from './Input';
import UserList from './Users';

function print(s,s1) { console.log(s); if (s1) console.log(s1); }


export default class ChatApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = { users: [], msgs: [], socket: null, username: curruser };

    this.remUser = this.remUser.bind(this);
    this.onMsgs  = this.onMsgs.bind(this);
    this.onUsers = this.onUsers.bind(this);
  }

  remUser (username) {
    print('Rem User: '+ username);
    this.setState ((prev, props) =>
      ({users : prev.users.filter(el => el.name !== username) }))
  }

  onMsgs (msgs) {
    if (msgs.constructor !== Array)
      msgs = [msgs];
    this.setState((prev, props) => ({
      msgs: prev.msgs.concat(msgs)
    }));
  }

  onUsers (users) {
    if (users.constructor !== Array)
      users = [users];

    print('Received users ' + users.length);
    this.setState((prev, props) => {
      var newUsers = users.filter(el => !prev.users.find(u => u.name === el.name))
      return {users: prev.users.concat(newUsers)}
    });
  }

  componentDidMount() {
    print("Connect to Socket.IO server at " + host);
    var socket = io.connect(host);
    this.setState({socket: socket});

    socket.on('users',  this.onUsers);

    socket.on('addUser', this.onUsers);

    socket.on('remUser', this.remUser);

    socket.on('messages', this.onMsgs);

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
          <UserList users={this.state.users}> </UserList>
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
          <ChatArea msgs={this.state.msgs}> </ChatArea>
          <ChatInput socket={this.state.socket} user={this.state.username}></ChatInput>
        </div>
      </div>
    );
  }
}


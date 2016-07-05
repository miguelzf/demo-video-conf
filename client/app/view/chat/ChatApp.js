
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
    print('Rem User', username);
    this.setState(function (prev, props) {
      var i;
      for (i = 0; i < prev.users.length; i += 1)
        if (prev.users[i].name == username)
          break;

      return { users: prev.users.splice(i) };
    });
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

    print('Received users ' + users.length, users);
    this.setState((prev, props) => ({
      users: prev.users.concat(users)
    }));
  }

  componentDidMount() {

    var socket = io.connect('localhost:4000');
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

    print("Send User: " + this.state.username);
    socket.emit('user', this.state.username);
  }

  render(){
   return (
    <div className="chatApp">
      <div className="row" style={{"height" : "70%"}}>
        <div className="col-sm-2 cold-md-2 col-lg-2">
          <div className="panel panel-default">
            <div className="panel-heading">Online users</div>
            <UserList users={this.state.users}> </UserList>
          </div>
        </div>

        <div className="col-sm-10 cold-md-10 col-lg-10">
          <ChatArea msgs={this.state.msgs}> </ChatArea>
        </div>
      </div>
       <br></br>

      <div className="row" style={{"height" : "10%"}}>
        <div className="col-sm-2 cold-md-2 col-lg-2">
          <button type="submit" className="btn btn-primary">Video Chat</button>
        </div>

        <div className="col-sm-10 cold-md-10 col-lg-10">
          <ChatInput socket={this.state.socket} user={this.state.username}></ChatInput>
        </div>
      </div>
    </div>
    );
  }
}


import React, { Component } from 'react';
import { render } from 'react-dom';

var User = React.createClass({
  render: function() {
    return (
      <li onClick={() => this.props.onClick()}>
        <img width="50" height="50" src="person.jpg"/>
        <div className="info">
          <div className="user">{this.props.name}</div>
          <div className="status on">online</div>
        </div>
      </li>
    )}
});


export default class UserList extends React.Component {

  constructor(props) {
    super(props);
    this.state = { users: [] };
    this.remUser = this.remUser.bind(this);
    this.onUsers = this.onUsers.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('users',  this.onUsers);
    this.props.socket.on('addUser', this.onUsers);
    this.props.socket.on('remUser', this.remUser);

    $(".list-friends").niceScroll({
        cursorcolor: "#696c75",
        cursorwidth: "6px",
        cursorborder: "none"
    });
  }

  remUser (username) {
    print('Rem User: '+ username);
    this.setState ((prev, props) =>
      ({users : prev.users.filter(el => el.name !== username) }))
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

  // Select User
  onClick () {
    // TODO
  }

  render () {
    console.log("Render User List");

    return (
      <div className="left-menu">
        <form action="#" className="search">
          <input placeholder="search..." type="search" name="" id=""/>
          <input type="submit" value="&#xf002;"/>
        </form>
        <ul className="list-friends">
          { this.state.users.map((user) =>
            (<User key={user.name} name={user.name} onClick={this.onClick}/> )
          )}
        </ul>
      </div>
    )
  }
}
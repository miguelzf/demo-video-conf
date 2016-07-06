import React, { Component } from 'react';
import { render } from 'react-dom';

var User = React.createClass({
  render: function() {
    return (
      <li onClick={() => this.props.onClick()}>
        <img width="50" height="50" src="foto.jpg"/>
        <div className="info">
          <div className="user">{this.props.name}</div>
          <div className="status on">online</div>
        </div>
      </li>
    )}
});


export default class UserList extends React.Component {

  onClick () {
    // TODO
  }

  componentDidMount() {
      $(".list-friends").niceScroll({
        cursorcolor: "#696c75",
        cursorwidth: "6px",
        cursorborder: "none"
      });
  }

  render () {
    console.log("USer List");

    return (
      <ul className="list-friends">
        { this.props.users.map((user) => 
          (<User key={user.name} name={user.name} onClick={this.onClick}/> )
        )}
      </ul>
    )
  }
}
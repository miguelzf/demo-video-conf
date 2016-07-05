import React, { Component } from 'react';
import { render } from 'react-dom';

var User = React.createClass({
  render: function() {
    return (
      <div className="user" onClick={() => this.props.onClick()}>
        <div className="panel-body" style={{"padding" : "5px"}}>{this.props.name}</div>
      </div>
    );
  }
});


export default class UserList extends React.Component {

  onClick () {
    // TODO
  }

  render () {
    return (
      <div className="usersList">
        <center>
        { this.props.users.map((user) => 
          (<User key={user.name} name={user.name} /> )
        )}
        </center>
      </div>
    )
  }
}
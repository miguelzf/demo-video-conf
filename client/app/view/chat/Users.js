import React, { Component } from 'react';
import { render } from 'react-dom';

var User = React.createClass({
  render: function() {
    return (
      <li className={this.props.active? 'selected': ''}
          onClick={() => this.props.onClick(this.props.name)}>
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
    this.users = [];
    this.state = { visibleUsers: [] , activeUser: ''};
    this.remUser = this.remUser.bind(this);
    this.onUsers = this.onUsers.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.onClickUser = this.onClickUser.bind(this);
    this.liveSearch  = this.liveSearch.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('chat:users',  this.onUsers);
    this.props.socket.on('chat:addUser', this.onUsers);
    this.props.socket.on('chat:remUser', this.remUser);

    $(".list-friends").niceScroll({
        cursorcolor: "#696c75",
        cursorwidth: "6px",
        cursorborder: "none"
    });
  }

  remUser (username) {
    print('Rem User: '+ username);
    const newusers = this.users.filter(el => el.name !== username)
    this.users = newusers;
    this.setState({visibleUsers: newusers })
  }

  onUsers (users) {
    if (users.constructor !== Array)
      users = [users];

    print('Received users ' + users.length);

    const addUsers = users.filter(el => !this.users.find(u => u.name === el.name))
    addUsers.forEach( u => this.users.push(u))

    const newusers = this.users;
    this.setState({visibleUsers: newusers});
//    (prev, props) => ({visibleUsers: prev.visibleUsers.concat(addUsers)}))
  }

  // Select User
  onClickUser (user) {
    var auser = this.state.activeUser;
    if (auser === user)
      this.setState({activeUser: ''});
    else
      this.setState({activeUser: user});
  }

  doSearch (e) {
    e.preventDefault()
    const val = $('#usersearch').val()
    if (val.length < 3)
      this.setState({visibleUsers: this.users });
    else {
      const regexp = new RegExp(val, 'i')
      const newusers = this.users.filter(u => regexp.test(u.name))
      this.setState({visibleUsers: newusers });
    }
  }

  liveSearch (e) {
    const val = e.target.value
    if (val.length < 3)
      return;

    const regexp = new RegExp(val, 'i')
    const newusers = this.users.filter(u => regexp.test(u.name))
    this.setState({visibleUsers: newusers });
  }

  render () {
    console.log("Render User List with #of children = " + this.state.visibleUsers.length);

    return (
      <div className="left-menu">
        <form action="" className="search">
          <input placeholder="search..." type="search" name="" id="usersearch" onKeyUp={this.liveSearch} />
          <input type="submit" value="&#xf002;" readOnly="readonly" onClick={this.doSearch}/>
        </form>
        <ul className="list-friends">
          { this.state.visibleUsers.map((user) =>
            (<User key={user.name} name={user.name} onClick={this.onClickUser}
              active={this.state.activeUser == user.name} /> )
          )}
        </ul>

        <div className="left-bottom">
        { (this.state.activeUser !== '') ?
           (<form action="video" method="post">
              <input id="user" name="user" value={this.props.user} hidden="hidden" readOnly="readOnly" />
              <input id="partner" name="partner" value={this.state.activeUser} hidden="hidden" readOnly="readOnly" />
              <input id="initiator" name="initiator" value="true" hidden="hidden" readOnly="readOnly" />
              <button type="submit" className="btn btn-primary">Video Call with {this.state.activeUser}</button>
            </form>
           )
           : []
        }
        </div>
      </div>
    )
  }
}
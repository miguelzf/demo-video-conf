import React, { Component } from 'react';
import { render } from 'react-dom';

var Message = React.createClass({

  render: function() {
    var date = new Date(this.props.time).toString();
    date = date.replace(/ GMT.*/, '').replace(/ 20[0-9][0-9]/, '');

    const isMine = (curruser == this.props.name);
    const timejsx = <span key="time" className="time">{date}</span>;
    const namejsx = <span key="name" className="name">{this.props.name}</span>;
    const inner = isMine? [timejsx, namejsx] : [namejsx, timejsx]

    return (
      <li className={isMine ? 'i' : 'friend-chat'}>
        <div className="head">{inner}</div>
        <div className="message">{this.props.msg}</div>
      </li>
    )
  }
});

export default class ChatArea extends React.Component {

  componentDidMount() {
    $(".messages").niceScroll({
      cursorcolor: "#cdd2d6",
      cursorwidth: "6px",
      cursorborder: "none"
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const scroll = $(".messages").getNiceScroll(0);
    scroll.resize();
    scroll.doScrollTop(999999, 999);
  }

  render (){
    console.log("Render Chat Area");
    return (
      <ul className="messages">
      { this.props.msgs.map((msg) => 
        <Message key={msg.time.toString()} name={msg.name} msg={msg.msg} time={msg.time} />
      )}
      </ul>
    )
  }
}



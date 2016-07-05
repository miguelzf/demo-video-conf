import React, { Component } from 'react';
import { render } from 'react-dom';

var Message = React.createClass({

  render: function() {
    var date = new Date(this.props.time).toString().replace(/ GMT.*/, '');

    return (
      <span className="message">
      { '[' + date + '] ' + this.props.name + ': ' + this.props.msg +'\n' }
      </span>
    )
  }
});

export default class ChatArea extends React.Component {
  render (){

  var style = {
    width:'100%',
    height:'100%',
    boxSizing: 'border-box',
    MozBoxSizing: 'border-box'
  };

    return (
      <textarea id="chatarea" className="chatWindow" readOnly="readonly" style={style}
                value={ this.props.msgs.map((msg) =>
                   <Message key={msg.time} name={msg.name} msg={msg.msg} time={msg.time} /> )} >
       </textarea>
    )
  }
}



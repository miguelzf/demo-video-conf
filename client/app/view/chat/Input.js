import React, { Component } from 'react';
import { render } from 'react-dom';

import io from 'socket.io-client';

export default  class ChatInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = { text:'' };
    this.changeText = this.changeText.bind(this);
    this.catchEnter = this.catchEnter.bind(this);
  }

  changeText(e){
    this.setState({ text : e.target.value });
  }

  catchEnter(e) {
    if (e.keyCode == 13) {
      var text = this.state.text;
      this.setState({text: ''});
      this.props.socket.emit('message', {user: this.props.username, msg: text});
    }
  }

  render(){

    var style = {
      width:'100%',
      height:'100%',
      boxSizing: 'border-box',
      MozBoxSizing: 'border-box'
    };
    return (
      <input id="chatinput" className="chatInput" placeholder="Chat away.."
          value={this.state.text} onChange={this.changeText} onKeyUp={this.catchEnter} style={style}>
      </input>
    )
  }
}

import React, { Component } from 'react';
import { render } from 'react-dom';

import io from 'socket.io-client';

export default  class ChatInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = { text:'' };
    this.changeText = this.changeText.bind(this);
    this.catchEnter = this.catchEnter.bind(this);
    this.sendMsg    = this.sendMsg.bind(this);
  }

  changeText(e){
    this.setState({ text : e.target.value });
  }

  sendMsg() {
    var text = this.state.text.slice();
    this.setState({text: ''});
    this.props.socket.emit('chat:message', {user: this.props.username, msg: text});
  }

  catchEnter(e) {
    if (e.keyCode == 13) {
      this.sendMsg();
    }
  }

  render(){
    console.log("Render Input Areaa");

    return (
      <div className="write-form">
        <textarea placeholder="Type your message" id="texxt" rows="2"
                   value={this.state.text} onChange={this.changeText} onKeyUp={this.catchEnter}>
        </textarea>
        <i className="fa fa-picture-o"></i>
        <i className="fa fa-file-o"></i>
        <span className="send" onClick={this.sendMsg}>Send</span>
      </div>
    )
  }
}

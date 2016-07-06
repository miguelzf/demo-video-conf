import React from 'react';
import { render } from 'react-dom';
import ChatApp from './view/chat/ChatApp';

// import './style/index.css!';

// Tell react to render the component

render(<ChatApp staticName="demo-video-chat" />, document.getElementById('chat-app'));

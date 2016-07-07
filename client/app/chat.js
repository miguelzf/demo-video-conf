import React from 'react';
import { render } from 'react-dom';
import ChatApp from './view/chat/ChatApp';

// import './style/index.css!';
function print(s,s1) { console.log(s); if (s1) console.log(s1); }

// Tell react to render the component

render(<ChatApp staticName="demo-video-chat" />, document.getElementById('chat-app'));

import React from 'react';
import { render } from 'react-dom';
import NameLoader from './view/NameLoader';

import './style/index.css!';

// Tell react to render the component
render(<NameLoader staticName="demo-video-chat" />, document.getElementById('content'));

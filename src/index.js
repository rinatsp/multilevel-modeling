import ReactDOM from 'react-dom';
import React from 'react';

import App from './components/inferer/';

require('./css/main.less');

ReactDOM.render(
    <App />,
    document.querySelector('#root')
);


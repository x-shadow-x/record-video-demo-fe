import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const videoJsOptions = {
  controls: true,
  bigPlayButton: false,
  width: 320,
  height: 240,
  fluid: false,
  plugins: {
    record: {
      audio: true,
      video: true,
      maxLength: 10,
      displayMilliseconds: false,
      debug: true
    }
  }
};

ReactDOM.render(
  <React.StrictMode>
    <App { ...videoJsOptions }/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

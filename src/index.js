import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import './styles/css/main.css';
import App from './App';
import { AuthContextProvider  } from './auth';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <head>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
    </head>
    <Router>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

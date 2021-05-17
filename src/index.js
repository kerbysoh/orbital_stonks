import React from 'react';
import App from './App';
import ReactDOM from 'react-dom'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import {NewsContextProvider} from "./NewsContext"


ReactDOM.render(
  
  <Router>
    <NewsContextProvider>
      <App />
    </NewsContextProvider>
  </Router>,
  document.getElementById('root')
);



import React from 'react';
import App from './App';
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';



ReactDOM.render(
  <Router>
     <App />
  </Router>,
  document.getElementById('root')
);



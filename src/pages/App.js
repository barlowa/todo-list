import React from "react";

//react router
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Home from "./Home";
import Test from "./Test";

const Navigation = () => (

  <Router>
    <div className="routerContainer">
      <div className="navigationContainer">
        <div>
          
          <div className="logo">
            
          </div>
          <div className="headerImage">
            
          </div>
        </div>

        <div className="navigationElement">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/test">Test</Link></li>
          </ul>
        </div>
      </div>
      
      <Route exact path="/" component={Home}/>
      <Route path="/test" component={Test}/>

    </div>
  </Router>

);


export default Navigation;


import React from 'react';
import ReactDOM from 'react-dom';
// import 'react-toolbox/lib/commons.scss';           // Import common styles

import { Button } from 'react-toolbox/lib/button'; // Bundled component import
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import { AppBar, Checkbox, IconButton } from 'react-toolbox';
import {Router, Route, browserHistory, IndexRoute, hashHistory } from "react-router";


import {MainLayout} from "./components/MainLayout.jsx";
import HomeLayout from "./components/HomeLayout.jsx";
import {Login} from './components/Login.jsx';
import APMap from './components/APMap.jsx';
import AP_Dashboard from './components/AP_Dashboard.jsx';
import APHomeLayout from './components/APHomeLayout.jsx';
import env from './services/config';

class Municipalidad extends React.Component {
  constructor(props){
    super(props);
  }
/*
  render() {

    return (

  <Router history={browserHistory}>
    <Route component= {MainLayout}>

      <Route path ={env.ROUTEPATH} component={Login}></Route>

      <Route component={HomeLayout}>
        <Route path={"dashboard"} component={AP_Dashboard}></Route>
      </Route>

      <Route component={APHomeLayout}>
        <Route path={"muni:muni"} component={APMap}></Route>
      </Route>

    </Route>
  </Router>
);
}
*/
  render(){
    return (
        <APMap />
    )
  }
}


//export default Municipalidad;
ReactDOM.render(<Municipalidad />, document.getElementById('municipalidad'));

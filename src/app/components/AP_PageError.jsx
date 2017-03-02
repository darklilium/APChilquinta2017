import React from 'react';
// import 'react-toolbox/lib/commons.scss';           // Import common styles

import { Button } from 'react-toolbox/lib/button'; // Bundled component import
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import { AppBar, Checkbox, IconButton } from 'react-toolbox';
import {Router, Route, browserHistory} from "react-router";
import {Link} from "react-router";


//22:02/2017 : adding config
import env from '../services/config';

class AP_Error extends React.Component {
  componentWillMount(){
    window.location.href="index.html";
  }

  render() {
    return (
        <div></div>
    );
  }

}

export {AP_Error};

import React from 'react';
// import 'react-toolbox/lib/commons.scss';           // Import common styles

import { Button } from 'react-toolbox/lib/button'; // Bundled component import
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import { AppBar, Checkbox, IconButton } from 'react-toolbox';
import {Router, Route, browserHistory} from "react-router";
import {TabsExample} from './Tabs.jsx';
import {Link} from "react-router";
import env from '../services/config';

class Logo extends React.Component {
  onClickGoHome(){
    //browserHistory.push("chilquinta");
  }

  render() {
    let src = env.CSSDIRECTORY+'images/logo_ap.png';
    return (
          <div className="logo_content">
            <img className="img_logo" src={src} onClick={this.onClickGoHome.bind(this)}></img>
          </div>
    );
  }

}

export {Logo};

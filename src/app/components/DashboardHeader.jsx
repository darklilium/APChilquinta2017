import React from 'react';
// import 'react-toolbox/lib/commons.scss';           // Import common styles

import { Button } from 'react-toolbox/lib/button'; // Bundled component import
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import { AppBar, Checkbox, IconButton } from 'react-toolbox';
import Statistics from './Statistics.jsx';
import {Router, Route, browserHistory} from "react-router";
import {TabsExample} from './Tabs.jsx';
import {Link} from "react-router";
import {Logo} from "./Logo.jsx";
import {WidgetsMenu} from './WidgetsMenu.jsx';
import env from '../services/config';

class DashboardHeader extends React.Component {
  constructor(props){
    super(props);

  }

  handleLogout(){
    if(env.ENVIRONMENT=='DEVELOPMENT'){
      window.location.href = env.WEBSERVERADDRESS;
      //browserHistory.push(env.ROUTEPATH);
    }else{
      window.location.href = env.WEBSERVERADDRESS;
    }

  }

  render() {
    return (

            <Panel>
                <AppBar>
                  <div className="wrapperTop">
                    <Logo />
                    <div className="welcome_logout_wrapper">
                      <h6>Bienvenido: {this.props.user}</h6>
                      <IconButton icon='settings_power' inverse={ true } onClick={this.handleLogout.bind(this)} />
                    </div>

                  </div>
                </AppBar>
            </Panel>

    );
  }

}

export default DashboardHeader;

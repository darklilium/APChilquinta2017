import React from 'react';
// import 'react-toolbox/lib/commons.scss';           // Import common styles

import { Button } from 'react-toolbox/lib/button'; // Bundled component import
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import { AppBar, Checkbox, IconButton } from 'react-toolbox';
import {Router, Route, browserHistory} from "react-router";
import {TabsExample} from './Tabs.jsx';
import {Link} from "react-router";
import {Logo} from "./Logo.jsx";
import env from '../services/config';
import MuniImages from '../services/APMuniImages';
import {WidgetsMenu} from './WidgetsMenu.jsx';
import {DrawerTest} from './Drawer.jsx';

class MuniHeader extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      comunaOriginalName: ''
    }
  }

  componentDidMount(){
    console.log(this.props.titulo[0].originalName);

  }

  handleLogout(){
    if(env.ENVIRONMENT=='DEVELOPMENT'){
      browserHistory.push(env.ROUTEPATH);
    }else{
      window.location.href = env.WEBSERVERADDRESS;
    }
  }

  render() {
    let src = env.CSSDIRECTORY  + "images/logos/logos_menu/"+ this.props.logoName + ".png";

    return (

            <Panel>
                <AppBar>
                  <div className="wrapperTop">
                    <Logo />
                    <div className="wrapperTop_midTitle">
                    <h6>Ilustre Municipalidad de </h6>
                    <h5 className="muniTitulo">{this.props.titulo[0].originalName}</h5>

                    </div>
                    <div className="welcome_logout_wrapper">

                    <img src={src} ></img>
                      <DrawerTest comunaName={this.props.titulo[0].queryName} />
                      {/*<IconButton icon='settings_power' inverse={ true } onClick={this.handleLogout.bind(this)} />*/}
                    </div>

                  </div>
                </AppBar>
            </Panel>

    );
  }

}

export default MuniHeader;

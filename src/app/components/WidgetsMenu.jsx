import React from 'react';
// import 'react-toolbox/lib/commons.scss';           // Import common styles

import { Button } from 'react-toolbox/lib/button'; // Bundled component import
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import { AppBar, Checkbox, IconButton } from 'react-toolbox';
import {Router, Route, browserHistory} from "react-router";
import {TabsExample} from './Tabs.jsx';
import {Link} from "react-router";
import {Logo} from "./Logo.jsx";
import {DrawerTest} from './Drawer.jsx';
import FontIcon from 'react-toolbox/lib/font_icon';
import mymap from '../services/map-service';
import Point from 'esri/geometry/Point';

var chqIconW = "dist/css/images/icons/chilquinta_icon_white.png";
var luzLinaresIconW = "dist/css/images/icons/luzlinares_icon_white.png";
var luzParralIconW = "dist/css/images/icons/luzparral_icon_white.png";
var casablancaIconW = "dist/css/images/icons/casablanca_icon_white.png";
var litoralIconW = "dist/css/images/icons/litoral_icon_white.png";

var chqIcon="dist/css/images/icons/chilquinta_icon.png";
var luzLinaresIcon="dist/css/images/icons/luzlinares_icon.png";
var luzParralIcon ="dist/css/images/icons/luzparral_icon.png";
var casablancaIcon="dist/css/images/icons/casablanca_icon.png";
var litoralIcon="dist/css/images/icons/litoral_icon.png";

var activeStyle={
  color:"#00ff68"

}
class WidgetsMenu extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      chqIcon: chqIcon,
      luzLinaresIcon: luzLinaresIconW,
      luzParralIcon:luzParralIconW,
      casablancaIcon:casablancaIconW,
      litoralIcon:litoralIconW
    }
  }



  componentDidMount(){


    switch (browserHistory.getCurrentLocation().pathname) {
      case '/chilquinta':
        this.setState({chqIcon: chqIcon, luzLinaresIcon: luzLinaresIconW, luzParralIcon:luzParralIconW, casablancaIcon:casablancaIconW, litoralIcon:litoralIconW });
        break;
        case '/casablanca':
          this.setState({casablancaIcon: casablancaIcon, chqIcon: chqIconW, luzLinaresIcon: luzLinaresIconW, luzParralIcon:luzParralIconW, litoralIcon:litoralIconW })
          break
          case '/litoral':
            this.setState({litoralIcon: litoralIcon, chqIcon: chqIconW, luzLinaresIcon: luzLinaresIconW, luzParralIcon:luzParralIconW, casablancaIcon:casablancaIconW})
            break
            case '/linares':
              this.setState({luzLinaresIcon: luzLinaresIcon, chqIcon: chqIconW, luzParralIcon:luzParralIconW, casablancaIcon:casablancaIconW, litoralIcon:litoralIconW})
              break
              case '/parral':
                this.setState({luzParralIcon: luzParralIcon, chqIcon: chqIconW, luzLinaresIcon: luzLinaresIconW, casablancaIcon:casablancaIconW, litoralIcon:litoralIconW})
                break
                case '/statistics':
                  this.setState({chqIcon: chqIconW, luzLinaresIcon: luzLinaresIconW, luzParralIcon:luzParralIconW, casablancaIcon:casablancaIconW, litoralIcon:litoralIconW });
                  break
      default:
    }
  }

  onClickEmpresa(emp,val){
    console.log(emp);
    var mapp = mymap.getMap();


    switch (emp) {
      case 'chilquinta':
        console.log('clickeando chilquinta');
        let pointChil = new Point(-71.5373,-33.0636);
        mapp.centerAndZoom(pointChil,12);
        this.setState({chqIcon: chqIcon, luzLinaresIcon: luzLinaresIconW, luzParralIcon:luzParralIconW, casablancaIcon:casablancaIconW, litoralIcon:litoralIconW });
        break;

      case 'casablanca':
        console.log('clickeando casablanca');
        let pointCasa = new Point(-71.4077,-33.3156);
        mapp.centerAndZoom(pointCasa,12);
        this.setState({casablancaIcon: casablancaIcon, chqIcon: chqIconW, luzLinaresIcon: luzLinaresIconW, luzParralIcon:luzParralIconW, litoralIcon:litoralIconW })
      break

      case 'litoral':
        console.log('clickeando litoral');
        let pointLito = new Point(-71.6324,-33.4073);
        mapp.centerAndZoom(pointLito,11);
        this.setState({litoralIcon: litoralIcon, chqIcon: chqIconW, luzLinaresIcon: luzLinaresIconW, luzParralIcon:luzParralIconW, casablancaIcon:casablancaIconW})
      break

      case 'linares':
        let pointLina = new Point(-71.5933, -35.8447);
        mapp.centerAndZoom(pointLina,11);
        this.setState({luzLinaresIcon: luzLinaresIcon, chqIcon: chqIconW, luzParralIcon:luzParralIconW, casablancaIcon:casablancaIconW, litoralIcon:litoralIconW})
      break

      case 'parral':
        let pointParral = new Point(-71.8337, -36.1558);
        mapp.centerAndZoom(pointParral,11);
        this.setState({luzParralIcon: luzParralIcon, chqIcon: chqIconW, luzLinaresIcon: luzLinaresIconW, casablancaIcon:casablancaIconW, litoralIcon:litoralIconW})
      break

      case 'statistics':
        this.setState({chqIcon: chqIconW, luzLinaresIcon: luzLinaresIconW, luzParralIcon:luzParralIconW, casablancaIcon:casablancaIconW, litoralIcon:litoralIconW });
      break

      default:

    }
  }
  render() {
    return (
      <div className="widgetMenu_container">
        {/*<Link onClick={this.onClickEmpresa.bind(this,"chilquinta")} className="widgets_link" to={"chilquinta"}  activeStyle={activeStyle}><img className="empresas_icons" src={this.state.chqIcon}></img></Link>
        <Link onClick={this.onClickEmpresa.bind(this,"casablanca")} className="widgets_link" to={"casablanca"} activeStyle={{activeStyle}}><img className="empresas_icons" src={this.state.casablancaIcon}></img></Link>
        <Link onClick={this.onClickEmpresa.bind(this,"litoral")} className="widgets_link" to={"litoral"} activeStyle={{activeStyle}}><img className="empresas_icons" src={this.state.litoralIcon}></img></Link>
        <Link onClick={this.onClickEmpresa.bind(this,"linares")} className="widgets_link" to={"linares"} activeStyle={{activeStyle}}><img className="empresas_icons" src={this.state.luzLinaresIcon}></img></Link>
        <Link onClick={this.onClickEmpresa.bind(this,"parral")} className="widgets_link" to={"parral"} activeStyle={{activeStyle}}><img className="empresas_icons" src={this.state.luzParralIcon}></img></Link>
        <div className="vertical_hr"></div>
        <Link onClick={this.onClickEmpresa.bind(this,"statistics")} className="widgets_link" to={"statistics"}  activeStyle={{color:"#00ff68"}}><i className="material-icons">&#xE6C4;</i></Link>
      */}
        <DrawerTest />
      </div>
    );
  }

}

export {WidgetsMenu};

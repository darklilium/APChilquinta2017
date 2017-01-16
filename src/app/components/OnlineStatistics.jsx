import React from 'react';
// import 'react-toolbox/lib/commons.scss';           // Import common styles

import { Button } from 'react-toolbox/lib/button'; // Bundled component import
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import { AppBar, Checkbox, IconButton } from 'react-toolbox';
import Statistics from './Statistics.jsx';
import {Router, Route, browserHistory} from "react-router";
import {TabsExample} from './Tabs.jsx';
import {Link} from "react-router";

import layers from '../services/layers-service';
import createQueryTask from '../services/createquerytask-service';

var foo;

class OnlineStatistics extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      CLIEDOM: '0',
      CLIERED:'0',
      TOTALQTTY: '0',
      afx: ''
    }
    this.currentTotal = this.currentTotal.bind(this);
    this.clear = this.clear.bind(this);
    this.currentTotal();
    foo = function(){
              console.log("desde constr ",browserHistory.getCurrentLocation().pathname);
              if(browserHistory.getCurrentLocation().pathname=='/'){
                clearTimeout(foo);
              }else{
                console.log("updating ");
                this.currentTotal();
                setTimeout(foo, 10000);
              }
            };

            foo = foo.bind(this);
            this.clear("iniciar", foo);

  }

  clear(op, fx){
    if(op='iniciar'){
      setTimeout(fx, 10000);
      this.setState({afx: fx});
    }else{
      console.log("cleaning");
      clearTimeout(this.state.afx);
      clearTimeout(foo);
    }
  }
  componentDidMount(){
    clearTimeout(foo);
    console.log("desde OnlineStatistics componentDidMount",browserHistory.getCurrentLocation().pathname);
  }

  componentWillReceiveProps(newState){
    console.log("desde OnlineStatistics componentWillReceiveProps",browserHistory.getCurrentLocation().pathname, newState);
    this.currentTotal();
  }


  currentTotal(){
    switch (browserHistory.getCurrentLocation().pathname) {
      case '/chilquinta':
        console.log("desde chilquinta currentTotal");
        var serviceCurrTotal = createQueryTask({
          url: layers.read_layer_countTotal(),
          whereClause: "1=1"
        });

        serviceCurrTotal((map,featureSet)=>{
          this.setState({
            CLIEDOM: featureSet.features[1].attributes['CANTIDAD'],
            CLIERED: featureSet.features[0].attributes['CANTIDAD'],
            TOTALQTTY: featureSet.features[2].attributes['CANTIDAD']
          });

        },(errorCount) => {console.log("error getting the current total");});
        break;

        case '/casablanca':
          console.log("desde currentTotal casablanca");
        this.setState({
          CLIEDOM: 0,
          CLIERED: 0,
          TOTALQTTY: 0
        });
          break

        case '/litoral':
          console.log("desde litoral currentTotal");
          this.setState({
            CLIEDOM: 0,
            CLIERED: 0,
            TOTALQTTY: 0
          });
        break

        case '/linares':
          console.log("desde linares currentTotal");
            this.setState({
              CLIEDOM: 0,
              CLIERED: 0,
              TOTALQTTY: 0
            });
        break

        case '/parral':
          console.log("desde parral currentTotal");
          this.setState({
            CLIEDOM: 0,
            CLIERED: 0,
            TOTALQTTY: 0
              });
        break

        case '/statistics':
          console.log("desde statistics currentTotal");
          this.setState({
                  CLIEDOM: "--",
                  CLIERED: "--",
                  TOTALQTTY: "--"
                });
        break
        case '/':

        this.clear('asd','x');

        break
      default:
    }


  }

  render() {
    return (
          <div className="onlineStatistics_wrapper">
            <div className="vertical_hr"></div>
            <IconButton icon='home' inverse={ true }/>
            <h6 className="onlineStatistics_h6_title">DOM: </h6><h6>{this.state.CLIEDOM}</h6>
            <IconButton icon='flash_on' inverse={ true }/>
            <h6 className="onlineStatistics_h6_title">RED: </h6><h6>{this.state.CLIERED}</h6>
            <IconButton icon='equalizer' inverse={ true }/>
            <h6 className="onlineStatistics_h6_title">TOTAL: </h6><h6>{this.state.TOTALQTTY}</h6>
            <div className="vertical_hr"></div>
          </div>
    );
  }

}

export {OnlineStatistics, foo};

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {browserHistory} from 'react-router';
import DashboardHeader from "./DashboardHeader.jsx";
import Wallop from 'Wallop';
import {Button, IconButton} from 'react-toolbox/lib/button';
import MuniImages from '../services/APMuniImages';

// Helpers
function addClass(element, className) {
  if (!element) { return; }
  element.className = element.className.replace(/\s+$/gi, '') + ' ' + className;
}

function removeClass(element, className) {
  if (!element) { return; }
  element.className = element.className.replace(className, '');
}


class AP_Dashboard extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      comuna: '',
      comunaIndex: ''
    }

  }
  componentDidMount(){
    var that = this;
    var wallopEl = document.querySelector('.Wallop');
    var wallop = new Wallop(wallopEl);

    var paginationDots = Array.prototype.slice.call(document.querySelectorAll('.Wallop-dot'));

    /*
    Attach click listener on the dots
    */
    paginationDots.forEach(function (dotEl, index) {

      dotEl.addEventListener('click', function() {
        console.log(dotEl, index, "en dot..")
        wallop.goTo(index);
      });
    });

    /*
    Listen to wallop change and update classes
    */
    wallop.on('change', function(event) {
      console.log(event, paginationDots[event.detail.currentItemIndex], event.detail.currentItemIndex);
      removeClass(document.querySelector('.Wallop-dot--current'), 'Wallop-dot--current');
      addClass(paginationDots[event.detail.currentItemIndex], 'Wallop-dot--current');
      that.setState({comunaIndex: event.detail.currentItemIndex});
    });



}


onClickEntrar(){
  console.log(this.state.comunaIndex,"tengo el valor de..");
  console.log("representa a :",MuniImages[this.state.comunaIndex].name);
  this.setState({comuna:MuniImages[this.state.comunaIndex].name});
  browserHistory.push(`muni${MuniImages[this.state.comunaIndex].name}`);
}

  render(){
    let logosMuni = MuniImages.map((logoMuni, index)=>{
      let allLogos;

      if(index==0){
        return <div key={index} id={logoMuni.name} className="Wallop-item Wallop-item--current"><img key={index} src={logoMuni.original}/></div>;
      }else{
        return <div key={index} id={logoMuni.name} className="Wallop-item"><img key={index} src={logoMuni.original} /></div>;
      }

    });

    let dots =MuniImages.map((dotsMuni, index)=>{


      if(index==0){
        return <button key={index} className="Wallop-dot Wallop-dot--current">{index}</button>;
      }else{
        return <button key={index} className="Wallop-dot">{index}</button>;
      }

    });

    return (
      <div className="wrapper_APDashboard">
        <DashboardHeader user="Evelyn"/>
        <h6></h6>
        <div className="wrapper_gallery">
          <div className="Wallop Wallop--fade wallopDiv">
            <div className="Wallop-list">
              {logosMuni}
            </div>

            <div className="Wallop-pagination">
              {dots}
            </div>
            <div className="wrapperbuttons_ap" >
              <div className="btn-group apmenu_buttongroup" role="group" aria-label="...">
                <Button className="Wallop-buttonPrevious" icon='navigate_before' label='' raised primary />
                  <Button onClick={this.onClickEntrar.bind(this)} className="btnEntrarMuni" icon='power_settings_new' label='Entrar' raised primary/>
                <Button className="Wallop-buttonNext " icon='navigate_next' label='' raised primary />

              </div>


            </div>
          </div>


        </div>
      </div>

  );
  }
}

export default AP_Dashboard;

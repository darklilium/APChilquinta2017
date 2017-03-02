import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {browserHistory} from 'react-router';
import DashboardHeader from "./DashboardHeader.jsx";
import Wallop from 'Wallop';
import {Button, IconButton} from 'react-toolbox/lib/button';
import MuniImages from '../services/APMuniImages';
import cookieHandler from 'cookie-handler';
import Select from 'react-select';
import {AP_Error} from './AP_PageError.jsx';
import {getFormatedDate} from '../services/login-service';


class AP_Dashboard extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      comunaIndex: '',
      selectedComuna: 'algarrobo',
      todasLasComunas: [],
      fotoComuna: MuniImages[0].original
    }

  }
  componentWillMount(){

  }

  componentDidMount(){
    let comunas = MuniImages.map((comuna, index)=>{
      let c = {
        value: comuna.name,
        label: comuna.originalName,
        pic: comuna.original
      };
      return c;
    });
    this.setState({todasLasComunas: comunas});
    /*  var that = this;
    var wallopEl = document.querySelector('.Wallop');
    var wallop = new Wallop(wallopEl);

    var paginationDots = Array.prototype.slice.call(document.querySelectorAll('.Wallop-dot'));

    /*
    Attach click listener on the dots
    */
    /*  paginationDots.forEach(function (dotEl, index) {

      dotEl.addEventListener('click', function() {
        console.log(dotEl, index, "en dot..")
        wallop.goTo(index);
      });
    });

    /*
    Listen to wallop change and update classes
    */
    /*  wallop.on('change', function(event) {
      console.log(event, paginationDots[event.detail.currentItemIndex], event.detail.currentItemIndex);
      removeClass(document.querySelector('.Wallop-dot--current'), 'Wallop-dot--current');
      addClass(paginationDots[event.detail.currentItemIndex], 'Wallop-dot--current');
      that.setState({comunaIndex: event.detail.currentItemIndex});
    });
    */
  }


onClickEntrar(){
  console.log(this.state.selectedComuna,"tengo el valor de..");

  //browserHistory.push(`muni${this.state.selectedComuna}`);
  cookieHandler.set('mn',this.state.selectedComuna);
  window.location.href = "municipalidad.html";

}

onChangePic(e){
  if(e.value==""){
    console.log(e);
    this.setState({selectedComuna: MuniImages[0].name, fotoComuna: MuniImages[0].original})
  }else{
    this.setState({selectedComuna: e.value, fotoComuna: e.pic})

  }

}

  render(){
    let rendering = null;
    //si no hay fechaExpiracion
    if (!cookieHandler.get('wllExp')){
      window.location.href="index.html";
    //si hay fecha expiracion
    }else{

      var d = cookieHandler.get('wllExp');
      console.log(d, "vs:" , getFormatedDate());

        if(d > getFormatedDate()){
          console.log("dentro del rango");

          if(!cookieHandler.get('tkn')){
            console.log("no hay, redirect...");
            window.location.href = "index.html";
          }else{

            if(cookieHandler.get('usrnm')){
              console.log(cookieHandler.get('usrnm'),"tengo username.")
              rendering =
              <div className="wrapper_APDashboard">
                <DashboardHeader user={cookieHandler.get('usrnm')}/>
                  <div className="wrapper_gallery">
                    <div className="">
                      <div className="">
                        <img src={this.state.fotoComuna}></img>
                      </div>

                      <div className="">
                        <Select
                          name="form-field-name"
                          value={this.state.nombreComuna}
                          options={this.state.todasLasComunas}
                          value={this.state.selectedComuna}
                          onChange={this.onChangePic.bind(this)}
                          clearable={false}
                          searchable={false}
                        />
                      </div>
                      <div className="wrapperbuttons_ap" >
                        <div className="btn-group apmenu_buttongroup" role="group" aria-label="...">
                          {/*<Button className="Wallop-buttonPrevious" icon='navigate_before' label='' raised primary />*/}
                          <Button onClick={this.onClickEntrar.bind(this)} className="btnEntrarMuni" icon='power_settings_new' label='Entrar' raised primary/>
                          {/*  <Button className="Wallop-buttonNext " icon='navigate_next' label='' raised primary />*/}
                        </div>
                      </div>
                    </div>
                  </div>
              </div>;

            }
            else{
              rendering = <div><AP_Error /></div>
            }
          }
        }else{
          console.log("Token expired");
          window.location.href = "index.html";
        }
    }


    return (
      <div className="wrapper_APDashboard">
        {rendering}
      </div>

    );

  }
}

export default AP_Dashboard;

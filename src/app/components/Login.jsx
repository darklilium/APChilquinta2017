import React from 'react';
//app
import { login, loginMuni } from '../services/login-service';


//external
import cookieHandler from 'cookie-handler';
import _ from 'lodash';
import $ from 'jquery';

import Input from 'react-toolbox/lib/input';
import {Button, IconButton} from 'react-toolbox/lib/button';
import {browserHistory} from 'react-router';

import {Snackbar} from 'react-toolbox';
import env from '../services/config';

class Login extends React.Component {
  constructor(){
    super();
    this.state = {
      errorTextLabel: 'Este campo es requerido',
      snackbarMessage: '',
      active: false,
      username: '',
      password: ''

    }

  }

  componentWillReceiveProps(newState){
    console.log("en login",newState);

  }
  handleChange = (name, value) => {
     this.setState({...this.state, [name]: value});
  };



  handleKeyPress(target){
    if(target.charCode==13){
        this.onClickLogin();
    }
  }

  onClickLogin(){

    //If they dont put any username or password
    if ( (_.isEmpty(this.state.username)) || (_.isEmpty(this.state.password)) ){
      //notifications('Login incorrecto, intente nuevamente.', 'Login_Error', '.notification-login');
      console.log("login incorrecto");
      this.setState({snackbarMessage: 'Login Incorrecto. Ingrese usuario y password', snackbaropen: true});
      this.handleClick();

      return;
    }else{
      console.log("login correcto pero..")
      //For domain users
      if (this.state.username.includes('vialactea\\')){
        console.log("login con vialactea");
        console.log("Trying to access REACT_AP_WEB");
        login(this.state.username, this.state.password, 'REACT_AP_WEB', callback=>{
          console.log("aa",callback);
          if(!callback.error){
          //  window.location.href = "interrupciones.html";
            //browserHistory.push("chilquinta");
            console.log("mi usuario tiene vialactea, entrar en dashboard de ap");
            browserHistory.push("dashboard");
          }else{
            this.setState({snackbarMessage: "Login incorrecto. Trate nuevamente."});
            this.handleClick();
          }
        });
        return;
      //check if start with muni or is another thing.
      }else {
        console.log("Trying to access REACT_AP_WEB");
        let uname = this.state.username;
          if(this.state.username.substring(0,4)=="muni"){

            loginMuni(uname,this.state.password,callback=>{
              if(!callback.error){
              //  window.location.href = "interrupciones.html";
                console.log("municipalidad de..:",this.state.username.substring(4,this.state.username.length));
                let muni = this.state.username.substring(4,this.state.username.length);
                browserHistory.push(`muni${muni}`);
                console.log("mi usuario contiene muni, entrando directamente a la municipalidad que soy");

              }else{
                console.log("mi usuario tiene muni pero se logueo mal");
                this.setState({snackbarMessage: "Login incorrecto. Trate nuevamente."});
                this.handleClick();
              }
            });
          }else{
            let userValue =  'vialactea\\'+this.state.username;
            login(userValue, this.state.password, 'REACT_AP_WEB', callback=>{
              if(!callback.error){
                  //browserHistory.push("chilquinta");
                  console.log("mi usuario no es municipal, entrando en dashboard de ap");
                  browserHistory.push("dashboard");
              }else{
                this.setState({snackbarMessage: "Login incorrecto, intente nuevamente. " +callback.message});
                this.handleClick();
              }
            });
          }

      }
    }
  }

  componentDidMount(){
    console.log("charging")
      //change the loginwall dinamically
      let randomPicNumber = Math.floor((Math.random() * 6) + 1);
      //********Cambiar randomPicSrc para test/prod*******
      //let randomPicSrc = "css/images/login_images/loginwall"+ randomPicNumber+ ".jpg"; //prod
      let randomPicSrc = env.CSSDIRECTORY+ "images/login_images/loginwall"+ randomPicNumber+ ".jpg";//desarrollo
        console.log("changing login wall", );
      $('.login_wrapper_content').css("background-image", "url("+randomPicSrc+")").css('background-size','100% 100%');
  }

  handleSnackbarClick = () => {
     this.setState({active: false})
  };

  handleClick = () => {
   this.setState({active: true})
  };

  render(){
  let src = env.CSSDIRECTORY + 'images/logo_ap.png';
    return (

          <div className="login_wrapper_content">
            <div className="login_div">
            <img className="login_logo" src={src}></img>
            <Input className="login_input" type='text' label='Usuario' name='name' icon="person" value={this.state.username} onChange={this.handleChange.bind(this, 'username')} />
            <Input className="login_input" type='password' label='Contraseña' name='name' icon="lock" value={this.state.password} onChange={this.handleChange.bind(this, 'password')} onKeyPress={this.handleKeyPress.bind(this)}  />
            <Button icon='power_settings_new' label='Login' raised primary className="login_button" onClick={this.onClickLogin.bind(this)} />
            </div>
            <Snackbar action='Aceptar' active={this.state.active} icon='error' label={this.state.snackbarMessage} onClick={this.handleSnackbarClick.bind(this)} onTimeout={this.handleSnackbarTimeout} type='cancel' />

          </div>

    );
  }
}

export {Login}

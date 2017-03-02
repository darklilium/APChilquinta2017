
import myLayers from '../services/layers-service';
import token from '../services/token-service';
import createQueryTask from '../services/createquerytask-service';
import cookieHandler from 'cookie-handler';
import _ from 'lodash';
import $ from 'jquery';
import {regionsExtent} from '../services/regionsExtent-service';
import QueryTask from 'esri/tasks/QueryTask';
import my_AP_Settings from '../services/ap_settings-service';
import env from '../services/config';
//09/11
function login(user, pass, app, callback){
  console.log("mi usuario es vialactea o no sin muni al principio", user);
  let snackbarRet;

  const url = myLayers.read_generateTokenURL();

  const data = {
    username: user,
    password: pass,
    client: 'requestip',
    expiration: 10080,
    format: 'jsonp'
  };

  $.ajax({
    method: 'POST',
    url: url,
    data: data,
    dataType: 'html'
  })
  .done(myToken => {
    if(myToken.indexOf('Exception') >= 0) {
      let snackbarRet = {
        message: "Hubo un problema iniciando sesión, intente nuevamente. (Exception).",
        open: true,
        error: true
      };
      return callback(snackbarRet);
    }
    if (myToken.indexOf('error') >= 0){

      let snackbarRet = {
        message: "Error al iniciar sesión, intente nuevamente. (Error).",
        open: true,
        error: true
      };
      return callback(snackbarRet);

    }


    switch (app) {
      case 'REACT_INTERRUPCIONES_WEB':
        interrupciones_login(app+'_DESA', myToken, user, (cback)=>{
          if(cback){
            let snackbarRet = {
              message: "Iniciando Sesión",
              open: true,
              error: false
            };
            return callback(snackbarRet);
          }else{
            let snackbarRet = {
              message: "Hubo un problema iniciando sesión, intente nuevamente.",
              open: true,
              error: true
            };
            return callback(snackbarRet);
          }

        });
      break;

      case 'REACT_FACTIGIS':
          return callback();
      break;

      case 'REACT_AP_WEB':
          //return callback();
          let appli = env.SAVEAPPLICATIONNAME;
          ap_login(appli, myToken, user, (cback)=>{
            if(cback){
              let snackbarRet = {
                message: "Iniciando Sesión",
                open: true,
                error: false
              };
              return callback(snackbarRet);
            }else{
              let snackbarRet = {
                message: "Hubo un problema iniciando sesión, intente nuevamente.",
                open: true,
                error: true
              };
              return callback(snackbarRet);
            }
          });
      break;

      default:
    }
  })
  .fail(error => {
    console.log("You are not authorized ):", error);
    snackbarRet = {
      message: error.responseText,
      open: true,
      error: true
    };
    return callback(snackbarRet)

  });

  console.log('Transaction for Login Access Done');
}


//09/11
function interrupciones_login(page, tkn, user, callback){
  console.log('Requesting service access..., logging in to gisred-interruptions');
  token.write(tkn);
  const module = "PO_INTERRUPCIONES_DESA";

  saveLogin(user,page,module,tkn, (cb)=>{
    if(cb){
      return callback(true)
    }else{
      return callback(false)
    }
  });
}

function ap_login(page, tkn, user, callback){
  console.log('Requesting service access..., logging in to gisred-ap');
  token.write(tkn);
  const module = env.SAVEAPPLICATIONMODULE;

  //19/01/2017: agregar usuario que loguea a dashboard.
  cookieHandler.set('usrnm',user);
  saveLogin(user,page,module,tkn, (cb)=>{
    if(cb){
      return callback(true)
    }else{
      return callback(false)
    }
  });
}

//09/11
function saveLogin(user,page,mod,tkn, callback){

  const data = {
    f: 'json',
    adds: JSON.stringify([{ attributes: { "usuario": user, "pagina": page, "modulo": mod  }, geometry: {} }]),
    token: tkn
  };

  $.ajax({
    method: 'POST',
    url: myLayers.read_logAcessosSave(),
    dataType:'html',
    data: data
  })
  .done(d =>{
    let json = JSON.parse(d);
    if( (_.has(json,'error')) ){
      return callback(false);
    }else{
      if(json["addResults"][0].objectId>0){
        return callback(true);

      }else{
        return callback(false);
      }
    }
  })
  .fail(f=>{
    console.log(f,"no pase");
    return callback(false);
  });
}

function loginMuni(user,pass, callback){
  const url = myLayers.read_generateTokenURL();
  const genericUser = {
    user: 'vialactea\\ehernanr',
    pass: 'Chilquinta8'
  };
  const data = {
    username: genericUser.user,
    password: genericUser.pass,
    client: 'requestip',
    expiration: 1440,
    format: 'jsonp'
  };

  $.ajax({
    method: 'POST',
    url: url,
    data: data,
    dataType: 'html'
  })
  .done(myToken => {
    if(myToken.indexOf('Exception') >= 0) {
      let snackbarRet = {
        message: "Hubo un problema iniciando sesión, intente nuevamente.",
        open: true,
        error: true
      };
      return callback(snackbarRet);
    }
    if (myToken.indexOf('error') >= 0){
      let snackbarRet = {
        message: "Hubo un problema iniciando sesión, intente nuevamente.",
        open: true,
        error: true
      };
      return callback(snackbarRet);
    }

    console.log('Requesting service access');
    console.log('Logging in to gisred-ap');
    console.log('writing token into system');
    token.write(myToken);

    const page = "REACT_AP_WEB";
    const module = "AP_CHQ";



    saveSettings(user,(cb)=>{
      if(cb){
        let snackbarRet = {
          message: "Iniciando Sesión",
          open: true,
          error: false
        };
        return callback(snackbarRet);
      }else{
        let snackbarRet = {
          message: "Hubo un problema iniciando sesión, intente nuevamente.",
          open: true,
          error: true
        };
        return callback(snackbarRet);
      }
    });


    // saveLogin(user,page,module,myToken);
  })
  .fail(error => {
    console.log("You are not authorized ):");
    let snackbarRet = {
      message: "Hubo un problema iniciando sesión, intente nuevamente.",
      open: true,
      error: true
    };
    return callback(snackbarRet);


  });

  console.log('done');
}

function saveSettings(user, callback){
  var qTaskOfficeChilquinta = new QueryTask(myLayers.read_logAccess());
    var qOfficeChilquinta = new esri.tasks.Query();
    qOfficeChilquinta.where = "usuario = '"+ user+ "'";
    qOfficeChilquinta.returnGeometry = false;
    qOfficeChilquinta.outFields=["*"];


    qTaskOfficeChilquinta.execute(qOfficeChilquinta, (featureSet)=>{


      if(featureSet.features.length){
        let myRegion = regionsExtent().filter(region =>{
        return region[0] ==  featureSet.features[0].attributes.widget;
        });

        //logo,comuna,latx,laty,zoom
        my_AP_Settings.write(
          featureSet.features[0].attributes.usuario, //logo
          featureSet.features[0].attributes.widget, //region
          myRegion[0][1], //latx
          myRegion[0][2], //laty
          myRegion[0][3]
        ); //zoom

          return callback(true);
      }else{
        console.log("error con save settings de usuario");
        return callback(false);
      }


    }, (Errorq)=>{
        console.log("Error doing query ");
        return callback(false);
    });
}

function getFormatedDate(){
  var d = new Date();

  var str = "day/month/year hour:minute:second"
    .replace('day', d.getDate() <10? '0'+ d.getDate() : d.getDate())
    .replace('month', (d.getMonth() + 1) <10? '0' + (d.getMonth()+1) : (d.getMonth()+1))
    .replace('year', d.getFullYear())
    .replace('hour', d.getHours() <10? '0'+ d.getHours() : d.getHours() )
    .replace('minute', d.getMinutes() <10? '0'+ d.getMinutes() : d.getMinutes())
    .replace('second', d.getSeconds() <10? '0'+ d.getSeconds() : d.getSeconds());
    console.log("Today",str);
  return str;
}

//se agrega +1 al día
function getFormatedDateExp(){
  var d = new Date();

  var str = "day/month/year hour:minute:second"
    .replace('day', d.getDate() <10? '0'+ d.getDate()+1 : d.getDate()+1)
    .replace('month', (d.getMonth() + 1) <10? '0' + (d.getMonth()+1) : (d.getMonth()+1))
    .replace('year', d.getFullYear())
    .replace('hour', d.getHours() <10? '0'+ d.getHours() : d.getHours() )
    .replace('minute', d.getMinutes() <10? '0'+ d.getMinutes() : d.getMinutes())
    .replace('second', d.getSeconds() <10? '0'+ d.getSeconds() : d.getSeconds());
    console.log(str);
  return str;
}
export {login, saveLogin, loginMuni, getFormatedDate, getFormatedDateExp};

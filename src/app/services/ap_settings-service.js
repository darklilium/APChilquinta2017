import cookieHandler from 'cookie-handler';

function my_AP_Settings(){
  var my_ap_settings = {
    logo: '',
    comuna: '',
    latx: '',
    laty: '',
    zoom: ''
  };
  return {

    read(){
      return cookieHandler.get('sttngs');
    },

    write(logo,comuna,latx,laty,zoom){
      my_ap_settings = {
        logo: logo,
        comuna: comuna,
        latx: latx,
        laty: laty,
        zoom: zoom
      };
      cookieHandler.set('sttngs',my_ap_settings);

    },
    delete(){
      cookieHandler.remove('sttngs');
    }
  };
}

function myValuesSelected(){
  var mySelectedValues = {
    idMedidor: '',
    idLuminaria: '',
    idLuminariaAsociada: '',
    idEquipoLuminaria: ''
  };

  return {
    read(){
      return cookieHandler.get('mslctdvls');

    },
    writeIDMedidor(idMedidor){
      mySelectedValues.idMedidor = idMedidor;
      cookieHandler.set('mslctdvls', mySelectedValues);
    },
    writeIDLuminaria(idLuminaria){
      mySelectedValues.idLuminaria = idLuminaria;
      cookieHandler.set('mslctdvls', mySelectedValues);
    },
    writeIDLuminariaAsociada(idLuminariaAsociada){
      mySelectedValues.idLuminariaAsociada = idLuminariaAsociada;
      cookieHandler.set('mslctdvls', mySelectedValues);
    },
    writeIDEquipoLuminaria(idEquipoLuminaria){
      mySelectedValues.idEquipoLuminaria = idEquipoLuminaria;
      cookieHandler.set('mslctdvls', mySelectedValues);
    },
    delete(){
      cookieHandler.remove('mslctdvls');
    }

  };
}




var myDisplayedMedidor = {
  setMyDisplayedMedidor: function(medidor){
    this.myDisplayedMedidor = medidor;

  },
  getMyDisplayedMedidor: function(){
    return this.myDisplayedMedidor;
  }
};

var myDisplayedLuminaria = {
  setMyDisplayedLuminaria: function(luminaria){
    this.myDisplayedLuminaria = luminaria;

  },
  getMyDisplayedLuminaria: function(){
    return this.myDisplayedLuminaria;
  }
};

var myDisplayedLuminariaAsociada = {
  setMyDisplayedAsociada: function(asociada){
    this.myDisplayedLuminariaAsociada = asociada;

  },
  getMyDisplayedAsociada: function(){
    return this.myDisplayedLuminariaAsociada;
  }
};

export default my_AP_Settings();
export {myValuesSelected,myDisplayedMedidor,myDisplayedLuminaria,myDisplayedLuminariaAsociada};

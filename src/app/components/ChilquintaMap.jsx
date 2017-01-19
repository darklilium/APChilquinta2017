import React from 'react';
import mymap from '../services/map-service';;
import ArcGISDynamicMapServiceLayer from 'esri/layers/ArcGISDynamicMapServiceLayer';
import layers from '../services/layers-service';
import myinfotemplate from '../utils/infoTemplates';
import {browserHistory} from 'react-router';
import {Simbologia} from './Simbologia.jsx';
import MuniHeader from './MuniHeader.jsx';
import MuniImages from '../services/APMuniImages';
import on from 'dojo/on';
import _ from 'lodash';
import {Snackbar} from 'react-toolbox';
import {ap_infoWindow} from '../utils/makeInfowindow';
import Drawer from 'react-toolbox/lib/drawer';
import {Logo} from "./Logo.jsx";
import { Button } from 'react-toolbox/lib/button';
import Select from 'react-select';
import Input from 'react-toolbox/lib/input';
import FeatureLayer from 'esri/layers/FeatureLayer';
import Wallop from 'Wallop';
import ReactTabs from 'react-tabs';
import {getFotografías, getInfoLuminariaSeleccionada, getInfoLuminariaModificaciones, getInfoLuminariaCercana} from '../services/queryData';
import Slider from 'react-slick';
import env from '../services/config';
import {nuevoQuery} from '../services/addQuery';
import ProgressBar from 'react-toolbox/lib/progress_bar';

const opcionesTipo = [
  { value: 'NA', label: 'NA', type: 'tipoluminaria' },
  { value: 'Hg', label: 'Hg', type: 'tipoluminaria' },
  { value: 'Halogeno', label: 'Halógeno', type: 'tipoluminaria' },
  { value: 'Haluro Metalico', label: 'Haluro Metálico', type: 'tipoluminaria' },
  { value: 'Incandecente', label: 'Incandescente', type: 'tipoluminaria' },
  { value: 'LED', label: 'LED', type: 'tipoluminaria' },
  { value: 'Ornamental', label: 'Ornamental', type: 'tipoluminaria' }
];

const opcionesTipoConexion = [
  { value: 'Red AP', label: 'Red AP', type: 'tipoconexion' },
  { value: 'Directo a Red BT', label: 'Directo a Red BT', type: 'tipoconexion' },
  { value: 'Hilo Piloto', label: 'Hilo Piloto', type: 'tipoconexion' },
  { value: 'Indeterminada', label: 'Indeterminada', type: 'tipoconexion' }
];

const opcionesPropiedad = [
  { value: 'Empresa', label: 'Empresa', type: 'tipopropiedad' },
  { value: 'Particular', label: 'Particular', type: 'tipopropiedad'  },
  { value: 'Municipal', label: 'Municipal', type: 'tipopropiedad'  },
  { value: 'Otro', label: 'Otro' , type: 'tipopropiedad' },
  { value: 'Virtual', label: 'Virtual' , type: 'tipopropiedad' }
];

var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

const opcionesPotencia = [
  { value: 0, label: '0', type: 'tipopotencia' },
  { value: 1, label: '1', type: 'tipopotencia'  },
  { value: 2, label: '2', type: 'tipopotencia'  },
  { value: 3, label: '3', type: 'tipopotencia' },
  { value: 4, label: '4', type: 'tipopotencia' },
  { value: 5, label: '5', type: 'tipopotencia' },
  { value: 32, label: '32', type: 'tipopotencia'  },
  { value: 50, label: '50', type: 'tipopotencia'  },
  { value: 54, label: '54', type: 'tipopotencia' },
  { value: 60, label: '60', type: 'tipopotencia' },
  { value: 65, label: '65', type: 'tipopotencia' },
  { value: 70, label: '70', type: 'tipopotencia'  },
  { value: 80, label: '80', type: 'tipopotencia'  },
  { value: 90, label: '90', type: 'tipopotencia' },
  { value: 95, label: '95', type: 'tipopotencia' },
  { value: 100, label: '100', type: 'tipopotencia' },
  { value: 120, label: '120', type: 'tipopotencia' },
  { value: 125, label: '125', type: 'tipopotencia'  },
  { value: 130, label: '130', type: 'tipopotencia'  },
  { value: 150, label: '150', type: 'tipopotencia' },
  { value: 155, label: '155', type: 'tipopotencia' },
  { value: 200, label: '200', type: 'tipopotencia'  },
  { value: 250, label: '250', type: 'tipopotencia' },
  { value: 300, label: '300', type: 'tipopotencia' },
  { value: 400, label: '400', type: 'tipopotencia' },
  { value: 500, label: '500', type: 'tipopotencia' },
  { value: 1000, label: '1000', type: 'tipopotencia' }

]
var defaultPic = (<div><img id="foto0" src={env.CSSDIRECTORY + "images/nofoto.png"}></img></div>);

class ChilquintaMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      comuna: '',
      layers: '',
      activeSnackbar: false,
      snackbarIcon: 'error',
      snackbarMessage: '',
      active: false,
      datosLuminariaAEditar: '',
      datosLuminariaModificada: '',
      tipoLuminaria: '',
      tipoConexion: '',
      tipoPropiedad: '',
      tipoPotencia: '',
      rotulo: '',
      fotografías: [],
      dots: '',
      selectedTab: 0,
      slider : '',
      rotateImgAngle: 0,
      showThumbs: false,
      currentPic: 'foto0'
    }


  }

  componentWillMount(){

      let originalName = MuniImages.filter((logoMuni, index)=>{
        return logoMuni.name == this.props.params.muni;
      });

      this.setState({comuna: originalName, fotografias: [] });

  }

  componentDidMount(){

  /*var mapp = new Map("map",{basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
          center: [-71.2905, -33.1009], // longitude, latitude
          zoom: 9});
  */
  //console.log("tengo estas props en map",this.props.params.muni);

  var mapp = mymap.createMap("map","topo",this.state.comuna[0].extent[0], this.state.comuna[0].extent[1],12);

  //layers para ap.
  var luminariasLayer = new esri.layers.FeatureLayer(layers.read_luminarias(),{id:"ap_luminarias", mode: esri.layers.FeatureLayer.MODE_ONDEMAND, minScale: 5000, outFields: ["*"]});
  luminariasLayer.setDefinitionExpression("COMUNA = '"+ this.state.comuna[0].queryName+"'" );

  var tramosAPLayer = new esri.layers.FeatureLayer(layers.read_tramosAP(),{id:"ap_tramos", mode: esri.layers.FeatureLayer.MODE_ONDEMAND, minScale: 5000});
  tramosAPLayer.setDefinitionExpression("comuna  = '"+ this.state.comuna[0].queryName+"'" );

  var modificadasLayer = new esri.layers.FeatureLayer(layers.read_modificacionesAP(),{id:"ap_modificaciones", mode: esri.layers.FeatureLayer.MODE_ONDEMAND, minScale: 5000, outFields: ["*"]});
  modificadasLayer.setDefinitionExpression("Comuna  = '"+ this.state.comuna[0].queryName+"'" );

  var limiteComunalLayer = new esri.layers.FeatureLayer(layers.read_limiteComunal(),{id:"ap_limiteComunal", mode: esri.layers.FeatureLayer.MODE_ONDEMAND});
  limiteComunalLayer.setDefinitionExpression("nombre   = '"+ this.state.comuna[0].queryName+"'" );

  mapp.addLayers([limiteComunalLayer,tramosAPLayer,luminariasLayer, modificadasLayer]);

  this.setState({layers: [luminariasLayer,tramosAPLayer,modificadasLayer,limiteComunalLayer]})

  luminariasLayer.on('mouse-over',(event)=>{

        ap_infoWindow(event.graphic.attributes['ID_LUMINARIA'],
          event.graphic.attributes['ROTULO'],
          event.graphic.attributes['TIPO_CONEXION'],
          event.graphic.attributes['DESCRIPCION'],
          event.graphic.attributes['PROPIEDAD'],
          event.graphic.attributes['MEDIDO_TERRENO'],
          event.graphic.geometry);
      });

    //abre editor de luminarias

  //cuando se hace click en una luminaria sin modificaciones, se buscan los valores.
  luminariasLayer.on('click',(event)=>{

      let editarLuminaria = {
        id_luminaria: event.graphic.attributes['ID_LUMINARIA'],
        id_nodo: event.graphic.attributes['ID_NODO'],
        tipo_conexion: event.graphic.attributes['TIPO_CONEXION'],
        tipo: event.graphic.attributes['TIPO'],
        potencia:  event.graphic.attributes['POTENCIA'],
        propiedad: event.graphic.attributes['PROPIEDAD'],
        rotulo : event.graphic.attributes['ROTULO'],
        observaciones: event.graphic.attributes['OBSERVACION'],
        geometria: event.graphic.geometry
      }

      this.setState({
        tipoLuminaria:  event.graphic.attributes['TIPO'],
        tipoConexion: event.graphic.attributes['TIPO_CONEXION'],
        tipoPropiedad: event.graphic.attributes['PROPIEDAD'],
        tipoPotencia: event.graphic.attributes['POTENCIA'],
        rotulo: event.graphic.attributes['ROTULO'],
        selectedTab: 0
      });

      this.setState({active: true, datosLuminariaAEditar: editarLuminaria, datosLuminariaModificada: {}});
      //Luego se buscan si existen modificaciones para esa luminaria.

      getInfoLuminariaModificaciones(event.graphic.attributes['ID_NODO'], event.graphic.attributes['ID_LUMINARIA'], (callback)=>{
        if(callback[0]){
          console.log(callback,"tengo esto de vuelta");
          let luminariaModificada = {
            id_luminaria: callback[1][0].attributes['id_luminaria'],
            id_nodo: callback[1][0].attributes['id_nodo'],
            tipo_conexion: callback[1][0].attributes['tipo_cnx'],
            tipo: callback[1][0].attributes['tipo'],
            potencia:  callback[1][0].attributes['potencia'],
            propiedad:callback[1][0].attributes['propiedad'],
            rotulo : callback[1][0].attributes['rotulo'],
            observaciones: callback[1][0].attributes['obs'],
            geometria: callback[1][0].geometry
          }
          this.setState({datosLuminariaModificada: luminariaModificada})
        }else{
          console.log("No hay datos de modificacion");
        }
      });
    });

  //cuando se hace click en una luminaria modificada . Setear los campos en rojo para la modificacion
  modificadasLayer.on('click',(event)=>{

    console.log("modificada", event.graphic.attributes['id_nodo']);

        let luminariaModificada = {
          id_luminaria: event.graphic.attributes['id_luminaria'],
          id_nodo: event.graphic.attributes['id_nodo'],
          tipo_conexion: event.graphic.attributes['tipo_cnx'],
          tipo: event.graphic.attributes['tipo'],
          potencia:  event.graphic.attributes['potencia'],
          propiedad: event.graphic.attributes['propiedad'],
          rotulo : event.graphic.attributes['rotulo'],
          observaciones: event.graphic.attributes['obs'],
          geometria: event.graphic.geometry

        }
        console.log("en modificaciones", luminariaModificada);
        //buscar la correlacion para modificar de la luminaria de acuerdi al id_nodo:
        getInfoLuminariaSeleccionada(event.graphic.attributes['id_luminaria'], callback=>{
          if(callback[0]){
            let editarLuminaria = {
              id_luminaria: callback[1][0].attributes['ID_LUMINARIA'],
              id_nodo: callback[1][0].attributes['ID_NODO'],
              tipo_conexion: callback[1][0].attributes['TIPO_CONEXION'],
              tipo: callback[1][0].attributes['TIPO'],
              potencia:  callback[1][0].attributes['POTENCIA'],
              propiedad: callback[1][0].attributes['PROPIEDAD'],
              rotulo : callback[1][0].attributes['ROTULO'],
              observaciones: callback[1][0].attributes['OBSERVACION'],
              geometria: callback[1][0].geometry
            }

            console.log(callback[1][0].attributes);
            this.setState({datosLuminariaModificada: luminariaModificada, active: true });
            this.setState({datosLuminariaAEditar: editarLuminaria});
            this.setState({
              tipoConexion: callback[1][0].attributes['TIPO_CONEXION'],
              tipoLuminaria: callback[1][0].attributes['TIPO'],
              tipoPotencia: callback[1][0].attributes['POTENCIA'],
              tipoPropiedad: callback[1][0].attributes['PROPIEDAD'],
              rotulo: callback[1][0].attributes['ROTULO'],
              selectedTab: 0
            });
          }else{
            console.log("No hay datos de luminaria cercana");
          }

        });

      /*  getInfoLuminariaSeleccionada( event.graphic.attributes['id_nodo'], (callback)=>{
          if(!callback[0]){

            this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[3] });
            $('.theme__icon___4OQx3').css('color',callback[4]);
            $('.drawer_progressBar').css('visibility','hidden');
            return;
          }


          let editarLuminaria = {
            id_luminaria: callback[1][0].attributes['ID_LUMINARIA'],
            id_nodo: callback[1][0].attributes['ID_NODO'],
            tipo_conexion: callback[1][0].attributes['TIPO_CONEXION'],
            tipo: callback[1][0].attributes['TIPO'],
            potencia:  callback[1][0].attributes['POTENCIA'],
            propiedad: callback[1][0].attributes['PROPIEDAD'],
            rotulo : callback[1][0].attributes['ROTULO'],
            observaciones:callback[1][0].attributes['OBSERVACION'],
            geometria: callback[1][0].geometry
          }

          this.setState({
            tipoLuminaria: callback[1][0].attributes['TIPO'],
            tipoConexion: callback[1][0].attributes['TIPO_CONEXION'],
            tipoPropiedad:callback[1][0].attributes['PROPIEDAD'],
            tipoPotencia: callback[1][0].attributes['POTENCIA'],
            rotulo: callback[1][0].attributes['ROTULO'],
            selectedTab: 0,
            tipoObservaciones: callback[1][0].attributes['OBSERVACION']
          });

        });
        */

      });


}

  handleSnackbarClick = () => {
    this.setState({activeSnackbar: false});

    var mapp = mymap.getMap();

    if(!_.isEmpty(mapp)){
      mapp.graphics.clear();
      mapp.infoWindow.hide();
    }
  };

  handleToggleEditar(){
    this.setState({active: !this.state.active});
  }

  logChange(valor) {
      console.log("Selected: " + valor.value);

      switch (valor.type) {
        case 'tipoluminaria':
            this.setState({tipoLuminaria: valor.value});
          break;
          case 'tipoconexion':
              this.setState({tipoConexion: valor.value});
            break;
            case 'tipopropiedad':
                this.setState({tipoPropiedad: valor.value});
              break;
              case 'tipopotencia':
                  this.setState({tipoPotencia: valor.value});
                break;
        default:

      }

  }

  handleChangeRotulo(name, value){
    console.log("name:", name);
    console.log("value:", value);

    this.setState({rotulo: name});
  }

  handleChangeObservaciones(name, value){
    console.log("name:", name);
    console.log("value:", value);

    this.setState({observaciones: name});
  }

  handleSelect(index, last){

      this.setState({selectedTab: index});
      console.log("en tab", index);

      switch (index) {
        case 1:
          $('.drawer_progressBar').css('visibility',"visible");
          getFotografías(this.state.datosLuminariaAEditar.id_nodo, (callback)=>{
              if(!callback[0]){
                console.log("no hay fotos", callback);
                let f = [];
                let noPicImg = env.CSSDIRECTORY + "images/nofoto.png";
                this.setState({fotografias: [], showThumbs: false});
                $('.drawer_progressBar').css('visibility',"hidden");
                return;
              }

              console.log("recibiendo fotos desde callback", callback);
              let f = callback[1].map((foto, index)=>{
                //return foto.url;
                return  foto.url
              });
              this.setState({fotografias: f, showThumbs: true});
              $('.drawer_progressBar').css('visibility',"hidden");
            /*  let DisplayPics;
              if(callback[0]){
                let fotos  = callback[1].map((foto,index)=>{
                  return <div><img id={"foto"+index} src={foto} /></div>
                })
                this.setState({fotografias: fotos});
                console.log("hay fotos");


              }else{
                DisplayPics = (<div><img id="foto0" src={env.CSSDIRECTORY + "images/nofoto.png"}></img></div>);
                console.log("no hay fotos");
                this.setState({fotografias: DisplayPics});
              }
              */

          });

        break;

        case 0:

        break;
        default:

      }
  }

  onNuevo(){
    if( this.state.rotulo=="" ){
      console.log("rotulo no definido, no se puede ingresar.");
      return;
    }

    let nuevosAttr = {
      rotulo: this.state.rotulo,
      Comuna: this.state.comuna[0].queryName,
      corregido: "Revisar",
      tipo_cnx: this.state.tipoConexion,
      tipo:  this.state.tipoLuminaria,
      potencia:  this.state.tipoPotencia,
      propiedad: this.state.tipoPropiedad,
      eliminar: "nuevo",
      obs: this.state.observaciones,
      id_luminaria: this.state.datosLuminariaAEditar.id_luminaria,
      id_nodo:this.state.datosLuminariaAEditar.id_nodo

    }

    console.log(nuevosAttr, this.state.datosLuminariaAEditar.geometria);

    nuevoQuery(nuevosAttr, this.state.datosLuminariaAEditar.geometria, (callback)=>{
      console.log("tengo callback", callback);
    });
  }

  onEliminar(){
    if( this.state.rotulo=="" ){
      console.log("rotulo no definido, no se puede ingresar.");
      return;
    }

    let nuevosAttr = {
      rotulo: this.state.rotulo,
      Comuna: this.state.comuna[0].queryName,
      corregido: "Revisar",
      tipo_cnx: this.state.tipoConexion,
      tipo:  this.state.tipoLuminaria,
      potencia:  this.state.tipoPotencia,
      propiedad: this.state.tipoPropiedad,
      eliminar: "eliminar",
      obs: this.state.observaciones,
      id_luminaria: this.state.datosLuminariaAEditar.id_luminaria,
      id_nodo:this.state.datosLuminariaAEditar.id_nodo

    }

    console.log(nuevosAttr, this.state.datosLuminariaAEditar.geometria);

    nuevoQuery(nuevosAttr, this.state.datosLuminariaAEditar.geometria, (callback)=>{
      console.log("tengo callback", callback);
    });
  }

  onActualizar(){
    if( this.state.rotulo=="" ){
      console.log("rotulo no definido, no se puede ingresar.");
      return;
    }

    let nuevosAttr = {
      rotulo: this.state.rotulo,
      Comuna: this.state.comuna[0].queryName,
      corregido: "Revisar",
      tipo_cnx: this.state.tipoConexion,
      tipo:  this.state.tipoLuminaria,
      potencia:  this.state.tipoPotencia,
      propiedad: this.state.tipoPropiedad,
      eliminar: "modificar",
      obs: this.state.observaciones,
      id_luminaria: this.state.datosLuminariaAEditar.id_luminaria,
      id_nodo:this.state.datosLuminariaAEditar.id_nodo

    }

    console.log(nuevosAttr, this.state.datosLuminariaAEditar.geometria);

    nuevoQuery(nuevosAttr, this.state.datosLuminariaAEditar.geometria, (callback)=>{
      console.log("tengo callback", callback);
    });
  }

  onVerFotografía(e){

    console.log(this.state.currentPic,"current");
    let linkk = $('#'+this.state.currentPic).attr('src');
    console.log(linkk);
    //currentPic
    window.open('http://gisred.chilquinta.cl:5555/lacruz/web/test/index.html?foto='+linkk, "_blank");



  }
  afterChange(e){
    console.log(e,"traigo esto after change");
    let c = "foto"+e;
    this.setState({currentPic: c})
  }

  render(){
    let logoName = this.props.params.muni;
    var settings = {
      dots: true
    };
    let nofoto= env.CSSDIRECTORY + "images/nofoto.png";

    let DisplayPics;

    if(this.state.fotografias.length){
      let fotos  = this.state.fotografias.map((foto,index)=>{
        return <div><img id={"foto"+index} src={foto} /></div>
      })
      DisplayPics = fotos;



    }else{
      DisplayPics = (<div><img id="foto0" src={env.CSSDIRECTORY + "images/nofoto.png"}></img></div>);


    }

    return (
        <div className="map_container">
          <MuniHeader logoName={logoName} titulo = {this.state.comuna}   />
          <div id="map"></div>
          <Snackbar className={this.state.snackbarStyle} action='Aceptar' active={this.state.activeSnackbar} icon={this.state.snackbarIcon} label={this.state.snackbarMessage} onClick={this.handleSnackbarClick.bind(this)} type='cancel' />
          <Drawer className="drawer_luminarias" active={this.state.active} onOverlayClick={this.handleToggleEditar.bind(this)}>
            <div className="drawer_banner">
              <Logo />
              <h6 className="drawer_banner_title">Editar Luminaria</h6>

            </div>
           <ProgressBar className="drawer_progressBar" type="linear" mode="indeterminate" />
            <div className="drawer_content">

              <Tabs onSelect={this.handleSelect.bind(this)} selectedIndex={this.state.selectedTab}>
                <TabList>
                  <Tab><i className="fa fa-pencil"></i></Tab>
                  <Tab><i className="fa fa-camera button-span" aria-hidden="true"></i></Tab>
                </TabList>
                {/* tab de edicion */}
                <TabPanel>
                  <div className="drawer_griddle_medidores">
                    <div className="drawer_exportarButtonContainer">
                      <h7><b>Edite la información de la luminaria</b></h7>
                    </div>
                    <hr />

                    <div className="drawer_elements">
                      <div className="drawer_elements_group">
                        <div className="drawer_column_titles">
                          <h6>ID Luminaria: </h6>
                        </div>

                        <div className="drawer_column_values">
                          <h6>{this.state.datosLuminariaAEditar.id_luminaria}</h6>
                          <h8 className="drawer_h8_modificaciones">{this.state.datosLuminariaModificada.id_luminaria}</h8>
                        </div>
                      </div>

                      <div className="drawer_elements_group">
                        <div className="drawer_column_titles">
                          <h6>ID Nodo: </h6>
                        </div>

                        <div className="drawer_column_values">
                          <h6>{this.state.datosLuminariaAEditar.id_nodo}</h6>
                          <h8 className="drawer_h8_modificaciones">{this.state.datosLuminariaModificada.id_nodo}</h8>
                        </div>
                      </div>

                      <div className="drawer_elements_group">
                        <div className="drawer_column_titles">
                          <h6>Tipo Conexión:</h6>
                        </div>

                        <div className="drawer_column_values">
                          <Select
                            name="form-field-name"
                            value={this.state.tipoConexion}
                            options={opcionesTipoConexion}
                            onChange={this.logChange.bind(this)}
                          />
                          <h8 className="drawer_h8_modificaciones">{this.state.datosLuminariaModificada.tipo_conexion}</h8>
                        </div>
                      </div>

                      <div className="drawer_elements_group">
                        <div className="drawer_column_titles">
                          <h6>Tipo:</h6>
                        </div>

                        <div className="drawer_column_values">
                          <Select
                            name="form-field-name"
                            value={this.state.tipoLuminaria}
                            options={opcionesTipo}
                            onChange={this.logChange.bind(this)}
                          />
                          <h8 className="drawer_h8_modificaciones">{this.state.datosLuminariaModificada.tipo}</h8>
                        </div>
                      </div>

                      <div className="drawer_elements_group">
                        <div className="drawer_column_titles">
                          <h6>Potencia:</h6>
                        </div>

                        <div className="drawer_column_values">
                          <Select
                            name="form-field-name"
                            value={this.state.tipoPotencia}
                            options={opcionesPotencia}
                            onChange={this.logChange.bind(this)}
                          />
                          <h8 className="drawer_h8_modificaciones">{this.state.datosLuminariaModificada.potencia}</h8>
                        </div>
                      </div>

                      <div className="drawer_elements_group">
                        <div className="drawer_column_titles">
                          <h6>Propiedad:</h6>
                        </div>

                        <div className="drawer_column_values">
                          <Select
                            name="form-field-name"
                            value={this.state.tipoPropiedad}
                            options={opcionesPropiedad}
                            onChange={this.logChange.bind(this)}
                          />
                          <h8 className="drawer_h8_modificaciones">{this.state.datosLuminariaModificada.propiedad}</h8>
                        </div>
                      </div>

                      <div className="drawer_elements_group">
                        <div className="drawer_column_titles">
                          <h6>Rótulo:</h6>
                        </div>

                        <div className="drawer_column_values">
                          <Input className="drawer_input" type='text' value={this.state.rotulo}  name='name' onChange={this.handleChangeRotulo.bind(this)} maxLength={16} />
                          <h8 className="drawer_h8_modificaciones">{this.state.datosLuminariaModificada.rotulo}</h8>
                        </div>
                      </div>

                      <div className="drawer_elements_group">
                        <div className="drawer_column_titles">
                          <h6>Observación:</h6>
                        </div>

                        <div className="drawer_column_values">
                          <Input className="drawer_input" type='text' value={this.state.observaciones}  name='name' onChange={this.handleChangeObservaciones.bind(this)} maxLength={16} />
                          <h8 className="drawer_h8_modificaciones">{this.state.datosLuminariaModificada.observaciones}</h8>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="drawer_editarButtons">
                    <Button icon='update' label='Actualizar' className="editar_button" raised primary onClick={this.onActualizar.bind(this)}  />
                    <Button icon='delete_sweep' label='Eliminar' className="editar_button" raised primary onClick={this.onEliminar.bind(this)}  />
                    <Button icon='create' label='Nuevo' className="editar_button" raised primary onClick={this.onNuevo.bind(this)}  />
                  </div>

                </TabPanel>

                {/* Tabs de fotos */}
                <TabPanel>
                  <div className="sliderContainer">
                    <Slider {...settings} afterChange={this.afterChange.bind(this)}>
                     {DisplayPics}
                   </Slider>
                  </div>
                  <div className="drawer_viewerButton_container">
                    <Button icon='photo_camera' label='Ir a Viewer' className="editar_button" raised primary onClick={this.onVerFotografía.bind(this)}  />
                  </div>

                </TabPanel>

              </Tabs>
            </div>
          </Drawer>
          <Snackbar action='Aceptar' active={this.state.activeSnackbar} icon={this.state.snackbarIcon} label={this.state.snackbarMessage} onClick={this.handleSnackbarClick.bind(this)} type='cancel' />

        </div>


    );
  }
}

export default ChilquintaMap;

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
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import { AppBar, Checkbox, IconButton } from 'react-toolbox';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import {searchRotulo, searchIDNodo, gLayerFind} from '../services/searchbar_service';
import {makeInfowindow} from '../utils/makeInfowindow';
import {getMedidores,
  getLuminariasAsociadas,
  getMedidorLocation,
  getTramosMedidor,
  getLuminariaLocation,
  gLayerMedidor,
  gLayerTramos,
  gLayerLumAsoc,
  gLayerLuminarias, getTodasLasLuminarias} from '../services/queryData';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import VETiledLayer from 'esri/virtualearth/VETiledLayer';
import {exportToExcel} from '../utils/exportToExcel';
import Griddle from 'griddle-react';
import {HeaderComponent, HeaderComponent2, HeaderComponent3} from './HeaderComponents';

var options = [
    { value: 'ROTULO', label: 'Rótulo' },
    { value: 'IDNODO', label: 'ID Nodo' }
];

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

var busquedaa = (
  <div>

  </div>
);

class APMap extends React.Component {
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
      currentPic: 'foto0',

      active: false,
      active2: false,
      active3: false,
      active4: false,
      active5: false,
      checkbox: true,
      checkbox2: true,
      checkbox3: true,
      checkbox4: true,
      tipoBusqueda: '',
      valorBusqueda: '',
      labelBusqueda: 'Valor',
      snackbarMessage: '',
      activeSnackbar: false,
      snackbarIcon: 'error',
      mapSelected: 'topo',
      rowMetaData: '',
      dataMedidores: '',
      dataLuminarias: '',
      dataTodasLuminarias: '',
      numeroMedidor: '',
      labelNumeroMedidor: 'Luminarias de Medidor N°: ',
      selectedRowId: 0,
      selectedRowId2: 0,
      selectedRowId3: 0,
      layersOrder: ''
    }


  }

  componentWillMount(){

      let originalName = MuniImages.filter((logoMuni, index)=>{
        return logoMuni.name == this.props.params.muni;
      });

      this.setState({comuna: originalName, fotografias: [] });

  }

  componentDidMount(){

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

  logChange(val) {
      console.log("Selected: " + val.value);
      this.setState({tipoBusqueda: val.value});

      switch (val.value) {
        case 'ROTULO':
            this.setState({labelBusqueda: 'N° ROTULO'});
          break;
          case 'IDNODO':
              this.setState({labelBusqueda: 'N° ID NODO'});
            break;

        default:
          this.setState({tipoBusqueda: 'ROTULO'});
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

  onCerrarVentana(e){
    //$('.pusherDrawer').css('visibility','visible').css('transition','width 1s').css('width','0%');
    $('#myDrawer').removeClass('pusherDrawer_pushed').addClass('pusherDrawer');
    $('.conttentt').css('width','100%');
    $('.wrapperTop_midTitle h6').css('font-size', '1.6ren');
    $('.muniTitulo').css('font-size','2em');
  }

  handleToggle = () => {
    //disable all the rest of drawers.
      $('#cambiarMapaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft2').css('width','0%');
      $('#cambiarLayersDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft3').css('width','0%');
      $('#mostrarMedidoresDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft4').css('width','0%');
      $('#mostrarLuminariasDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft5').css('width','0%');

    this.setState({active: !this.state.active});
    $('#busquedaDrawer').removeClass('drawerVisibility_notShow').addClass('drawerVisibility_show');
    $('.contenido_mapa').css('width','80%');
    $('.contenido_drawerleft1').css('width','20%');

  };
  handleToggle2 = () => {
    //disable all the rest of drawers.
      $('#busquedaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft1').css('width','0%');
      $('#cambiarLayersDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft3').css('width','0%');
      $('#mostrarMedidoresDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft4').css('width','0%');
      $('#mostrarLuminariasDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft5').css('width','0%');

    this.setState({active2: !this.state.active2});
    $('#cambiarMapaDrawer').removeClass('drawerVisibility_notShow').addClass('drawerVisibility_show');
    $('.contenido_mapa').css('width','80%');
    $('.contenido_drawerleft2').css('width','20%');
  };
  handleToggle3 = () => {
    var mapp = mymap.getMap();
    console.log(mapp.graphicsLayerIds);
    //disable all the rest of drawers.
      $('#busquedaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft1').css('width','0%');
      $('#cambiarMapaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft2').css('width','0%');
      $('#mostrarMedidoresDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft4').css('width','0%');
      $('#mostrarLuminariasDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft5').css('width','0%');

    this.setState({active3: !this.state.active3, layersOrder: mapp.graphicsLayerIds});
    $('#cambiarLayersDrawer').removeClass('drawerVisibility_notShow').addClass('drawerVisibility_show');
    $('.contenido_mapa').css('width','80%');
    $('.contenido_drawerleft3').css('width','20%');
  };
  handleToggle4 = () => {

    //disable all the rest of drawers.

      $('#busquedaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft1').css('width','0%');
      $('#cambiarMapaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft2').css('width','0%');
      $('#cambiarLayersDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft3').css('width','0%');
      $('#mostrarLuminariasDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft5').css('width','0%');

      $('.wrapperTop_midTitle h6').addClass('wrapperTop_midTitle-h6');
      $('.muniTitulo').addClass('muniTitulo-40percent');

    this.setState({active4: !this.state.active4});
    $('#mostrarMedidoresDrawer').removeClass('drawerVisibility_notShow').addClass('drawerVisibility_show');
    $('.contenido_mapa').css('width','60%');
    $('.contenido_drawerleft4').css('width','40%');

    //Obtener todos los medidores de la comuna.
    getMedidores(this.state.comuna[0].queryName,(callback)=>{
      if(!callback[0]){
        console.log("Vacio getMedidores");

        this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: 'error' });
        $('.theme__icon___4OQx3').css('color',"red");

        return;
      }

      let m = callback[1].map((feature)=>{

        let data = {
          "ID EQUIPO": feature.attributes.id_medidor,
          "NIS": feature.attributes.nis,
          "CANT. LUMINARIAS": feature.attributes.luminarias,
          "CANT. TRAMOS": feature.attributes.tramos_ap,
          "TIPO": feature.attributes.descripcion,
          "ROTULO": feature.attributes.rotulo,
          "Geometry": feature.geometry
        }

        return data;
      })
      this.setState({dataMedidores: m});
    });

  };
  handleToggle5 = () => {
    //disable all the rest of drawers.
      $('#busquedaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft1').css('width','0%');
      $('#cambiarMapaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft2').css('width','0%');
      $('#mostrarMedidoresDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft3').css('width','0%');
      $('#cambiarLayersDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft4').css('width','0%');

      $('.wrapperTop_midTitle h6').addClass('wrapperTop_midTitle-h6');
      $('.muniTitulo').addClass('muniTitulo-40percent');

    this.setState({active5: !this.state.active5});
    $('#mostrarLuminariasDrawer').removeClass('drawerVisibility_notShow').addClass('drawerVisibility_show');
    $('.contenido_mapa').css('width','60%');
    $('.contenido_drawerleft5').css('width','40%');

    //Obtener todas las luminarias de la comuna
    getTodasLasLuminarias(this.state.comuna[0].queryName,(callback)=>{

      if(!callback[0]){
        console.log("Vacio getTodasLasLuminarias");

        this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[3] });
        $('.theme__icon___4OQx3').css('color',"red");

        return;
      }

      let l = callback[1].map((feature)=>{

        let data = {
          "ID LUMINARIA": feature.attributes['ID_LUMINARIA'] ,
          "TIPO CONEXION": feature.attributes['TIPO_CONEXION'] ,
          "PROPIEDAD": feature.attributes['PROPIEDAD'] ,
          "MEDIDO": feature.attributes['MEDIDO_TERRENO'] ,
          "DESCRIPCION": feature.attributes['DESCRIPCION'] ,
          "ROTULO": feature.attributes['ROTULO'] ,
          "Geometry": feature.geometry
        }

        return data;
      })
      this.setState({dataTodasLuminarias: l});
    });
  };

  handleLogout(){
    if(env.ENVIRONMENT=='DEVELOPMENT'){
      browserHistory.push(env.ROUTEPATH);
    }else{
      window.location.href = env.WEBSERVERADDRESS;
    }
  }

  handleChange = (name, value) => {
   this.setState({...this.state, [name]: value});
  };

  onClickBusqueda(){
    var mapp = mymap.getMap();
    console.log("Buscando para:",this.state.tipoBusqueda);
    $('.drawer_progressBar').css('visibility','visible');

    if( (_.isEmpty(this.state.tipoBusqueda)) || (_.isEmpty(this.state.valorBusqueda)) ){
      console.log("Vacio");
      this.handleToggle();
      this.setState({snackbarMessage: "Ingrese todos los campos antes de buscar", activeSnackbar: true, snackbarIcon: "warning" });
      $('.theme__icon___4OQx3').css('color',"red");
      $('.drawer_progressBar').css('visibility','hidden');

      return;

    }

    switch (this.state.tipoBusqueda) {

      case 'ROTULO':
        console.log("searching for ROTULO...");
        searchRotulo(this.state.valorBusqueda, (nisFound)=>{

          this.handleToggle();
          this.setState({snackbarMessage: nisFound[2], activeSnackbar: true, snackbarIcon: nisFound[3] });
          $('.theme__icon___4OQx3').css('color',nisFound[4]);
          $('.drawer_progressBar').css('visibility','hidden');
        });
      break;

      case 'IDNODO':
        console.log("searching for IDNODO...");
        searchIDNodo(this.state.valorBusqueda, (incidenciaFound)=>{

          this.handleToggle();
          this.setState({snackbarMessage: incidenciaFound[2], activeSnackbar: true, snackbarIcon: incidenciaFound[3] });
          $('.theme__icon___4OQx3').css('color',incidenciaFound[4]);
          $('.drawer_progressBar').css('visibility','hidden');

        });
      break;

      default:

    }
  }

  onClickLimpiarBusqueda(){
      var mapp = mymap.getMap();
      //mapp.graphics.clear();
        //mapp.removeLayer(gLayer);
      gLayerMedidor.clear();

      gLayerTramos.clear();

      gLayerLumAsoc.clear();

      gLayerLuminarias.clear();

      gLayerFind.clear();

      this.setState({valorBusqueda: '', tipoBusqueda: 'NIS', activeSnackbar:false});

  }

  handleRadioMapas(mapaNow) {

    var mapp = mymap.getMap();
    $('.drawer_progressBar').css('visibility','visible');
    this.setState({mapSelected: mapaNow});
      mapp.on('basemap-change',(basemapChange)=>{
        $('.drawer_progressBar').css('visibility','hidden');
      });

    /*
        if(mapaNow!='chilquinta'){
          mapp.setBasemap(mapaNow);
          $('.drawer_progressBar').css('visibility','hidden');
        }
    */

    var veTileRoad = new VETiledLayer({
      bingMapsKey: "Asrn2IMtRwnOdIRPf-7q30XVUrZuOK7K2tzhCACMg7QZbJ4EPsOcLk6mE9-sNvUe",
      mapStyle: VETiledLayer.MAP_STYLE_ROAD,
      id:"veroad"
    });

    var veTileAerial = new VETiledLayer({
      bingMapsKey: "Asrn2IMtRwnOdIRPf-7q30XVUrZuOK7K2tzhCACMg7QZbJ4EPsOcLk6mE9-sNvUe",
      mapStyle: VETiledLayer.MAP_STYLE_AERIAL,
      id:"veaerial"
    });

    var veTileWithLabels = new VETiledLayer({
      bingMapsKey: "Asrn2IMtRwnOdIRPf-7q30XVUrZuOK7K2tzhCACMg7QZbJ4EPsOcLk6mE9-sNvUe",
      mapStyle: VETiledLayer.MAP_STYLE_AERIAL_WITH_LABELS,
      id:"velabels"
    });

    switch (mapaNow) {
      case 'topo':
        mapp.setBasemap(mapaNow);
        //desabilitar ve tiled layers (bing maps)
        if(mapp.getLayer("veroad")){
          console.log("habilitado veroad");
          mapp.removeLayer(mapp.getLayer("veroad"));
        }

        if(mapp.getLayer("veaerial")){
          console.log("habilitado veaerial");
          mapp.removeLayer(mapp.getLayer("veaerial"));
        }

        if(mapp.getLayer("velabels")){
          console.log("habilitado velabels");
          mapp.removeLayer(mapp.getLayer("velabels"));
        }

        $('.drawer_progressBar').css('visibility','hidden');
      break;

      case 'hybrid':
        mapp.setBasemap(mapaNow);
        //desabilitar ve tiled layers (bing maps)
        if(mapp.getLayer("veroad")){
          console.log("habilitado veroad");
          mapp.removeLayer(mapp.getLayer("veroad"));
        }

        if(mapp.getLayer("veaerial")){
          console.log("habilitado veaerial");
          mapp.removeLayer(mapp.getLayer("veaerial"));
        }

        if(mapp.getLayer("velabels")){
          console.log("habilitado velabels");
          mapp.removeLayer(mapp.getLayer("velabels"));
        }

        $('.drawer_progressBar').css('visibility','hidden');
      break;
      //bing map: satelite
      case 'calles':

        //desabilitar ve tiled layers (bing maps)
        if(mapp.getLayer("veroad")){
          console.log("habilitado veroad");
          mapp.removeLayer(mapp.getLayer("veroad"));
        }

        if(mapp.getLayer("veaerial")){
          console.log("habilitado veaerial");
          mapp.removeLayer(mapp.getLayer("veaerial"));
        }

        if(mapp.getLayer("velabels")){
          console.log("habilitado velabels");
          mapp.removeLayer(mapp.getLayer("velabels"));
        }

        if(this.state.mapSelected=='hybrid'){
            console.log("habilitado hybrid");
            mapp.setBasemap('topo');
        }

        mapp.addLayer(veTileRoad,1);

        $('.drawer_progressBar').css('visibility','hidden');
      break;

      case 'satelite':

        if(mapp.getLayer("veroad")){
          console.log("habilitado veroad");
          mapp.removeLayer(mapp.getLayer("veroad"));
        }

        if(mapp.getLayer("veaerial")){
          console.log("habilitado veaerial");
          mapp.removeLayer(mapp.getLayer("veaerial"));
        }

        if(mapp.getLayer("velabels")){
          console.log("habilitado velabels");
          mapp.removeLayer(mapp.getLayer("velabels"));
        }
        if(this.state.mapSelected=='hybrid'){
            console.log("habilitado hybrid");
            mapp.setBasemap('topo');
        }

        mapp.addLayer(veTileAerial,1);

        $('.drawer_progressBar').css('visibility','hidden');
      break;

      case 'satelitewithlabels':

        if(mapp.getLayer("veroad")){
          console.log("habilitado veroad");
          mapp.removeLayer(mapp.getLayer("veroad"));
        }

        if(mapp.getLayer("veaerial")){
          console.log("habilitado veaerial");
          mapp.removeLayer(mapp.getLayer("veaerial"));
        }

        if(mapp.getLayer("velabels")){
          console.log("habilitado velabels");
          mapp.removeLayer(mapp.getLayer("velabels"));
        }
        if(this.state.mapSelected=='hybrid'){
            console.log("habilitado hybrid");
            mapp.setBasemap('topo');
        }

        mapp.addLayer(veTileWithLabels,1);
        $('.drawer_progressBar').css('visibility','hidden');
      break;
      default:

    }

  };

  onClickCerrarDrawer(e,f){

    switch (e) {
      case 'busqueda':
      $('#busquedaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleft1').css('width','0%');
        $('.contenido_mapa').css('width','100%');
        break;

      case 'mapas':
        $('#cambiarMapaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleft2').css('width','0%');
        $('.contenido_mapa').css('width','100%');
      break;

      case 'layers':
        $('#cambiarLayersDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleft3').css('width','0%');
        $('.contenido_mapa').css('width','100%');
      break;
      case 'medidores':
        $('#mostrarMedidoresDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleft4').css('width','0%');
        $('.contenido_mapa').css('width','100%');

        $('.wrapperTop_midTitle h6').removeClass('wrapperTop_midTitle-h6');
        $('.muniTitulo').removeClass('muniTitulo-40percent');
      break;
      case 'luminarias':
        $('#mostrarLuminariasDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleft5').css('width','0%');
        $('.contenido_mapa').css('width','100%');

        $('.wrapperTop_midTitle h6').removeClass('wrapperTop_midTitle-h6');
        $('.muniTitulo').removeClass('muniTitulo-40percent');
      break;

      default:

    }

  }

  handleCheckboxChange = (e) => {
    var mapp = mymap.getMap();

      switch (e) {
      case 'LUMINARIAS':
        this.setState({checkbox: !this.state.checkbox});
        if(!this.state.checkbox){
          console.log("en true, prender LUMINARIAS",this.state.comuna[0].queryName );

          //var luminariasLayer = new esri.layers.FeatureLayer(myLayers.read_luminarias(),{id:"ap_luminarias", mode: esri.layers.FeatureLayer.MODE_ONDEMAND, minScale: 5000});
          //luminariasLayer.setDefinitionExpression("COMUNA = '"+ this.props.comunaName+"'" );
          var luminariasLayer = mapp.getLayer("ap_luminarias");

          luminariasLayer.show();
          var index = _.findIndex(this.state.layersOrder, function(l) { return l == "ap_luminarias"; });
          //mapp.addLayer(luminariasLayer,index);

        }else{
          console.log("en false, apagar LUMINARIAS");
          var luminariasLayer = mapp.getLayer("ap_luminarias");
          luminariasLayer.hide();
          //mapp.removeLayer(mapp.getLayer("ap_luminarias"));
        }
      break;

      case 'TRAMOSAP':
        this.setState({checkbox2: !this.state.checkbox2});
        if(!this.state.checkbox2){
          console.log("en true, prender TRAMOSAP",this.state.comuna[0].queryName);

          //var tramosAPLayer = new esri.layers.FeatureLayer(myLayers.read_tramosAP(),{id:"ap_tramos", mode: esri.layers.FeatureLayer.MODE_ONDEMAND, minScale: 5000});
          //tramosAPLayer.setDefinitionExpression("comuna  = '"+ this.props.comunaName +"'" );
          var tramosAPLayer = mapp.getLayer("ap_tramos");
          var index = _.findIndex(this.state.layersOrder, function(l) { return l == "ap_tramos"; });
          tramosAPLayer.show();
          //mapp.addLayer(tramosAPLayer,index);

        }else{
          console.log("en false, apagar TRAMOSAP");
          var tramosAPLayer = mapp.getLayer("ap_tramos");
          tramosAPLayer.hide();
          //mapp.removeLayer(mapp.getLayer("ap_tramos"));
        }
      break;

      case 'MODIFICACIONES':
        this.setState({checkbox3: !this.state.checkbox3});
        if(!this.state.checkbox3){
          console.log("en true, prender MODIFICACIONES");

          //var modificadasLayer = new esri.layers.FeatureLayer(myLayers.read_modificacionesAP(),{id:"ap_modificaciones", mode: esri.layers.FeatureLayer.MODE_ONDEMAND, minScale: 5000});
          //modificadasLayer.setDefinitionExpression("Comuna  = '"+ this.props.comunaName +"'" );
          var modificadasLayer = mapp.getLayer("ap_modificaciones");
          var index = _.findIndex(this.state.layersOrder, function(l) { return l == "ap_modificaciones"; });
          modificadasLayer.show();
        /*  alimLayer.setInfoTemplates({
            0: {infoTemplate: myinfotemplate.getAlimentadorInfoWindow()}
          });
          */
          //mapp.addLayer(modificadasLayer,index);

        }else{
          console.log("en false, apagar MODIFICACIONES");
          var modificadasLayer = mapp.getLayer("ap_modificaciones");
          modificadasLayer.hide();
          //mapp.removeLayer(mapp.getLayer("ap_modificaciones"));
        }
      break;

      case 'LIMITECOMUNAL':
        this.setState({checkbox4: !this.state.checkbox4});
        if(!this.state.checkbox4){
          console.log("en true, prender LIMITECOMUNAL");
          //var limiteComunalLayer = new esri.layers.FeatureLayer(myLayers.read_limiteComunal(),{id:"ap_limiteComunal", mode: esri.layers.FeatureLayer.MODE_ONDEMAND});
          //limiteComunalLayer.setDefinitionExpression("nombre   = '"+ this.props.comunaName +"'" );
          var limiteComunalLayer = mapp.getLayer("ap_limiteComunal");
          var index = _.findIndex(this.state.layersOrder, function(l) { return l == "ap_limiteComunal"; });
          limiteComunalLayer.show();
        //  mapp.addLayer(limiteComunalLayer,index);

        }else{
          console.log("en false, apagar alim");
          var limiteComunalLayer = mapp.getLayer("ap_limiteComunal");
          limiteComunalLayer.hide();
          //mapp.removeLayer(mapp.getLayer("ap_limiteComunal"));
        }
      break;
      default:

    }
  };

  onClickExportarMedidores(){
    exportToExcel(this.state.dataMedidores, "MedidoresAP_", true);
  }

  onClickExportarAsociadas(){
    if( _.isEmpty(this.state.dataLuminarias) ){

      this.setState({snackbarMessage: "Seleccione un medidor para extraer los datos de sus luminarias asociadas", activeSnackbar: true, snackbarIcon: "warning" });
      return;
    }
    exportToExcel(this.state.dataLuminarias, "LuminariasAP_Asociadas_Medidor_"+ this.state.numeroMedidor, true);
  }

  onClickExportarLuminarias(){
    if( _.isEmpty(this.state.dataTodasLuminarias) ){

      this.setState({snackbarMessage: "No existen luminarias para extraer información.", activeSnackbar: true, snackbarIcon: "warning" });
      return;
    }
    exportToExcel(this.state.dataTodasLuminarias, "LuminariasAP_Todas", true);
  }

  onRowClick(gridRow, event) {
    //  console.log("onrowclick",event,gridRow);
    this.setState({ selectedRowId: gridRow.props.data['ID EQUIPO'] });
    this.setState({numeroMedidor: gridRow.props.data['ID EQUIPO'], labelNumeroMedidor: "Luminarias de Medidor N°: " +gridRow.props.data['ID EQUIPO'] });
    console.log(gridRow.props.data['Geometry']);
    getLuminariasAsociadas(gridRow.props.data['ID EQUIPO'],(callback)=>{
      if(!callback[0]){
        console.log("Vacio getLuminariasAsociadas");

        this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[3] });
        $('.theme__icon___4OQx3').css('color',"red");

        return;
      }

      let m = callback[1].map((feature)=>{

        let data = {
          "ID LUMINARIA": feature.attributes.ID_LUMINARIA ,
          "TIPO CONEXION": feature.attributes.TIPO_CONEXION ,
          "PROPIEDAD": feature.attributes.PROPIEDAD ,
          "MEDIDO": feature.attributes.MEDIDO_TERRENO ,
          "DESCRIPCION": feature.attributes.DESCRIPCION ,
          "ROTULO": feature.attributes.ROTULO ,
          "Geometry": feature.geometry
        }

        return data;
      })
      this.setState({dataLuminarias: m});
    });

    //Dibujar ubicación medidor
    getMedidorLocation(gridRow.props.data['ID EQUIPO'], (callback)=>{
        if(!callback[0]){
          console.log("Vacio getMedidorLocation");

          this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[3] });
          $('.theme__icon___4OQx3').css('color',"red");

          return;
        }
    });

    //dibujar ubicación tramos asociados al medidor
    getTramosMedidor(gridRow.props.data['ID EQUIPO'], (callback)=>{
      if(!callback[0]){
        console.log("Vacio getTramosMedidor");

        this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[3] });
        $('.theme__icon___4OQx3').css('color',"red");

        return;
      }
    });
  }

  onRowClickLuminariasAsociadas(gridRow, event){
    console.log("onrowclick",event,gridRow, gridRow.props.data['ID LUMINARIA']);
    this.setState({ selectedRowId2: gridRow.props.data['ID LUMINARIA'] });

      //Dibujar ubicación luminaria
      getLuminariaLocation( gridRow.props.data['ID LUMINARIA'], (callback)=>{
          if(!callback[0]){
            console.log("Vacio getLuminariaLocation");

            this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[3] });
            $('.theme__icon___4OQx3').css('color',"red");

            return;
          }
      });

  }

  onRowClickLuminarias(gridRow, event){
    console.log("onrowclick",event,gridRow, gridRow.props.data['ID LUMINARIA']);
    this.setState({ selectedRowId3: gridRow.props.data['ID LUMINARIA'] });

      //Dibujar ubicación luminaria
      getLuminariaLocation( gridRow.props.data['ID LUMINARIA'], (callback)=>{
          if(!callback[0]){
            console.log("Vacio getLuminariaLocation2");

            this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[3] });
            $('.theme__icon___4OQx3').css('color',"red");

            return;
          }
      });

  }


  render(){
    let logoName = this.props.params.muni;
    let src = env.CSSDIRECTORY  + "images/logos/logos_menu/"+ this.props.params.muni + ".png";
    let DisplayPics;

    var settings = {
      dots: true
    };
    let nofoto= env.CSSDIRECTORY + "images/nofoto.png";

    if(this.state.fotografias.length){
      let fotos  = this.state.fotografias.map((foto,index)=>{
        return <div><img id={"foto"+index} src={foto} /></div>
      })
      DisplayPics = fotos;

    }else{
      DisplayPics = (<div><img id="foto0" src={env.CSSDIRECTORY + "images/nofoto.png"}></img></div>);
    }


    var columnMetaMedidores = [
            {
            "columnName": "ID EQUIPO",
            "customHeaderComponent": HeaderComponent,
            "customHeaderComponentProps": { color: '#da291c' }
            },
            {
            "columnName": "NIS",
            "customHeaderComponent": HeaderComponent,
            "customHeaderComponentProps": { color: '#da291c' }
            },
            {
            "columnName": "CANT. LUMINARIAS",
            "customHeaderComponent": HeaderComponent,
            "customHeaderComponentProps": { color: '#da291c' }
            },
            {
            "columnName": "CANT. TRAMOS",
            "customHeaderComponent": HeaderComponent,
            "customHeaderComponentProps": { color: '#da291c' }
            },
            {
            "columnName": "TIPO",
            "customHeaderComponent": HeaderComponent,
            "customHeaderComponentProps": { color: '#da291c' }
            },
            {
            "columnName": "ROTULO",
            "customHeaderComponent": HeaderComponent,
            "customHeaderComponentProps": { color: '#da291c' }
            }
        ];
    var columnMetaLuminariasAsociadas = [
      {
        "columnName": "ID LUMINARIA",
        "customHeaderComponent": HeaderComponent2,
        "customHeaderComponentProps": { color: '#da291c' }
      },
      {
        "columnName": "TIPO CONEXION",
        "customHeaderComponent": HeaderComponent2,
        "customHeaderComponentProps": { color: '#da291c' }
      },
      {
        "columnName": "PROPIEDAD",
        "customHeaderComponent": HeaderComponent2,
        "customHeaderComponentProps": { color: '#da291c' }
      },
      {
        "columnName": "MEDIDO",
        "customHeaderComponent": HeaderComponent2,
        "customHeaderComponentProps": { color: '#da291c' }
      },
      {
        "columnName": "DESCRIPCION",
        "customHeaderComponent": HeaderComponent2,
        "customHeaderComponentProps": { color: '#da291c' }
      },
      {
        "columnName": "ROTULO",
        "customHeaderComponent": HeaderComponent2,
        "customHeaderComponentProps": { color: '#da291c' }
      }
    ];

    var columnMetaLuminarias = [
      {
        "columnName": "ID LUMINARIA",
        "customHeaderComponent": HeaderComponent3,
        "customHeaderComponentProps": { color: '#da291c' }
      },
      {
        "columnName": "TIPO CONEXION",
        "customHeaderComponent": HeaderComponent3,
        "customHeaderComponentProps": { color: '#da291c' }
      },
      {
        "columnName": "PROPIEDAD",
        "customHeaderComponent": HeaderComponent3,
        "customHeaderComponentProps": { color: '#da291c' }
      },
      {
        "columnName": "MEDIDO",
        "customHeaderComponent": HeaderComponent3,
        "customHeaderComponentProps": { color: '#da291c' }
      },
      {
        "columnName": "DESCRIPCION",
        "customHeaderComponent": HeaderComponent3,
        "customHeaderComponentProps": { color: '#da291c' }
      },
      {
        "columnName": "ROTULO",
        "customHeaderComponent": HeaderComponent3,
        "customHeaderComponentProps": { color: '#da291c' }
      }
    ];

    const rowMetadata = {
      bodyCssClassName: rowData => (rowData['ID EQUIPO'] === this.state.selectedRowId ? 'selected' : ''),
    };

    const rowMetadata2 = {
      bodyCssClassName: rowData => (rowData['ID LUMINARIA'] === this.state.selectedRowId2 ? 'selected' : ''),
    };

    const rowMetadata3 = {
      bodyCssClassName: rowData => (rowData['ID LUMINARIA'] === this.state.selectedRowId3 ? 'selected' : ''),
    };

    return (
      <div className="contenido">
        {/* DRAWER BUSQUEDA */}
        <div className="contenido_drawerleft1">

          <div id="busquedaDrawer" className="drawerVisibility_notShow">
            <div className="drawer_banner">
              <Logo />
              <h6 className="drawer_banner_title">Búsqueda</h6>
             <IconButton className="btnCerrarDrawer" icon='close' accent onClick={this.onClickCerrarDrawer.bind(this,"busqueda")} />
            </div>
            <ProgressBar className="drawer_progressBar" type="linear" mode="indeterminate" />
            <div className="drawer_content">
              <List selectable ripple>
                <ListSubHeader className="drawer_listSubHeader drawer_busquedaTitle" caption='Seleccione un tipo de búsqueda:' />
              </List>
              <Select
                  name="form-field-name"
                  value={this.state.tipoBusqueda}
                  options={options}
                  onChange={this.logChange.bind(this)}
              />
              <Input className="drawer_input" type='text' label={this.state.labelBusqueda} name='name' value={this.state.valorBusqueda} onChange={this.handleChange.bind(this, 'valorBusqueda')} maxLength={16} />
              <div className="drawer_buttonsContent">
                <Button className="drawer_button" icon='search' label='Buscar' raised primary onClick={this.onClickBusqueda.bind(this)} />
                <Button icon='delete_sweep' label='Limpiar Búsqueda' raised primary onClick={this.onClickLimpiarBusqueda.bind(this)} />
              </div>
            </div>

          </div>
        </div>

        {/* DRAWER MAPAS */}
        <div className="contenido_drawerleft2">
          <div id="cambiarMapaDrawer">
            <div className="drawer_banner">
              <Logo />
              <h6  className="drawer_banner_title">Seleccionar Mapa</h6>
              <IconButton className="btnCerrarDrawer" icon='close' accent onClick={this.onClickCerrarDrawer.bind(this,"mapas")} />
            </div>
            <ListSubHeader className="drawer_listSubHeader" caption='Seleccione un mapa para visualizar:' />
            <RadioGroup className="drawer_radiogroup" name='mapSelector' value={this.state.mapSelected} onChange={this.handleRadioMapas.bind(this)}>
              <RadioButton label='Topográfico' value='topo'/>
              <RadioButton label='Híbrido' value='hybrid'/>
              <RadioButton label='Aéreo' value='satelite'/>
              <RadioButton label='Aéreo con Etiquetas' value='satelitewithlabels'/>
              <RadioButton label='Caminos' value='calles'/>
            </RadioGroup>
            <ProgressBar type="circular" mode="indeterminate" className="drawer_progressBar" />

          </div>
        </div>

        {/* DRAWER LAYERS */}
        <div className="contenido_drawerleft3">
          <div id="cambiarLayersDrawer">
            <div className="drawer_banner">
              <Logo />
              <h6  className="drawer_banner_title">Seleccionar Layers</h6>
              <IconButton className="btnCerrarDrawer" icon='close' accent onClick={this.onClickCerrarDrawer.bind(this,"layers")} />
            </div>
            <List selectable ripple>
              <ListSubHeader className="drawer_listSubHeader" caption='Seleccione uno o más layers para visualizar:' />
              <ListCheckbox
                caption='Luminarias'
                checked={this.state.checkbox}
                legend=''
                onChange={this.handleCheckboxChange.bind(this,"LUMINARIAS")}
              />
              <ListCheckbox
                caption='Tramos AP'
                checked={this.state.checkbox2}
                legend=''
                onChange={this.handleCheckboxChange.bind(this,"TRAMOSAP")}
              />
              <ListCheckbox
                caption='Modificaciones'
                checked={this.state.checkbox3}
                legend=''
                onChange={this.handleCheckboxChange.bind(this,"MODIFICACIONES")}
              />
              <ListCheckbox
                caption='Límite Comunal'
                checked={this.state.checkbox4}
                legend=''
                onChange={this.handleCheckboxChange.bind(this,"LIMITECOMUNAL")}
              />
              <ListDivider />
            </List>
          </div>
        </div>

        {/* DRAWER MEDIDORES */}
        <div className="contenido_drawerleft4">
          <div id="mostrarMedidoresDrawer">
            <div className="drawer_banner">
              <Logo />
              <h6 className="drawer_banner_title">Medidores y Luminarias Asociadas</h6>
              <IconButton className="btnCerrarDrawer" icon='close' accent onClick={this.onClickCerrarDrawer.bind(this,"medidores")} />
            </div>
            <div className="drawer_content">

              <div className="drawer_griddle_medidores">
                <div className="drawer_exportarButtonContainer">
                  <h7><b>Seleccione un medidor para ver sus luminarias asociadas y ubicación</b></h7>
                  <Button icon='file_download' label='Exportar' accent onClick={this.onClickExportarMedidores.bind(this)} />
                </div>
                <Griddle rowMetadata={rowMetadata} columnMetadata={columnMetaMedidores} ref="griddleTable" className="drawer_griddle_medidores" results={this.state.dataMedidores} columns={["ID EQUIPO","NIS","CANT. LUMINARIAS","CANT. TRAMOS","TIPO","ROTULO"]} onRowClick = {this.onRowClick.bind(this)} uniqueIdentifier="ID EQUIPO" />
              </div>
              <div className="drawer_griddle_medidores">
                <div className="drawer_exportarButtonContainer">

                <h7><b>{this.state.labelNumeroMedidor}</b></h7>
                  <Button icon='file_download' label='Exportar' accent onClick={this.onClickExportarAsociadas.bind(this)} />
                </div>
                <Griddle rowMetadata={rowMetadata2} columnMetadata={columnMetaLuminariasAsociadas}  ref="griddleTable" className="drawer_griddle_medidores" results={this.state.dataLuminarias} columns={["ID LUMINARIA","TIPO CONEXION","PROPIEDAD","DESCRIPCION","ROTULO"]} onRowClick = {this.onRowClickLuminariasAsociadas.bind(this)} uniqueIdentifier="ID LUMINARIA" />
              </div>
            </div>
            <div className="drawer_medidoresButtons">
              <Button icon='delete_sweep' label='Limpiar ubicación' raised primary onClick={this.onClickLimpiarBusqueda.bind(this)} />
            </div>
          </div>
        </div>

        {/* DRAWER LUMINARIAS */}
        <div className="contenido_drawerleft5">
          <div id="mostrarLuminariasDrawer">
            <div className="drawer_banner">
              <Logo />
              <h6 className="drawer_banner_title">Lista de Luminarias de la comuna</h6>
              <IconButton className="btnCerrarDrawer" icon='close' accent onClick={this.onClickCerrarDrawer.bind(this,"luminarias")} />
            </div>
            <div className="drawer_content">

              <div className="drawer_griddle_medidores">
                <div className="drawer_exportarButtonContainer">
                  <h7><b>Seleccione una luminaria para ver su ubicación</b></h7>
                  <Button icon='file_download' label='Exportar' accent onClick={this.onClickExportarLuminarias.bind(this)} />
                </div>
                <Griddle  ref="griddleTable3" className="drawer_griddle_medidores" rowMetadata={rowMetadata3}
                columnMetadata={columnMetaLuminarias}
                results={this.state.dataTodasLuminarias}
                columns={["ID LUMINARIA","TIPO CONEXION","PROPIEDAD","MEDIDO","DESCRIPCION", "ROTULO"]}
                onRowClick = {this.onRowClickLuminarias.bind(this)} uniqueIdentifier="ID LUMINARIA"  />
              </div>
            </div>
            <div className="drawer_medidoresButtons">
              <Button icon='delete_sweep' label='Limpiar ubicación' raised primary onClick={this.onClickLimpiarBusqueda.bind(this)} />
            </div>
          </div>
        </div>


        <div className="contenido_mapa">
          {/* BARRA DE TITULO */}
          <Panel>
              <AppBar>
                <div className="wrapperTop">
                  <Logo />
                  <div className="wrapperTop_midTitle">
                    <h6>Ilustre Municipalidad de </h6>
                    <h5 className="muniTitulo">{this.state.comuna[0].originalName}</h5>
                  </div>
                  <div className="welcome_logout_wrapper">
                    <img src={src} ></img>
                    <div className="drawer_buttons">
                      <IconButton icon='search' inverse={ true } onClick={this.handleToggle} />
                      <IconButton icon='map' inverse={ true } onClick={this.handleToggle2} />
                      <IconButton icon='layers' inverse={ true } onClick={this.handleToggle3} />
                      <IconButton icon='settings_input_svideo' inverse={ true } onClick={this.handleToggle4} />
                      <IconButton icon='lightbulb_outline' inverse={ true } onClick={this.handleToggle5.bind(this)} />
                      <IconButton icon='settings_power' inverse={ true } onClick={this.handleLogout.bind(this)} />
                    </div>
                  </div>
                </div>
              </AppBar>
          </Panel>

          {/* MAPA */}
          <div className="map_container">
            <div id="map"></div>
          </div>
          <Snackbar action='Aceptar' active={this.state.activeSnackbar} icon={this.state.snackbarIcon} label={this.state.snackbarMessage} onClick={this.handleSnackbarClick.bind(this)} type='cancel' />

        </div>

      </div>

    );
  }
}

export default APMap;

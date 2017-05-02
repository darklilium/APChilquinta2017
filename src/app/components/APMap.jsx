import React from 'react';
import mymap from '../services/map-service';
import ArcGISDynamicMapServiceLayer from 'esri/layers/ArcGISDynamicMapServiceLayer';
import layers from '../services/layers-service';
import myinfotemplate from '../utils/infoTemplates';
import {browserHistory} from 'react-router';
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
import {searchRotulo, searchIDNodo, gLayerFind, searchNumeroMedidor, searchNumeroCliente} from '../services/searchbar_service';
import {makeInfowindow} from '../utils/makeInfowindow';
import {getMedidores,
  getLuminariasAsociadas,
  getMedidorLocation,
  getTramosMedidor,
  getLuminariaLocation,
  gLayerMedidor,
  gLayerTramos,
  gLayerLumAsoc,
  gLayerLuminarias, gLayerLuminariaSearch, getTodasLasLuminarias} from '../services/queryData';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import VETiledLayer from 'esri/virtualearth/VETiledLayer';
import {exportToExcel} from '../utils/exportToExcel';
import Griddle from 'griddle-react';
import {HeaderComponent, HeaderComponent2, HeaderComponent3} from './HeaderComponents';
import Graphic from 'esri/graphic';
import makeSymbol from '../utils/makeSymbol';
import cookieHandler from 'cookie-handler';
import {AP_Error} from './AP_PageError.jsx';
import {getFormatedDate} from '../services/login-service';

// 02/03/2017: agregando IdentifyTask
import LayerList from "esri/dijit/LayerList";
import update from 'react-addons-update'; // ES6
import IdentifyTask from "esri/tasks/IdentifyTask";
import IdentifyParameters from "esri/tasks/IdentifyParameters";
import arrayUtils from "dojo/_base/array";
import InfoTemplate from "esri/InfoTemplate";

//03/04/2017: limpiar busqueda anterior de tramos , luminarias asociadas, etc.
import {clearGraphicsLayers} from '../services/queryData';

//27.04.2017: agregando popup a mapa para seleccionar grafico.
import SimpleFillSymbol from "esri/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "esri/symbols/SimpleLineSymbol";
import domConstruct from "dojo/dom-construct";
import Popup from "esri/dijit/Popup";
import Color from "esri/Color";

var options = [
    { value: 'ROTULO', label: 'Rótulo Poste' },
    { value: 'IDNODO', label: 'ID Nodo' },
    { value: 'NMEDIDOR', label: 'N° Medidor'},
    { value: 'NCLIENTE', label: 'N° Cliente'}
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


class APMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //02/03/2017: Agregando layerlist con servicio dinámico.
      dynamicService :{},
      layerList : [
        { name: 'LUMINARIAS',
          number: 1,
          visibility: true
        },
        {
          name: 'TRAMOSAP',
          number: 2,
          visibility: true
        },
        {
          name: 'MODIFICACIONES',
          number: 0,
          visibility: true
        },
        {
          name: 'LIMITECOMUNAL',
          number: 4,
          visibility: true
        }
      ],

      counter: 0,
      counterTotal: 0,
      allElements: [],
      currentIndex: 0,
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

      snackbarIcon: 'error',
      mapSelected: 'topo',
      rowMetaData: '',
      dataMedidores: '',
      dataLuminarias: '',
      dataTodasLuminarias: '',
      numeroMedidor: '',
      labelNumeroMedidor: 'Luminarias de ID Equipo N°: ',
      labelIDMedidor: 'Luminarias de ID Equipo N°: ',
      selectedRowId: 0,
      selectedRowId2: 0,
      selectedRowId3: 0,
      layersOrder: '',
      IDMedidorAsociado: 0,
      numeroMedidorAsociado: 0,
      editarLum_nisAsociado: 0,
      dataLuminariasRelacionadas: '',
      nisMedidorAsociado: '',
      btnsEditDisabled: true
    }
    this.onShowCurrent = this.onShowCurrent.bind(this);
    this.onLimpiarFormEdicion = this.onLimpiarFormEdicion.bind(this);

  }

  componentWillMount(){

      let originalName = MuniImages.filter((logoMuni, index)=>{
        return logoMuni.name == cookieHandler.get('mn');
      });

      this.setState({comuna: originalName, fotografias: [] });

  }

  componentDidMount(){
    var popup = new Popup({
         fillSymbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
           new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
             new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]))
       }, domConstruct.create("div"));

    var mapp = mymap.createMap("map","topo",this.state.comuna[0].extent[0], this.state.comuna[0].extent[1],12, popup);

    //02/032017: agregando IdentifyTask

    var layerDefinitions = [];
    layerDefinitions[0] = "COMUNA = '"+ this.state.comuna[0].queryName+"'";
    layerDefinitions[1] = "COMUNA = '"+ this.state.comuna[0].queryName+"'";
    layerDefinitions[2] = "COMUNA = '"+ this.state.comuna[0].queryName+"'";
    layerDefinitions[4] = "nombre = '"+ this.state.comuna[0].queryName+"'";

    var modificacionesLayer = new ArcGISDynamicMapServiceLayer(layers.read_dynamic_ap(),{});
    modificacionesLayer.setImageFormat("png32");
    modificacionesLayer.setVisibleLayers([0]);
    modificacionesLayer.setLayerDefinitions(layerDefinitions);

    var luminariasLayer = new ArcGISDynamicMapServiceLayer(layers.read_dynamic_ap(),{ minScale: 6000});
    luminariasLayer.setImageFormat("png32");
    luminariasLayer.setVisibleLayers([1]);
    luminariasLayer.setLayerDefinitions(layerDefinitions);

    var tramosLayer = new ArcGISDynamicMapServiceLayer(layers.read_dynamic_ap(),{minScale: 6000});
    tramosLayer.setImageFormat("png32");
    tramosLayer.setVisibleLayers([2]);
    tramosLayer.setLayerDefinitions(layerDefinitions);

    var limiteComunalLayer = new esri.layers.FeatureLayer(layers.read_limiteComunal(),{id:"ap_limiteComunal", mode: esri.layers.FeatureLayer.MODE_ONDEMAND});
    limiteComunalLayer.setDefinitionExpression("nombre   = '"+ this.state.comuna[0].queryName+"'" );

    mapp.addLayers([limiteComunalLayer, tramosLayer,luminariasLayer, modificacionesLayer]);
    this.setState({dynamicService: [limiteComunalLayer, tramosLayer, luminariasLayer, modificacionesLayer]});

    mapp.on('click', (event)=>{
      $('.drawer_progressBar2').css('visibility',"visible");
      var identifyTask, identifyParams;

      identifyTask = new IdentifyTask(layers.read_dynamic_ap());
      identifyParams = new IdentifyParameters();
      identifyParams.tolerance = 10;
      identifyParams.returnGeometry = true;
      identifyParams.layerIds = [0, 1];
      identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
      identifyParams.width = mapp.width;
      identifyParams.height = mapp.height;
      identifyParams.geometry = event.mapPoint;
      identifyParams.mapExtent = mapp.extent;
      var onlyLum = [];

      //Usar promises para obtener resultados de parametros de identificación sobre los layers 0 y 1
      var deferred = identifyTask.execute(identifyParams, (callback)=>{
        if(!callback.length){
          console.log("no hay length", callback);
          $('.drawer_progressBar2').css('visibility',"hidden");
          this.setState({snackbarMessage: "Luminarias en este punto no han sido encontradas. Haga clic en una luminaria para ver su información nuevamente.", activeSnackbar: true, snackbarIcon: 'close' });
          return;
        }else{
          let arrResults = callback.map(result => {
            let r = {
              features: result.feature,
              layerName: result.layerName
            }
            return r;
          });

          this.setState({allElements: arrResults});
          console.log(arrResults,"arrResults");
          //dibujar punto seleccionado.
          let mySymbol = makeSymbol.makePointLocated();
          //Limpiar busqueda anterior.
          gLayerLuminariaSearch.clear();
          clearGraphicsLayers(true,true,true,true,true);
          //Dibujar resultado de geometria encontrada
          var g = new Graphic( arrResults[0].features.geometry,mySymbol);
          gLayerLuminariaSearch.add(g);
          mapp.addLayer(gLayerLuminariaSearch,1);

          mapp.centerAndZoom(arrResults[0].features.geometry,20);

          //Mostrar ventana de edición de luminaria seleccionada
          this.onShowCurrent(arrResults,0);

          onlyLum = arrResults.filter(element =>{ return element.layerName=='Luminarias' });
          //obtener el primer registro (o único).
          //this.setState({counterTotal: onlyLum.length, counter: 1, allElements: onlyLum, currentIndex: 0});
          this.setState({counterTotal: onlyLum.length, counter: 1, currentIndex: 0});
          $('.drawer_progressBar2').css('visibility',"hidden");
          $('.wrapperTop_midTitle h6').addClass('wrapperTop_midTitle-h6');
          $('.muniTitulo').addClass('muniTitulo-40percent');
        }

      },(errback)=>{
        console.log("ee",errback);
      });

      //agregar infowindow ----------------------------------------------------
      deferred.addCallback(function (response){
        //extraer información de sólo las luminarias para generar infowindow.
        let res = response.filter((r)=>{return r.layerName=="Luminarias"});
        return arrayUtils.map(res, function (result) {

          var feature = result.feature;
          var layerName = result.layerName;
          var onlyLuminarias = [];
            feature.attributes.layerName = layerName;
            if(layerName === 'Luminarias'){
              var luminariasTemplate = new InfoTemplate("ID Luminaria: ${ID_LUMINARIA}",
                "Rótulo: ${ROTULO} <br />" +
                "Tipo Conexión: ${TIPO_CONEXION}<br /> " +
                "Potencia: ${POTENCIA} <br/> " +
                "Tipo: ${TIPO} <br/>" +
                "Propiedad: ${PROPIEDAD} <br/>" +
                "Medido: ${MEDIDO_TERRENO}");
                feature.setInfoTemplate(luminariasTemplate);
                onlyLuminarias.push(feature);
            }
          return feature;
        });
      });

      mapp.infoWindow.setFeatures([deferred]);
      mapp.infoWindow.show(event.mapPoint);

    });

  }

  onShowCurrent(elements, showElementNumber){
      var mapp = mymap.getMap();

    //console.log("current", elements, showElementNumber);
    let onlyLum = elements.filter(element =>{ return element.layerName=='Luminarias' });
      console.log(onlyLum, "solo lum");
    let onlyMods = elements.filter(element =>{ return element.layerName=='Modificaciones' });
      console.log(onlyMods, "solo mods");

    let idequipoap = 0;
    //si hay resultados para luminarias
    if(onlyLum.length){
      this.setState({btnsEditDisabled: false});
      //si tiene equipo ap

      if(onlyLum[showElementNumber].features.attributes['ID_EQUIPO_AP']==0){
        idequipoap = 'NO TIENE';
      }else{
        idequipoap = onlyLum[showElementNumber].features.attributes['ID_EQUIPO_AP'];
      }
      console.log(idequipoap,"idequipoap");
      let editarLuminaria = {
        id_luminaria: onlyLum[showElementNumber].features.attributes['ID_LUMINARIA'],
        id_nodo: onlyLum[showElementNumber].features.attributes['ID_NODO'],
        tipo_conexion: onlyLum[showElementNumber].features.attributes['TIPO_CONEXION'],
        tipo: onlyLum[showElementNumber].features.attributes['TIPO'],
        potencia:  parseInt(onlyLum[showElementNumber].features.attributes['POTENCIA']),
        propiedad:onlyLum[showElementNumber].features.attributes['PROPIEDAD'],
        rotulo :onlyLum[showElementNumber].features.attributes['ROTULO'],
        observaciones: onlyLum[showElementNumber].features.attributes['OBSERVACION'],
        geometria: onlyLum[showElementNumber].features.geometry
      }
      console.log(editarLuminaria, "editar");

      this.setState({
        tipoLuminaria:  onlyLum[showElementNumber].features.attributes['TIPO'],
        tipoConexion: onlyLum[showElementNumber].features.attributes['TIPO_CONEXION'],
        tipoPropiedad: onlyLum[showElementNumber].features.attributes['PROPIEDAD'],
        tipoPotencia: parseInt(onlyLum[showElementNumber].features.attributes['POTENCIA']),
        rotulo: onlyLum[showElementNumber].features.attributes['ROTULO'],
        selectedTab: 0,
        IDMedidorAsociado: idequipoap
      });


      this.setState({datosLuminariaAEditar: editarLuminaria, datosLuminariaModificada: {}});

      //disable all the rest of drawers.
        $('#busquedaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleft1').css('width','0%');
        $('#cambiarMapaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleft2').css('width','0%');
        $('#mostrarMedidoresDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleft3').css('width','0%');
        $('#cambiarLayersDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleft4').css('width','0%');
        $('#mostrarLuminariasDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleft5').css('width','0%');
        $('.contenido_mapa').css('width','100%');

        $('.wrapperTop_midTitle h6').addClass('wrapperTop_midTitle-h6');
        $('.muniTitulo').addClass('muniTitulo-40percent');

        $('#mostrarEdicionDrawer').removeClass('drawerVisibility_notShow').addClass('drawerVisibility_show');
        $('.contenido_mapa').css('width','60%');
        $('.contenido_drawerleftEspecial').css('width','40%');


        if(!onlyMods.length){
              console.log("no hay modificaciones");
              /*this.setState({datosLuminariaModificada: []});
              this.setState({snackbarMessage: "Modificaciones realizadas para luminaria no encontradas.", activeSnackbar: true, snackbarIcon: 'close' });
              $('.theme__icon___4OQx3').css('color',"red");
              */
              //Deshabilitar barra de progreso.
              $('.drawer_progressBar').css('visibility','hidden');
              return;

          }

          let onlyModss = onlyMods.filter(modificaciones =>{return modificaciones.features.attributes['id_luminaria']==onlyLum[showElementNumber].features.attributes['ID_LUMINARIA']});
          console.log("solo esta lum mod", onlyModss);
          if(onlyModss.length){
            let modificacionesLuminaria = {
              id_luminaria: onlyModss[0].features.attributes['id_luminaria'],
              id_nodo: onlyModss[0].features.attributes['id_nodo'],
              tipo_conexion:  onlyModss[0].features.attributes['tipo_cnx'],
              tipo:  onlyModss[0].features.attributes['tipo'],
              potencia:   onlyModss[0].features.attributes['potencia'],
              propiedad:onlyModss[0].features.attributes['propiedad'],
              rotulo : onlyModss[0].features.attributes['rotulo'],
              observaciones: onlyModss[0].features.attributes['obs'],
              geometria: onlyModss[0].features.attributes.geometry
            }
              this.setState({datosLuminariaModificada: modificacionesLuminaria});

        }else{
            console.log("nada");
        }
    }else{
      //no hay length, no hay luminarias
      console.log("no hay luminarias a mostrar");
      this.onLimpiarFormEdicion();
      this.setState({btnsEditDisabled: true});
    }

      //ver cuando es lum id = 0 id nodo = y más de un registro a modificar.id nodo: 11549584

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

    if(!val){
        this.setState({tipoBusqueda: 'ROTULO', labelBusqueda: 'N° ROTULO'});
    }else{
    this.setState({tipoBusqueda: val.value});
      switch (val.value) {
        case 'ROTULO':
            this.setState({labelBusqueda: 'N° ROTULO'});
        break;
        case 'IDNODO':
          this.setState({labelBusqueda: 'N° ID NODO'});
        break;
        case 'NMEDIDOR':
          this.setState({labelBusqueda: 'N° MEDIDOR'});
        break;
        case 'NCLIENTE':
          this.setState({labelBusqueda: 'N° CLIENTE'});
        break;

        default:
          this.setState({tipoBusqueda: 'ROTULO', labelBusqueda: 'N° ROTULO'});
      }
    }
  }

  logChangeCombos(valor) {
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
  //Tabs que muestran información según tabindex. Tab1: editar, tab2: fotos, tab3: tramoEquipo asociado.
  handleSelect(index, last){

      this.setState({selectedTab: index});
      //console.log("en tab", index);

      switch (index) {
        case 1:
          $('.drawer_progressBar').css('visibility',"visible");
          getFotografías(this.state.datosLuminariaAEditar.id_nodo, (callback)=>{
              if(!callback[0]){
                console.log("no hay fotos", callback);
                this.setState({snackbarMessage: "Fotos para esta luminaria no han sido encontradas.", activeSnackbar: true, snackbarIcon: 'close' });
                $('.theme__icon___4OQx3').css('color',"red");

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
        //obtener info de luminarias asociadas a un medidor:
        case 2:
        //clearGraphicsLayers(false,true,true,false,false);

        $('.drawer_progressBar').css('visibility',"visible");
        console.log("ee");
        if ( (this.state.IDMedidorAsociado=='NO TIENE') || (this.state.IDMedidorAsociado==0) ){
          console.log("Vacio IDMedidorAsociado");
          this.setState({dataLuminariasRelacionadas: []});
          this.setState({snackbarMessage: "Luminarias asociadas en este circuito no han sido encontradas.", activeSnackbar: true, snackbarIcon: 'close' });
          $('.theme__icon___4OQx3').css('color',"red");
          //Deshabilitar barra de progreso.
          $('.drawer_progressBar').css('visibility','hidden');
          this.setState({editarLum_nisAsociado: 0, numeroMedidorAsociado: 0});
          return;
        }

        getLuminariasAsociadas(this.state.IDMedidorAsociado,(callback)=>{
          if(!callback[0]){
            console.log("Vacio getLuminariasAsociadas");

            this.setState({snackbarMessage: "Luminarias asociadas en este circuito no han sido encontradas.", activeSnackbar: true, snackbarIcon: 'close' });


            $('.theme__icon___4OQx3').css('color',"red");
            //Deshabilitar barra de progreso.
            $('.drawer_progressBar').css('visibility','hidden');
            return;
          }

          let m = callback[1].map((feature)=>{

            let data = {
              "ID LUMINARIA": feature.attributes.ID_LUMINARIA ,
              "TIPO CONEXION": feature.attributes.TIPO_CONEXION ,
              "PROPIEDAD": feature.attributes.PROPIEDAD ,
              "MEDIDO": feature.attributes.MEDIDO_TERRENO ,
              "TIPO": feature.attributes.TIPO,
              "POTENCIA": feature.attributes.POTENCIA,
              "ROTULO": feature.attributes.ROTULO ,
              "Geometry": feature.geometry
            }

            return data;
          })
          this.setState({dataLuminariasRelacionadas: m});
        });

        getTramosMedidor(this.state.IDMedidorAsociado, (cb)=>{
          if(!cb[0]){
            console.log("Vacio getTramosMedidor 2");

            this.setState({snackbarMessage: "Tramos asociados no encontrados.", activeSnackbar: true, snackbarIcon: 'close' });
            $('.theme__icon___4OQx3').css('color',"red");
            //Deshabilitar barra de progreso.
            $('.drawer_progressBar').css('visibility','hidden');
            return;
          }

          //Deshabilitar barra de progreso.
          $('.drawer_progressBar').css('visibility','hidden');
        });

        //Dibujar medidor.
        getMedidorLocation(this.state.IDMedidorAsociado,(cb)=>{
          if(!cb[1].length){
            this.setState({editarLum_nisAsociado: 0, numeroMedidorAsociado: 0});
              console.log("medidor dibujado",cb);
            return;
          }
          console.log("medidor dibujado",cb,"cb1",cb[1]);
          this.setState({editarLum_nisAsociado: cb[1][0].attributes.nis, numeroMedidorAsociado: cb[1][0].attributes.numero_medidor});

        })


        break;
        default:

      }
  }

  onNuevo(){
    if( this.state.rotulo=="" ){
      console.log("rotulo no definido, no se puede ingresar.");
      this.setState({snackbarMessage: "Rótulo no ha sido definido, intente nuevamente", activeSnackbar: true, snackbarIcon: 'clear'});
      $('.theme__icon___4OQx3').css('color',"red");
      //Deshabilitar barra de progreso.
      $('.drawer_progressBar').css('visibility','hidden');
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
      if(callback){
        this.setState({snackbarMessage: "Registro nuevo agregado exitosamente", activeSnackbar: true, snackbarIcon: 'done'});
        $('.theme__icon___4OQx3').css('color',"greenyellow");
        //Deshabilitar barra de progreso.
        $('.drawer_progressBar').css('visibility','hidden');
      }else{
        this.setState({snackbarMessage: "No se ha podido ingresar nuevo registro, intente nuevamente", activeSnackbar: true, snackbarIcon: 'clear'});
        $('.theme__icon___4OQx3').css('color',"red");
        //Deshabilitar barra de progreso.
        $('.drawer_progressBar').css('visibility','hidden');
      }
    });
  }

  onEliminar(){
    if( this.state.rotulo=="" ){
      console.log("rotulo no definido, no se puede ingresar.");
      this.setState({snackbarMessage: "Rótulo no ha sido definido, intente nuevamente", activeSnackbar: true, snackbarIcon: 'clear'});
      $('.theme__icon___4OQx3').css('color',"red");
      //Deshabilitar barra de progreso.
      $('.drawer_progressBar').css('visibility','hidden');
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
      if(callback){
        this.setState({snackbarMessage: "Registro eliminado exitosamente", activeSnackbar: true, snackbarIcon: 'done'});
        $('.theme__icon___4OQx3').css('color',"greenyellow");
        //Deshabilitar barra de progreso.
        $('.drawer_progressBar').css('visibility','hidden');
      }else{
        this.setState({snackbarMessage: "No se ha podido eliminar registro, intente nuevamente", activeSnackbar: true, snackbarIcon: 'clear'});
        $('.theme__icon___4OQx3').css('color',"red");
        //Deshabilitar barra de progreso.
        $('.drawer_progressBar').css('visibility','hidden');
      }
    });
  }

  onActualizar(){
    if( this.state.rotulo=="" ){
      console.log("rotulo no definido, no se puede ingresar.");
      this.setState({snackbarMessage: "Rótulo no ha sido definido, intente nuevamente", activeSnackbar: true, snackbarIcon: 'clear'});
      $('.theme__icon___4OQx3').css('color',"red");
      //Deshabilitar barra de progreso.
      $('.drawer_progressBar').css('visibility','hidden');
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
      console.log("tengo callback nuevo", callback);
      if(callback){
        this.setState({snackbarMessage: "Registro modificado exitosamente", activeSnackbar: true, snackbarIcon: 'done'});
        $('.theme__icon___4OQx3').css('color',"greenyellow");
        //Deshabilitar barra de progreso.
        $('.drawer_progressBar').css('visibility','hidden');
      }else{
        this.setState({snackbarMessage: "No se ha podido modificar registro, intente nuevamente", activeSnackbar: true, snackbarIcon: 'clear'});
        $('.theme__icon___4OQx3').css('color',"red");
        //Deshabilitar barra de progreso.
        $('.drawer_progressBar').css('visibility','hidden');
      }

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
  //abre drawer busqueda.
  handleToggle = () => {
    $('.wrapperTop_midTitle h6').removeClass('wrapperTop_midTitle-h6');
    $('.muniTitulo').removeClass('muniTitulo-40percent');
    //disable all the rest of drawers.
      $('#cambiarMapaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft2').css('width','0%');
      $('#cambiarLayersDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft3').css('width','0%');
      $('#mostrarMedidoresDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft4').css('width','0%');
      $('#mostrarLuminariasDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft5').css('width','0%');
      $('#mostrarEdicionDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleftEspecial').css('width','0%');
      $('.contenido_mapa').css('width','100%');


    this.setState({active: !this.state.active});
    $('#busquedaDrawer').removeClass('drawerVisibility_notShow').addClass('drawerVisibility_show');
    $('.contenido_mapa').css('width','80%');
    $('.contenido_drawerleft1').css('width','20%');

  };
  //abre drawer cambiar mapa
  handleToggle2 = () => {
    $('.wrapperTop_midTitle h6').removeClass('wrapperTop_midTitle-h6');
    $('.muniTitulo').removeClass('muniTitulo-40percent');
    //disable all the rest of drawers.
      $('#busquedaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft1').css('width','0%');
      $('#cambiarLayersDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft3').css('width','0%');
      $('#mostrarMedidoresDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft4').css('width','0%');
      $('#mostrarLuminariasDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft5').css('width','0%');
      $('#mostrarEdicionDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleftEspecial').css('width','0%');
      $('.contenido_mapa').css('width','100%');


    this.setState({active2: !this.state.active2});
    $('#cambiarMapaDrawer').removeClass('drawerVisibility_notShow').addClass('drawerVisibility_show');
    $('.contenido_mapa').css('width','80%');
    $('.contenido_drawerleft2').css('width','20%');
  };
  //abre layerList
  handleToggle3 = () => {
    $('.wrapperTop_midTitle h6').removeClass('wrapperTop_midTitle-h6');
    $('.muniTitulo').removeClass('muniTitulo-40percent');
    var mapp = mymap.getMap();

    //disable all the rest of drawers.
      $('#busquedaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft1').css('width','0%');
      $('#cambiarMapaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft2').css('width','0%');
      $('#mostrarMedidoresDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft4').css('width','0%');
      $('#mostrarLuminariasDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft5').css('width','0%');
      $('#mostrarEdicionDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleftEspecial').css('width','0%');
      $('.contenido_mapa').css('width','100%');


    this.setState({active3: !this.state.active3, layersOrder: mapp.graphicsLayerIds});
    $('#cambiarLayersDrawer').removeClass('drawerVisibility_notShow').addClass('drawerVisibility_show');
    $('.contenido_mapa').css('width','80%');
    $('.contenido_drawerleft3').css('width','20%');
  };
  //obtener todos los medidores de la comuna.
  handleToggle4 = () => {
    //Habilitar barra de progreso en carga.
    $('.drawer_progressBar').css('visibility','visible');
    $('.wrapperTop_midTitle h6').removeClass('wrapperTop_midTitle-h6');
    $('.muniTitulo').removeClass('muniTitulo-40percent');
    //disable all the rest of drawers.

      $('#busquedaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft1').css('width','0%');
      $('#cambiarMapaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft2').css('width','0%');
      $('#cambiarLayersDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft3').css('width','0%');
      $('#mostrarLuminariasDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft5').css('width','0%');
      $('#mostrarEdicionDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleftEspecial').css('width','0%');
      $('.contenido_mapa').css('width','100%');


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
        $('.drawer_progressBar').css('visibility','hidden');

        return;
      }

      let m = callback[1].map((feature)=>{

        let data = {
          "ID EQUIPO": feature.attributes.id_medidor,
          "N° MEDIDOR": feature.attributes.numero_medidor,
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
      //Deshabilitar barra de progreso.
      $('.drawer_progressBar').css('visibility','hidden');
    });

  };
  //Obtener todas las luminarias de la comuna
  handleToggle5 = () => {
    //Habilitar barra de progreso en carga.
    $('.drawer_progressBar').css('visibility','visible');
    $('.wrapperTop_midTitle h6').removeClass('wrapperTop_midTitle-h6');
    $('.muniTitulo').removeClass('muniTitulo-40percent');
    //disable all the rest of drawers.
      $('#busquedaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft1').css('width','0%');
      $('#cambiarMapaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft2').css('width','0%');
      $('#mostrarMedidoresDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft3').css('width','0%');
      $('#cambiarLayersDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleft4').css('width','0%');
      $('#mostrarEdicionDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
      $('.contenido_drawerleftEspecial').css('width','0%');
      $('.contenido_mapa').css('width','100%');


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
          "TIPO": feature.attributes['TIPO'] ,
          "POTENCIA": feature.attributes['POTENCIA'] ,
          "ROTULO": feature.attributes['ROTULO'] ,
          "Geometry": feature.geometry
        }

        return data;
      })
      this.setState({dataTodasLuminarias: l});
      //Deshabilitar barra de progreso.
      $('.drawer_progressBar').css('visibility','hidden');
    });
  };
  //cierra sesión de usuario
  handleLogout(){
    cookieHandler.remove('usrnm');
    cookieHandler.remove('mn');
    cookieHandler.remove('tkn');

    if(env.ENVIRONMENT=='DEVELOPMENT'){
      window.location.href = env.WEBSERVERADDRESS;
      //browserHistory.push(env.ROUTEPATH);
    }else{
      window.location.href = env.WEBSERVERADDRESS;
    }
  }

  handleChange = (name, value) => {
   this.setState({...this.state, [name]: value});
  };
  //realiza la búsqueda según elemento.
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
    //Definición de tipos de búsqueda según los seleccionado:
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

      case 'NMEDIDOR':
        console.log("searching for NMEDIDOR...");
        searchNumeroMedidor(this.state.valorBusqueda, (incidenciaFound)=>{

          this.handleToggle();
          this.setState({snackbarMessage: incidenciaFound[2], activeSnackbar: true, snackbarIcon: incidenciaFound[3] });
          $('.theme__icon___4OQx3').css('color',incidenciaFound[4]);
          $('.drawer_progressBar').css('visibility','hidden');

        });

      break;

      case 'NCLIENTE':
        console.log("searching for NCLIENTE...");
        searchNumeroCliente(this.state.valorBusqueda, (incidenciaFound)=>{

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
          clearGraphicsLayers(true,true,true,true,true);
          gLayerFind.clear();
        break;

      case 'mapas':
        $('#cambiarMapaDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleft2').css('width','0%');
        $('.contenido_mapa').css('width','100%');
          clearGraphicsLayers(true,true,true,true,true);
      break;

      case 'layers':
        $('#cambiarLayersDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleft3').css('width','0%');
        $('.contenido_mapa').css('width','100%');
          clearGraphicsLayers(true,true,true,true,true);
      break;

      case 'medidores':
        $('#mostrarMedidoresDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleft4').css('width','0%');
        $('.contenido_mapa').css('width','100%');

        $('.wrapperTop_midTitle h6').removeClass('wrapperTop_midTitle-h6');
        $('.muniTitulo').removeClass('muniTitulo-40percent');
          clearGraphicsLayers(true,true,true,true,true);
      break;
      case 'luminarias':
        $('#mostrarLuminariasDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleft5').css('width','0%');
        $('.contenido_mapa').css('width','100%');

        $('.wrapperTop_midTitle h6').removeClass('wrapperTop_midTitle-h6');
        $('.muniTitulo').removeClass('muniTitulo-40percent');
          clearGraphicsLayers(true,true,true,true,true);
      break;
      case 'edicion':
        $('#mostrarEdicionDrawer').removeClass('drawerVisibility_show').addClass('drawerVisibility_notShow');
        $('.contenido_drawerleftEspecial').css('width','0%');
        $('.contenido_mapa').css('width','100%');

        $('.wrapperTop_midTitle h6').removeClass('wrapperTop_midTitle-h6');
        $('.muniTitulo').removeClass('muniTitulo-40percent');
          clearGraphicsLayers(true,true,true,true,true);


      break;
      default:


    }

  }

  handleCheckboxChange = (e) => {
    var mapp = mymap.getMap();

    var LuminariasLayer = this.state.dynamicService;
    //this.setState({dynamicService: [limiteComunalLayer, tramosLayer, luminariasLayer, modificacionesLayer]})

    switch (e) {
      case "LUMINARIAS":
      this.setState({checkbox: !this.state.checkbox});
      if(!this.state.checkbox){
          this.state.dynamicService[2].show();

      }else{

        this.state.dynamicService[2].hide();
      }
      break;

      case "TRAMOSAP":
      this.setState({checkbox2: !this.state.checkbox2});
      if(!this.state.checkbox2){
        this.state.dynamicService[1].show();

      }else{
        this.state.dynamicService[1].hide();
      }
      break;

      case 'MODIFICACIONES':
      this.setState({checkbox3: !this.state.checkbox3});
      if(!this.state.checkbox3){
        this.state.dynamicService[3].show();

      }else{
        this.state.dynamicService[3].hide();
      }
      break;

      case 'LIMITECOMUNAL':
      this.setState({checkbox4: !this.state.checkbox4});
      if(!this.state.checkbox4){
        this.state.dynamicService[0].show();

      }else{
      this.state.dynamicService[0].hide();
      }
      break;
      default:
    }
  };

  onClickExportarMedidores(){
    let ex = this.state.dataMedidores.map(data=>{
      return _.omit(data,['Geometry']);
    });
    exportToExcel(ex, "MedidoresAP_", true);
  }

  //Exportar a excel luminarias asociadas a un equipo. 1.- Editar luminaria. 2.- Seleccionar equipo desde grid.
  onClickExportarAsociadas(e){

    console.log(e);
    switch (e) {
      case 'luminariaEditar':
      if( _.isEmpty(this.state.dataLuminariasRelacionadas) ){

        this.setState({snackbarMessage: "Seleccione una luminaria a editar para extraer los datos de sus luminarias asociadas", activeSnackbar: true, snackbarIcon: "warning" });
        return;
      }

      if(this.state.numeroMedidorAsociado==" " || this.state.numeroMedidorAsociado==""){
        let e = this.state.dataLuminariasRelacionadas.map(data=>{
          return _.omit(data,['Geometry']);
        });
        exportToExcel(e, "LuminariasAP_Asociadas_ID_Equipo_"+ this.state.IDMedidorAsociado + " N°Cliente_" + this.state.editarLum_nisAsociado + " N°Medidor_0" , true);
        return;
      }
      //omitir campo geometry
      let x = this.state.dataLuminariasRelacionadas.map(data=>{
        return _.omit(data,['Geometry']);
      });
      exportToExcel(x, "LuminariasAP_Asociadas_ID_Equipo_"+ this.state.IDMedidorAsociado + "N°Cliente_" + this.state.editarLum_nisAsociado + " N°Medidor_" + this.state.numeroMedidorAsociado , true);
      break;

      case 'dataLuminarias':
        if( _.isEmpty(this.state.dataLuminarias) ){

          this.setState({snackbarMessage: "Seleccione un medidor para extraer los datos de sus luminarias asociadas", activeSnackbar: true, snackbarIcon: "warning" });
          return;
        }
        //omitir campo geometry
        let p = this.state.dataLuminarias.map(data=>{
          return _.omit(data,['Geometry']);
        });
        exportToExcel(p, "LuminariasAP_Asociadas_ID_Equipo_"+ this.state.numeroMedidor + "__"+this.state.labelNumeroMedidor+ "__N°Cliente_"+ this.state.nisMedidorAsociado, true);
      default:

    }

  }
  //Exportar todas las luminarias de la comuna
  onClickExportarLuminarias(){
    if( _.isEmpty(this.state.dataTodasLuminarias) ){
      this.setState({snackbarMessage: "No existen luminarias para extraer información.", activeSnackbar: true, snackbarIcon: "warning" });
      return;
    }
    //omitir campo geometry
    let o = this.state.dataTodasLuminarias.map(data=>{
      return _.omit(data,['Geometry']);
    });
    exportToExcel(o, "LuminariasAP_Todas", true);
  }

  onRowClick(gridRow, event) {

    //Habilitar barra de progreso en carga.
    $('.drawer_progressBar').css('visibility','visible');

    //  console.log("onrowclick",event,gridRow);
    this.setState({
      selectedRowId: gridRow.props.data['ID EQUIPO'],
      numeroMedidor: gridRow.props.data['ID EQUIPO'],
      labelIDMedidor: "Luminarias de ID Equipo: " +gridRow.props.data['ID EQUIPO'],
      labelNumeroMedidor: " N° Medidor: " + gridRow.props.data['N° MEDIDOR'],
      nisMedidorAsociado: gridRow.props.data['NIS']
    });

    getLuminariasAsociadas(gridRow.props.data['ID EQUIPO'],(callback)=>{
      if(!callback[0]){
        console.log("Vacio getLuminariasAsociadas");

        this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[3] });
        $('.theme__icon___4OQx3').css('color',"red");
        //Deshabilitar barra de progreso.
        $('.drawer_progressBar').css('visibility','hidden');
        return;
      }

      let m = callback[1].map((feature)=>{

        let data = {
          "ID LUMINARIA": feature.attributes.ID_LUMINARIA ,
          "TIPO CONEXION": feature.attributes.TIPO_CONEXION ,
          "PROPIEDAD": feature.attributes.PROPIEDAD ,
          "MEDIDO": feature.attributes.MEDIDO_TERRENO ,
          "TIPO": feature.attributes.TIPO,
          "POTENCIA": feature.attributes.POTENCIA,
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
          //Deshabilitar barra de progreso.
          $('.drawer_progressBar').css('visibility','hidden');
          return;
        }
    });

    //dibujar ubicación tramos asociados al medidor
    getTramosMedidor(gridRow.props.data['ID EQUIPO'], (callback)=>{
      if(!callback[0]){
        console.log("Vacio getTramosMedidor");

        this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[3] });
        $('.theme__icon___4OQx3').css('color',"red");
        //Deshabilitar barra de progreso.
        $('.drawer_progressBar').css('visibility','hidden');
        return;
      }
      //Deshabilitar barra de progreso.
      $('.drawer_progressBar').css('visibility','hidden');
    });

  }

  onRowClickLuminariasAsociadas(gridRow, event){
    //Habilitar barra de progreso en carga.
    $('.drawer_progressBar').css('visibility','visible');

    this.setState({ selectedRowId2: gridRow.props.data['ID LUMINARIA'] });

      //Dibujar ubicación luminaria
      getLuminariaLocation( gridRow.props.data['ID LUMINARIA'], (callback)=>{
          if(!callback[0]){
            console.log("Vacio getLuminariaLocation");

            this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[3] });
            $('.theme__icon___4OQx3').css('color',"red");
            //Deshabilitar barra de progreso.
            $('.drawer_progressBar').css('visibility','hidden');
            return;
          }
          //Deshabilitar barra de progreso.
          $('.drawer_progressBar').css('visibility','hidden');
      });

  }

  onRowClickLuminarias(gridRow, event){
    //Habilitar barra de progreso en carga.
    $('.drawer_progressBar').css('visibility','visible');
    this.setState({ selectedRowId3: gridRow.props.data['ID LUMINARIA'] });

      //Dibujar ubicación luminaria
      getLuminariaLocation( gridRow.props.data['ID LUMINARIA'], (callback)=>{
          if(!callback[0]){
            console.log("Vacio getLuminariaLocation2");

            this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[3] });
            $('.theme__icon___4OQx3').css('color',"red");
            //Deshabilitar barra de progreso.
            $('.drawer_progressBar').css('visibility','hidden');
            return;
          }
          //Deshabilitar barra de progreso.
          $('.drawer_progressBar').css('visibility','hidden');
      });

  }

  onClickSiguienteLuminaria(){

    if(!this.state.allElements.length){
      console.log("no hay elementos para mostrar");
      return;
    }

    console.log("index", this.state.currentIndex);
    //si el counter supera al total.
    if(this.state.counter + 1 > this.state.counterTotal){
      console.log("no mostrar más");


    }else{
      this.setState({counter: this.state.counter+1});
      let index = this.state.currentIndex;
      this.onShowCurrent(this.state.allElements,index+1);
      this.setState({currentIndex: index+1});
    }
  }

  onClickAnteriorLuminaria(){

    if(!this.state.allElements.length){
      console.log("no hay elementos para mostrar");

      return;
    }

    console.log("index", this.state.currentIndex);

    //si el counter supera al total.
    if(this.state.counter - 1 <= 0){
      console.log("no mostrar más");


    }else{
      this.setState({counter: this.state.counter-1});
      let index = this.state.currentIndex;
      this.onShowCurrent(this.state.allElements,index-1);
      this.setState({currentIndex: index-1});
    }
  }

  onLimpiarFormEdicion(){
    this.setState({
      tipoLuminaria:  '',
      tipoConexion:'',
      tipoPropiedad: '',
      tipoPotencia: '',
      rotulo: '',

    });
    this.setState({datosLuminariaAEditar: {}, datosLuminariaModificada: {}});
  }

  handleSnackbarTimeout = (event, instance) => {
    
      this.setState({ activeSnackbar : false });
  };

  render(){
    let logoName = cookieHandler.get('mn');
    let namee = cookieHandler.get('usrnm');

    let src = env.CSSDIRECTORY  + "images/logos/logos_menu/"+ cookieHandler.get('mn') + ".png";
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
            "columnName": "N° MEDIDOR",
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
        "columnName": "TIPO",
        "customHeaderComponent": HeaderComponent2,
        "customHeaderComponentProps": { color: '#da291c' }
      },
      {
        "columnName": "POTENCIA",
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
        "columnName": "TIPO",
        "customHeaderComponent": HeaderComponent3,
        "customHeaderComponentProps": { color: '#da291c' }
      },
      {
        "columnName": "POTENCIA",
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

    let rendering = null;
    if(logoName){
      var d = cookieHandler.get('wllExp');
        if(d > getFormatedDate()){
          console.log("dentro del rango");
          if(!cookieHandler.get('tkn') || !cookieHandler.get('sttngs')){
            console.log("no hay, redirect...");
            window.location.href = "index.html";
          }else{
            rendering = <div className="contenido">

                    {/* DRAWER BUSQUEDA */}
                    <div className="contenido_drawerleft1">

                      <div id="busquedaDrawer" className="drawerVisibility_notShow">
                        <div className="drawer_banner banner_fix">
                          {/*<Logo />*/}
                          <div className="drawer_banner_divTitle">
                            <h6 className="drawer_banner_title">Búsqueda</h6>
                          </div>
                          <div>
                            <IconButton className="btnCerrarDrawer" icon='close' accent onClick={this.onClickCerrarDrawer.bind(this,"busqueda")} />
                         </div>
                        </div>
                        <ProgressBar className="drawer_progressBar" type="linear" mode="indeterminate" />
                        <div className="drawer_title_divh7"><h7><b>Seleccione elemento técnico/comercial:</b></h7></div>

                        <div className="drawer_content drawer_busquedas">
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
                        <div className="drawer_banner banner_fix1">
                          {/*<Logo />*/}
                          <div className="drawer_banner_divTitle">
                            <h6  className="drawer_banner_title">Seleccionar Mapa</h6>
                          </div>
                          <div>
                            <IconButton className="btnCerrarDrawer" icon='close' accent onClick={this.onClickCerrarDrawer.bind(this,"mapas")} />
                          </div>
                        </div>
                      {/* <ListSubHeader className="drawer_listSubHeader" caption='Seleccione un mapa para visualizar:' />*/}
                        <div className="drawer_title_divh7"><h7><b>Seleccione un mapa para visualizar:</b></h7></div>
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
                        <div className="drawer_banner banner_fix1">
                          {/*<Logo />*/}
                          <div className="drawer_banner_divTitle">
                            <h6  className="drawer_banner_title">Seleccionar Layers</h6>
                          </div>
                          <div>
                            <IconButton className="btnCerrarDrawer" icon='close' accent onClick={this.onClickCerrarDrawer.bind(this,"layers")} />
                          </div>
                        </div>
                        <div className="drawer_title_divh7"><h7><b>Seleccione uno o más layers para visualizar:</b></h7></div>
                        <List selectable ripple>
                          {/*<ListSubHeader className="drawer_listSubHeader" caption='Seleccione uno o más layers para visualizar:' />*/}
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
                          {/*<Logo />*/}
                          <div className="drawer_banner_divTitle">
                            <h6 className="drawer_banner_title">Medidores y Luminarias Asociadas</h6>
                          </div>
                          <div>
                            <IconButton className="btnCerrarDrawer" icon='close' accent onClick={this.onClickCerrarDrawer.bind(this,"medidores")} />
                          </div>
                        </div>
                        <ProgressBar className="drawer_progressBar" type="linear" mode="indeterminate" />
                        <div className="drawer_content">
                          <div className="drawer_griddle_medidores">
                            <div className="drawer_exportarButtonContainer">
                              <h7><b>Seleccione un medidor para ver sus luminarias asociadas y ubicación</b></h7>
                              <Button icon='file_download' label='Exportar' accent onClick={this.onClickExportarMedidores.bind(this)} />
                            </div>
                            <Griddle  resultsPerPage={5} rowMetadata={rowMetadata} columnMetadata={columnMetaMedidores} ref="griddleTable" className="drawer_griddle_medidores" results={this.state.dataMedidores} columns={["ID EQUIPO","N° MEDIDOR", "NIS","CANT. LUMINARIAS","CANT. TRAMOS","TIPO","ROTULO"]} onRowClick = {this.onRowClick.bind(this)} uniqueIdentifier="ID EQUIPO" />
                          </div>
                          <div className="drawer_griddle_medidores">
                            <div className="drawer_exportarButtonContainer">

                            <div className="drawer_titles_equipoMedidor">
                              <h7><b>{this.state.labelIDMedidor}</b></h7>
                              <h8><b>{this.state.labelNumeroMedidor}</b></h8>
                            </div>
                              <Button icon='file_download' label='Exportar' accent onClick={this.onClickExportarAsociadas.bind(this, "dataLuminarias")} />
                            </div>
                            <Griddle resultsPerPage={5} rowMetadata={rowMetadata2} columnMetadata={columnMetaLuminariasAsociadas}  ref="griddleTable" className="drawer_griddle_medidores" results={this.state.dataLuminarias} columns={["ID LUMINARIA","TIPO CONEXION","PROPIEDAD","TIPO","POTENCIA","ROTULO"]} onRowClick = {this.onRowClickLuminariasAsociadas.bind(this)} uniqueIdentifier="ID LUMINARIA" />
                          </div>
                          <div className="drawer_medidoresButtons">
                            <Button icon='delete_sweep' label='Limpiar ubicación' raised primary onClick={this.onClickLimpiarBusqueda.bind(this)} />
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* DRAWER LUMINARIAS */}
                    <div className="contenido_drawerleft5">
                      <div id="mostrarLuminariasDrawer">
                        <div className="drawer_banner">
                          {/*<Logo />*/}
                          <div className="drawer_banner_divTitle">
                            <h6 className="drawer_banner_title">Lista de Luminarias de la comuna</h6>
                          </div>
                          <div>
                            <IconButton className="btnCerrarDrawer" icon='close' accent onClick={this.onClickCerrarDrawer.bind(this,"luminarias")} />
                          </div>
                        </div>
                        <ProgressBar className="drawer_progressBar" type="linear" mode="indeterminate" />
                        <div className="drawer_content">
                          <div className="drawer_griddle_medidores">
                            <div className="drawer_exportarButtonContainer">
                              <h7><b>Seleccione una luminaria para ver su ubicación</b></h7>
                              <Button icon='file_download' label='Exportar' accent onClick={this.onClickExportarLuminarias.bind(this)} />
                            </div>
                            <Griddle resultsPerPage={12} ref="griddleTable3" className="drawer_griddle_medidores" rowMetadata={rowMetadata3}
                            columnMetadata={columnMetaLuminarias}
                            results={this.state.dataTodasLuminarias}
                            columns={["ID LUMINARIA","TIPO CONEXION","PROPIEDAD","MEDIDO","TIPO", "POTENCIA", "ROTULO"]}
                            onRowClick = {this.onRowClickLuminarias.bind(this)} uniqueIdentifier="ID LUMINARIA"  />
                          </div>
                        </div>
                        <div className="drawer_medidoresButtons">
                          <Button icon='delete_sweep' label='Limpiar ubicación' raised primary onClick={this.onClickLimpiarBusqueda.bind(this)} />
                        </div>
                      </div>
                    </div>

                    {/* DRAWER EDICION */}
                    <div className="contenido_drawerleftEspecial">
                      <div id="mostrarEdicionDrawer">
                        <div className="drawer_banner banner_fix_edit">
                        {/*<Logo />*/}
                        <div className="drawer_banner_divTitle">
                          <h6 className="drawer_banner_title">Editar Luminaria</h6>
                        </div>
                        <div>
                          <IconButton className="btnCerrarDrawer" icon='close' accent onClick={this.onClickCerrarDrawer.bind(this,"edicion")} />
                        </div>
                      </div>
                      <ProgressBar className="drawer_progressBar" type="linear" mode="indeterminate" />
                      <div className="drawer_content">

                        <Tabs onSelect={this.handleSelect.bind(this)} selectedIndex={this.state.selectedTab}>
                          <TabList>
                            <Tab><i className="fa fa-pencil"></i></Tab>
                            <Tab><i className="fa fa-camera button-span" aria-hidden="true"></i></Tab>
                            <Tab><i className="fa fa-bolt button-span" aria-hidden="true"></i></Tab>
                          </TabList>
                          {/* tab de edicion */}
                          <TabPanel>
                            <div className="drawer_griddle_medidores">
                              <div className="drawer_exportarButtonContainer">
                                 <IconButton onClick={this.onClickAnteriorLuminaria.bind(this)} primary icon="keyboard_arrow_left"></IconButton>
                                 <h7>{this.state.counter} de {this.state.counterTotal}</h7>
                                 <IconButton  onClick={this.onClickSiguienteLuminaria.bind(this)} primary icon="keyboard_arrow_right"></IconButton>
                              </div>
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
                                      onChange={this.logChangeCombos.bind(this)}
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
                                      onChange={this.logChangeCombos.bind(this)}
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
                                      onChange={this.logChangeCombos.bind(this)}
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
                                      onChange={this.logChangeCombos.bind(this)}
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
                              <Button icon='update' label='Actualizar' disabled={this.state.btnsEditDisabled} className="editar_button" raised primary onClick={this.onActualizar.bind(this)}  />
                              <Button icon='delete_sweep' label='Eliminar'  disabled={this.state.btnsEditDisabled} className="editar_button" raised primary onClick={this.onEliminar.bind(this)}  />
                              <Button icon='create' label='Nuevo'  disabled={this.state.btnsEditDisabled} className="editar_button" raised primary onClick={this.onNuevo.bind(this)}  />
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
                              <Button icon='photo_camera' label='Ver en pantalla completa' className="editar_button editar_verFotoBtn" raised primary onClick={this.onVerFotografía.bind(this)}  />
                            </div>

                          </TabPanel>
                          {/* Tabs de circuito asociado */}
                          <TabPanel>

                            <div className="drawer_griddle_medidores">
                              <div className="drawer_exportarButtonContainer">
                                <div className="drawer_titles_equipoMedidor">
                                  <h7 className="nocenter"><b>Luminarias Asociadas al ID Equipo : {this.state.IDMedidorAsociado}</b></h7>
                                  <h8 className="nocenter"><b>N° Medidor : {this.state.numeroMedidorAsociado}</b></h8>
                                  <h8 className="nocenter"><b>N° Cliente : {this.state.editarLum_nisAsociado}</b></h8>
                                </div>
                                  <Button icon='file_download' label='Exportar' accent onClick={this.onClickExportarAsociadas.bind(this, "luminariaEditar")} />
                                </div>
                              <Griddle rowMetadata={rowMetadata2} columnMetadata={columnMetaLuminariasAsociadas}  ref="griddleTable" className="drawer_griddle_medidores" results={this.state.dataLuminariasRelacionadas} columns={["ID LUMINARIA","TIPO CONEXION","PROPIEDAD","TIPO","POTENCIA","ROTULO"]} onRowClick = {this.onRowClickLuminariasAsociadas.bind(this)} uniqueIdentifier="ID LUMINARIA" />
                            </div>
                          </TabPanel>
                          </Tabs>
                        </div>
                      </div>
                    </div>
                    {/* MAPA */}
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

                      <ProgressBar className="drawer_progressBar2" type="linear" mode="indeterminate" />
                      {/* MAPA */}
                      <div className="map_container">
                        <div id="map"></div>
                      </div>
                      <Snackbar action='Aceptar'
                        active={this.state.activeSnackbar}
                        icon={this.state.snackbarIcon}
                        label={this.state.snackbarMessage}
                        onClick={this.handleSnackbarClick.bind(this)}
                        onTimeout={this.handleSnackbarTimeout.bind(this)}
                        timeout={3000}
                        type='cancel' />

                    </div>
                </div>;
          }
        }else{
          console.log("Token expired");
          window.location.href = "index.html";
        }



    }else{
      rendering = <AP_Error />;
    }

    return (
      <div style={{height: '100%'}}>{rendering}</div>

    );
  }
}

export default APMap;

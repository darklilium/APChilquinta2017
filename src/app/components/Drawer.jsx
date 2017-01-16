import React from 'react';
// import 'react-toolbox/lib/commons.scss';           // Import common styles

import { Button } from 'react-toolbox/lib/button'; // Bundled component import
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import { AppBar, Checkbox, IconButton } from 'react-toolbox';
import Statistics from './Statistics.jsx';
import {Router, Route, browserHistory} from "react-router";
import {TabsExample} from './Tabs.jsx';
import {Link} from "react-router";
import {Logo} from "./Logo.jsx";
import {OnlineStatistics} from "./OnlineStatistics.jsx";
import Drawer from 'react-toolbox/lib/drawer';
import Select from 'react-select';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import Input from 'react-toolbox/lib/input';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import {searchRotulo, searchIDNodo, gLayerFind} from '../services/searchbar_service';
import {makeInfowindow} from '../utils/makeInfowindow';
import mymap from '../services/map-service';
import makeSymbol from '../utils/makeSymbol';
import SimpleMarkerSymbol from 'esri/symbol';
import {Snackbar} from 'react-toolbox';
import $ from 'jquery';
import ArcGISDynamicMapServiceLayer from 'esri/layers/ArcGISDynamicMapServiceLayer';
import myLayers from '../services/layers-service';
import {getMapLayers} from '../services/layers-service';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Popup from 'esri/dijit/Popup';
import {foo} from "./OnlineStatistics.jsx";
import VETiledLayer from 'esri/virtualearth/VETiledLayer';
import _ from 'lodash';
import Griddle from 'griddle-react';
import {getMedidores,
  getLuminariasAsociadas,
  getMedidorLocation,
  getTramosMedidor,
  getLuminariaLocation,
  gLayerMedidor,
  gLayerTramos,
  gLayerLumAsoc,
  gLayerLuminarias, getTodasLasLuminarias} from '../services/queryData';
import FontIcon from 'react-toolbox/lib/font_icon';
import {exportToExcel} from '../utils/exportToExcel';
import env from '../services/config';

var options = [
    { value: 'ROTULO', label: 'Rótulo' },
    { value: 'IDNODO', label: 'ID Nodo' }
];

var HeaderComponent = React.createClass({
  textOnClick: function(e) {
    e.stopPropagation();
  },

  filterText: function(e) {
    this.props.filterByColumn(e.target.value, this.props.columnName)
  },

  render: function(){
    return (
      <span>
        <div><strong style={{color: this.props.color}}>{this.props.displayName}</strong></div>
        <input type='text' onChange={this.filterText} onClick={this.textOnClick} />
      </span>
    );
  }
});

var HeaderComponent2 = React.createClass({
  textOnClick: function(e) {
    e.stopPropagation();
  },

  filterText: function(e) {
    this.props.filterByColumn(e.target.value, this.props.columnName)
  },

  render: function(){
    return (
      <span>
        <div><strong style={{color: this.props.color}}>{this.props.displayName}</strong></div>
        <input type='text' onChange={this.filterText} onClick={this.textOnClick} />
      </span>
    );
  }
});

var HeaderComponent3 = React.createClass({
  textOnClick: function(e) {
    e.stopPropagation();
  },

  filterText: function(e) {
    this.props.filterByColumn(e.target.value, this.props.columnName)
  },

  render: function(){
    return (
      <span>
        <div><strong style={{color: this.props.color}}>{this.props.displayName}</strong></div>
        <input type='text' onChange={this.filterText} onClick={this.textOnClick} />
      </span>
    );
  }
});

class DrawerTest extends React.Component {
  constructor(props){
    super(props);

    this.state = {
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
    };
  }
  handleToggle = () => {
    this.setState({active: !this.state.active});
  };
  handleToggle2 = () => {
    this.setState({active2: !this.state.active2});
  };
  handleToggle3 = () => {
    var mapp = mymap.getMap();
    console.log(mapp.graphicsLayerIds);

    this.setState({active3: !this.state.active3, layersOrder: mapp.graphicsLayerIds});
  };
  handleToggle4 = () => {
    this.setState({active4: !this.state.active4});
  };
  handleToggle5 = () => {
    this.setState({active5: !this.state.active5});
  };

  componentDidMount(){

    //Obtener todos los medidores de la comuna.
    getMedidores(this.props.comunaName,(callback)=>{
      if(!callback[0]){
        console.log("Vacio getMedidores");

        this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[4] });
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

    //Obtener todas las luminarias de la comuna
    getTodasLasLuminarias(this.props.comunaName,(callback)=>{

      if(!callback[0]){
        console.log("Vacio getTodasLasLuminarias");

        this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[4] });
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
  }

  handleLogout(){
    browserHistory.push(env.ROUTEPATH);
  }

  handleCheckboxChange = (e) => {
    var mapp = mymap.getMap();

      switch (e) {
      case 'LUMINARIAS':
        this.setState({checkbox: !this.state.checkbox});
        if(!this.state.checkbox){
          console.log("en true, prender LUMINARIAS",this.props.comunaName );

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
          console.log("en true, prender TRAMOSAP",this.props.comunaName);

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

  handleChange = (name, value) => {
   this.setState({...this.state, [name]: value});
  };

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

  handleSnackbarClick = () => {
    this.setState({activeSnackbar: false});

    var mapp = mymap.getMap();

    if(!_.isEmpty(mapp)){
      mapp.graphics.clear();
      mapp.infoWindow.hide();
    }

    gLayerMedidor.clear();

    gLayerTramos.clear();

    gLayerLumAsoc.clear();

    gLayerLuminarias.clear();

    gLayerFind.clear();
  };

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

  onRowClick(gridRow, event) {
    //  console.log("onrowclick",event,gridRow);
    this.setState({ selectedRowId: gridRow.props.data['ID EQUIPO'] });
    this.setState({numeroMedidor: gridRow.props.data['ID EQUIPO'], labelNumeroMedidor: "Luminarias de Medidor N°: " +gridRow.props.data['ID EQUIPO'] });
    console.log(gridRow.props.data['Geometry']);
    getLuminariasAsociadas(gridRow.props.data['ID EQUIPO'],(callback)=>{
      if(!callback[0]){
        console.log("Vacio getLuminariasAsociadas");

        this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[4] });
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

          this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[4] });
          $('.theme__icon___4OQx3').css('color',"red");

          return;
        }
    });

    //dibujar ubicación tramos asociados al medidor
    getTramosMedidor(gridRow.props.data['ID EQUIPO'], (callback)=>{
      if(!callback[0]){
        console.log("Vacio getTramosMedidor");

        this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[4] });
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

            this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[4] });
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

            this.setState({snackbarMessage: callback[2], activeSnackbar: true, snackbarIcon: callback[4] });
            $('.theme__icon___4OQx3').css('color',"red");

            return;
          }
      });

  }

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

  render () {
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
      <div className="drawer_buttons">

        <IconButton icon='search' inverse={ true } onClick={this.handleToggle} />
        <IconButton icon='map' inverse={ true } onClick={this.handleToggle2} />
        <IconButton icon='layers' inverse={ true } onClick={this.handleToggle3} />
        <IconButton icon='settings_input_svideo' inverse={ true } onClick={this.handleToggle4} />
        <IconButton icon='lightbulb_outline' inverse={ true } onClick={this.handleToggle5.bind(this)} />
        <IconButton icon='settings_power' inverse={ true } onClick={this.handleLogout.bind(this)} />

        <Drawer active={this.state.active} onOverlayClick={this.handleToggle}>
          <div className="drawer_banner">
            <Logo />
            <h6 className="drawer_banner_title">Búsqueda</h6>

          </div>
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
              <ProgressBar type="circular" mode="indeterminate" className="drawer_progressBar" />
            </div>
          </div>
        </Drawer>

        <Drawer active={this.state.active2} onOverlayClick={this.handleToggle2}>
          <div className="drawer_banner">
            <Logo />
            <h6  className="drawer_banner_title">Seleccionar Mapa</h6>
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
        </Drawer>

        <Drawer active={this.state.active3} onOverlayClick={this.handleToggle3}>
          <div className="drawer_banner">
            <Logo />
            <h6  className="drawer_banner_title">Seleccionar Layers</h6>
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
        </Drawer>

        <Drawer className="drawer_medidores" active={this.state.active4} onOverlayClick={this.handleToggle4}>
          <div className="drawer_banner">
            <Logo />
            <h6 className="drawer_banner_title">Medidores y Luminarias Asociadas</h6>

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
        </Drawer>

        <Drawer className="drawer_luminarias" active={this.state.active5} onOverlayClick={this.handleToggle5}>
          <div className="drawer_banner">
            <Logo />
            <h6 className="drawer_banner_title">Lista de Luminarias de la comuna</h6>

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
        </Drawer>
        <Snackbar className={this.state.snackbarStyle} action='Aceptar' active={this.state.activeSnackbar} icon={this.state.snackbarIcon} label={this.state.snackbarMessage} onClick={this.handleSnackbarClick.bind(this)} type='cancel' />

      </div>
    );
  }
}

export {DrawerTest};

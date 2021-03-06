import token from '../services/token-service';
import myinfotemplate from '../utils/infoTemplates';
import mymap from '../services/map-service';
import {ap_infoWindow} from '../utils/makeInfowindow';
//import GraphicsLayer from 'esri/layers/GraphicsLayer ';
import env from '../services/config';

function getMapLayers() {
  var map = mymap.getMap();
    for (var j = 0, jl = map.layerIds.length; j < jl; j++) {
        var currentLayer = map.getLayer(map.layerIds[j]);
        console.log("id: " + currentLayer.id + ", visible: " + currentLayer.visible + ", opacity: " + currentLayer.opacity);
    }
}

function myLayers(){

  var serviceMain;
  var serviceURL;

  if(env.BUILDFOR=="INTERNA"){
    serviceMain = 'http://gisred.chilquinta/arcgis/';
  }else{
    serviceMain = 'http://gisred.chilquinta.cl:5555/arcgis/';

  }
   serviceURL = serviceMain + 'rest/services/';

  //check 8 and last one
  return {
    read_dynamic_ap(){
      return serviceURL + "AP_Municipal/AP_MUNICIPAL/MapServer?f=json&token=" + token.read();
    },
    read_generateTokenURL(){
      return serviceMain + "tokens/generateToken";
    },

    read_luminarias(){
      return serviceURL + "AP_Municipal/AP_MUNICIPAL/FeatureServer/1?f=json&token=" + token.read();
    },

    read_tramosAP(){
      return serviceURL + "AP_Municipal/AP_MUNICIPAL/MapServer/2?f=json&token=" + token.read();
    },

    read_modificacionesAP(){
      return serviceURL + "AP_Municipal/AP_MUNICIPAL/FeatureServer/0?f=json&token=" + token.read();
    },

    read_limiteComunal(){
      return serviceURL + "AP_Municipal/AP_MUNICIPAL/MapServer/4?f=json&token=" + token.read();
    },

    read_rotulos(){
      return serviceURL + "Chilquinta_006/Nodos_006/MapServer/0?f=json&token=" + token.read();
    },

    read_medidores(){
      return serviceURL + "AP_Municipal/AP_MUNICIPAL/FeatureServer/3?f=json&token=" + token.read();
    },

    read_fotos(){
      return serviceURL + "AP_Municipal/AP_MUNICIPAL/FeatureServer/10?f=json&token=" + token.read();
    },

    read_ap_modificaciones_applyedits() {
      return serviceURL + "AP_Municipal/AP_MUNICIPAL/FeatureServer/0/applyedits";
    },

//*//*/

    read_SSEE(){
      return serviceURL + "Chilquinta_006/Equipos_pto_006/MapServer?f=json&token=" + token.read();
    },
    read_layerAlimentador(){  /*using*/
        return serviceURL + "Chilquinta_006/Tramos_006/MapServer?f=json&token=" + token.read();
    },

    read_logAccess(){  /*using*/
      return serviceURL + "Admin/LogAccesos/FeatureServer/2?f=json&token=" + token.read();
    },
    read_logAccess2(){
    //chq mapabase(){
    return serviceURL + "Admin/LogAccesos/FeatureServer/2?f=json&token=" + token.read();;
    },
    read_mapabase(){
      return serviceURL + "MapaBase/MapServer?f=json&token=" + token.read();
    },
    //dmps adresses
    read_cartography(){
      return serviceURL + "Cartografia/DMPS/MapServer?f=json&token=" + token.read();
    },

    //The following layers and services are just for Interruptions app. (interrupciones.html and interruptions.js)
    //Featurelayer for orders per sed (with graphics)


    //CODING REFACTOR: 09/11
    read_logAcessosSave(){
      return serviceURL +"Admin/LogAccesos/FeatureServer/1/applyedits";
    }


  };
}

//TO DO: this function sets the layers that will be added in the app, integrating the infowindow and their special properties.
function setLayers(){
  //check n°7
  return {
    alimentadores(){
      var layerAlimentador = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_layerAlimentador(),{id:"gis_alimentadores"});
      layerAlimentador.setImageFormat("png32");
      layerAlimentador.setVisibleLayers([0]);
      layerAlimentador.setInfoTemplates({
        0: {infoTemplate: myinfotemplate.getAlimentadorInfoWindow()}
      });

      return layerAlimentador;
    },
    interrupciones(){
      var interrClienteSED = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_dyn_layerClieSED(),{id:"po_interrupciones"});
      interrClienteSED.setInfoTemplates({
        3: {infoTemplate: myinfotemplate.getNisInfo()},
        1: {infoTemplate: myinfotemplate.getIsolatedNisFailure()},
        0: {infoTemplate: myinfotemplate.getSubFailure()}
      });
      interrClienteSED.refreshInterval = 1;
      interrClienteSED.setImageFormat("png32");
      interrClienteSED.on('update-end', (obj)=>{
        if(obj.error){
          console.log("Redirecting to login page, token for this session is ended...");
          window.location.href = "index.html";
        }
      });
        return interrClienteSED;
    },
    cuadrillas(){
      var cuadrillasLayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_dyn_layerClieSED(),{id:"po_cuadrillas"});
      /*cuadrillasLayer.setInfoTemplates({
        3: {infoTemplate: myinfotemplate.getNisInfo()},
        1: {infoTemplate: myinfotemplate.getIsolatedNisFailure()},
        0: {infoTemplate: myinfotemplate.getSubFailure()}
      });
      */
      //interrClienteSED.refreshInterval = 1;
      cuadrillasLayer.setImageFormat("png32");
      return cuadrillasLayer;
    },
    ap_comuna(whereRegion){
      var apComunaLayer = new esri.layers.FeatureLayer(myLayers().read_ap_comuna(),{id:"ap_comuna"});
      apComunaLayer.setDefinitionExpression(whereRegion);
      console.log(whereRegion);
      return apComunaLayer;
    },
    ap_modificaciones(whereRegion, layerNumber){
      var apModificacionesLayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_ap_modificaciones(),{id:"ap_modificaciones"});
      apModificacionesLayer.setImageFormat("png32");
      apModificacionesLayer.setVisibleLayers([0]);
      var layerDefinitions = [];
      layerDefinitions[0] = whereRegion;
      apModificacionesLayer.setLayerDefinitions(layerDefinitions);

      return apModificacionesLayer;
    }/*,
    ap_luminarias(whereRegion, layerNumber){
      var apLuminariasLayer = new esri.layers.FeatureLayer(myLayers().read_ap_luminarias(),{id:"ap_luminarias",
      mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      minScale: 9000,
      outFields: ["*"]});
      apLuminariasLayer.setDefinitionExpression(whereRegion);

      //ON MOUSE OVER EVENT
      apLuminariasLayer.on('mouse-over',(evt)=>{

        ap_infoWindow(evt.graphic.attributes['ID_LUMINARIA'],
          evt.graphic.attributes['ROTULO'],
          evt.graphic.attributes['TIPO_CONEXION'],
          evt.graphic.attributes['TIPO'],
          evt.graphic.attributes['PROPIEDAD'],
          evt.graphic.attributes['MEDIDO_TERRENO'],
          evt.graphic.geometry);

      });
      apLuminariasLayer.on('click', (evt)=>{
        ap_showEditor(evt);
      });

      return apLuminariasLayer;
    },
    */
    ,
    ap_luminarias(whereRegion, layerNumber){
      var apLuminariasLayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_ap_luminarias(),{id:"ap_luminarias",
      minScale: 9000});
      apLuminariasLayer.setImageFormat("png32");
      apLuminariasLayer.setVisibleLayers([1,2]);
      var layerDefinitions = [];
      layerDefinitions[1] = whereRegion;
      layerDefinitions[2] = whereRegion;

      apLuminariasLayer.setLayerDefinitions(layerDefinitions);

      /*//ON MOUSE OVER EVENT
      apLuminariasLayer.on('mouse-over',(evt)=>{

        ap_infoWindow(evt.graphic.attributes['ID_LUMINARIA'],
          evt.graphic.attributes['ROTULO'],
          evt.graphic.attributes['TIPO_CONEXION'],
          evt.graphic.attributes['TIPO'],
          evt.graphic.attributes['PROPIEDAD'],
          evt.graphic.attributes['MEDIDO_TERRENO'],
          evt.graphic.geometry);

      });
      apLuminariasLayer.on('click', (evt)=>{
        ap_showEditor(evt);
      });
      */
      return apLuminariasLayer;
    },
    ap_tramos(whereRegion, layerNumber){
      var apTramosLayer = new esri.layers.FeatureLayer(myLayers().read_ap_tramos(),{id:"ap_tramos",
      mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
      minScale: 9000});

      apTramosLayer.setDefinitionExpression(whereRegion);
      console.log(whereRegion);

      return apTramosLayer;
    },
    /* factigis module */
    factigis_transmision(whereRegion, layerNumber){
      var fDistribucionsLayer = new esri.layers.FeatureLayer(myLayers().read_factigis_transmision(),{id:"factigis_transmision"
      });

      return fDistribucionsLayer;
    },
    factigis_distribucion(whereRegion, layerNumber){
      var fTransmisionLayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_factigis(),{id:"factigis_distribucion",
      opacity:0.3});
      fTransmisionLayer.setImageFormat("png32");
      fTransmisionLayer.setVisibleLayers([1]);
      return fTransmisionLayer;
    },
    factigis_vialidad(whereRegion, layerNumber){
      var fVialidadsLayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_factigis2(),{id:"factigis_vialidad",
      opacity:0.3});
      fVialidadsLayer.setVisibleLayers([0]);
      fVialidadsLayer.setImageFormat("png32");
      return fVialidadsLayer;
    },
    gis_SSEE(whereRegion, layerNumber){
      var fSSEELayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_SSEE(),{id:"gis_SSEE"});
      fSSEELayer.setVisibleLayers([0]);
      fSSEELayer.setImageFormat("png32");
      return fSSEELayer;
    },
    gis_campamentos(whereRegion, layerNumber){
      var fcampamentosLayer = new esri.layers.FeatureLayer(myLayers().read_campamentos(),{id:"gis_campamentos",
      mode: esri.layers.FeatureLayer.MODE_ONDEMAND});

      return fcampamentosLayer;
    },
    gis_rotulos(){
      var frotulosLayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_rotulos(),{id:"gis_rotulos"});
      frotulosLayer.setVisibleLayers([0]);
      frotulosLayer.setImageFormat("png32");
      return frotulosLayer;
    },
    gis_direcciones(){
      var fdireccionesLayer = new esri.layers.FeatureLayer(myLayers().read_direcciones(),{id:"gis_direcciones",
      outFields: ["id_direccion","comuna","nombre_calle","numero"]});

      return fdireccionesLayer;
    },
    gis_cartografia(){
      var fSSEELayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_cartography(),{id:"gis_cartografia"});
      fSSEELayer.setVisibleLayers([0]);
      fSSEELayer.setImageFormat("png32");
      return fSSEELayer;
    //  http://gisred.chilquinta.cl:5555/arcgis/rest/services/Cartografia/Cartografia/MapServer
    },
    gis_chqbasemap(){
      var fSSEELayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_mapabase(),{id:"gis_chqbasemap"});

      fSSEELayer.setImageFormat("png32");
      return fSSEELayer;
    //  http://gisred.chilquinta.cl:5555/arcgis/rest/services/Cartografia/Cartografia/MapServer
    },
    mobile_direccionesNuevas(){
      var fSSEELayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_direccionesNuevasMobile(),{id:"mobile_direccionesNuevas",
      minScale: 3000});
      fSSEELayer.setImageFormat("png32");
      fSSEELayer.setVisibleLayers([2]);
      return fSSEELayer;

    },
    factigis_subestaciones(){
      var fSSEELayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_subestaciones(),{id:"factigis_subestaciones",
      minScale: 3000});
      fSSEELayer.setImageFormat("png32");
      fSSEELayer.setVisibleLayers([1]);
      return fSSEELayer;
    },
    factigis_MT(){
      var fSSEELayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_layerAlimentador(),{id:"factigis_MT",
      minScale: 3000});
      fSSEELayer.setImageFormat("png32");
      fSSEELayer.setVisibleLayers([0]);
      return fSSEELayer;

    },
    factigis_BT(){
      var fSSEELayer = new esri.layers.ArcGISDynamicMapServiceLayer(myLayers().read_layerAlimentador(),{id:"factigis_BT",
      minScale: 3000});
      fSSEELayer.setImageFormat("png32");
      fSSEELayer.setVisibleLayers([1]);
      return fSSEELayer;

    }
  }
}

//TO DO: this function can be used to know the active layers in the map.
function layersActivated(){
  var activeLayers= [];
  var mapp = mymap.getMap();
  var activeLayersLength = mapp.layerIds.length;
  //console.log(mapp.layerIds.length);
  return {
    getMapLayers() {
      for (var j=0; j<activeLayersLength; j++) {
        var currentLayer = mapp.getLayer(mapp.layerIds[j]);
        activeLayers.push(currentLayer.id);
        //alert("id: " + currentLayer.id);
      }
      console.log("Layers actived" ,activeLayers);
      return activeLayers;

    }
  }
}

// TO DO: this function add the default and not defaults layer (from the LayerList) in the app.
function addCertainLayer(layerNameToAdd, order, where, callback){
  //checkbox setup n° 6
  var mapp = mymap.getMap();
  var myLayerToAdd;

  console.log("adding layer: ", layerNameToAdd,order);

  switch (layerNameToAdd) {

    case 'ap_comuna':
      myLayerToAdd = setLayers().ap_comuna(where, 4);
    break;

    case 'po_interrupciones':
      myLayerToAdd = setLayers().interrupciones();
    break;

    case 'gis_alimentadores':
      myLayerToAdd = setLayers().alimentadores();
    break;

    case 'ap_luminarias':
      myLayerToAdd = setLayers().ap_luminarias(where,6);
    break;

    case 'ap_modificaciones':
      myLayerToAdd = setLayers().ap_modificaciones(where,7);
    break;

    case 'ap_tramos':
      myLayerToAdd = setLayers().ap_tramos(where,5);
    break;

    case 'factigis_transmision':
      myLayerToAdd = setLayers().factigis_transmision(where,order);
    break;

    case 'factigis_distribucion':
      myLayerToAdd = setLayers().factigis_distribucion(where,order);
    break;

    case 'factigis_vialidad':
      myLayerToAdd = setLayers().factigis_vialidad(where,order);
    break;

    case 'gis_SSEE':
      myLayerToAdd = setLayers().read_SSEE(where,order);
    break;
    case 'gis_campamentos':
      myLayerToAdd = setLayers().read_campamentos(where,order);
    break;
    case 'gis_direcciones':
      myLayerToAdd = setLayers().gis_direcciones(where,order);
    break;
    case 'gis_cartografia':
      myLayerToAdd = setLayers().gis_cartografia(where,order);
    break;
    case 'gis_rotulos':
      myLayerToAdd = setLayers().gis_rotulos(where,order);
    break;
    case 'gis_chqbasemap':
      myLayerToAdd = setLayers().gis_chqbasemap(where,order);
    break;
    case 'mobile_direccionesNuevas':
      myLayerToAdd = setLayers().mobile_direccionesNuevas(where,order);
    break;
    case 'factigis_subestaciones':
      myLayerToAdd = setLayers().factigis_subestaciones(where,order);
    break;
    case 'factigis_MT':
      myLayerToAdd = setLayers().factigis_MT(where,order);
    break;
    case 'factigis_BT':
      myLayerToAdd = setLayers().factigis_BT(where,order);
    break;
    default:
  }

  mapp.addLayer(myLayerToAdd,order);

  //Set here if you add more layers in the LayerList.
  //checkbox setup n° 5
  if (check_alimentador.checked){
    mapp.addLayer(setLayers().alimentadores(),1);
  }
  if (check_ap_modificaciones.checked){
    mapp.addLayer(setLayers().ap_modificaciones(), 1);
  }
  if (check_factigis_distribucion.checked){
    mapp.addLayer(setLayers().factigis_distribucion(), 1);
  }
  if (check_factigis_transmision.checked){
    mapp.addLayer(setLayers().factigis_transmision(), 1);
  }
  if (check_factigis_vialidad.checked){
    mapp.addLayer(setLayers().factigis_vialidad(), 1);
  }
  if (check_SSEE.checked){
    mapp.addLayer(setLayers().SSEE(), 1);
  }
  if (check_campamentos.checked){
    mapp.addLayer(setLayers().campamentos(), 1);
  }
  if (check_chqbasemap.checked){
    mapp.addLayer(setLayers().gis_chqbasemap(), 1);
  }
  if (check_subestaciones.checked){
    mapp.addLayer(setLayers().factigis_subestaciones(), 1);
  }
  if (check_MT.checked){
    mapp.addLayer(setLayers().factigis_MT(), 1);
  }
  if (check_BT.checked){
    mapp.addLayer(setLayers().factigis_BT(), 1);
  }
  if (check_Postes.checked){
    mapp.addLayer(setLayers().gis_rotulos(), 1);
  }

  callback(myLayerToAdd);
}
export default myLayers();
export {setLayers,layersActivated,addCertainLayer,getMapLayers};

import layers from '../services/layers-service';
import makeSymbol from '../utils/makeSymbol';
import {makeInfowindow} from '../utils/makeInfowindow';
import {makeInfowindowPerSED} from '../utils/makeInfowindow';
import {makeInfowindowPerSEDInterrupted} from '../utils/makeInfowindow';
import {makeInfowindowPerNisInfo} from '../utils/makeInfowindow';
import createQueryTask from '../services/createquerytask-service';
import {notifications} from '../utils/notifications';
import _ from 'lodash';
import mymap from '../services/map-service';
import GraphicsLayer from 'esri/layers/GraphicsLayer';

var gLayerFind = new GraphicsLayer();


function searchRotulo(rotulo, callback){
  let pointSymbol = makeSymbol.makePoint();
  let mapp = mymap.getMap();
    var qTaskRotulo = new esri.tasks.QueryTask(layers.read_rotulos());
    var qRotulo = new esri.tasks.Query();

    qRotulo.returnGeometry = true;
    qRotulo.outFields=["*"];
    qRotulo.where = "rotulo='" + rotulo + "'";

    qTaskRotulo.execute(qRotulo, (featureSet)=>{
      console.log(featureSet.features.length);
      if(!featureSet.features.length){
        return callback([false,[],"Rótulo no encontrado","clear","red"]);
      }

      gLayerFind.add(new esri.Graphic(featureSet.features[0].geometry,pointSymbol));

    //  map.graphics.add(new esri.Graphic(featureSet.features[0].geometry,myLineSymbol));
      mapp.addLayer(gLayerFind,1);

      //mapp.graphics.add(new esri.Graphic(featureSet.features[0].geometry,pointSymbol));
      mapp.centerAndZoom(featureSet.features[0].geometry,20);
      return callback([true,[],"Rótulo: "+ rotulo + " encontrado","check","greenyellow"]);
    }, (Errorq)=>{
      console.log(Errorq,"Error doing query for searchRotulo");
      return callback([false,[],"Rótulo no encontrado. Problemas realizando query.","clear","red"]);
    });
}

function searchIDNodo(idnodo, callback){
  let pointSymbol = makeSymbol.makePoint();
  let mapp = mymap.getMap();
    var qTaskRotulo = new esri.tasks.QueryTask(layers.read_rotulos());
    var qRotulo = new esri.tasks.Query();

    qRotulo.returnGeometry = true;
    qRotulo.outFields=["*"];
    qRotulo.where = "id_nodo ='" + idnodo + "'";

    qTaskRotulo.execute(qRotulo, (featureSet)=>{
      console.log(featureSet.features.length);
      if(!featureSet.features.length){
        return callback([false,[],"ID Nodo no encontrado","clear","red"]);
      }
      console.log(featureSet.features[0].geometry);
      mapp.graphics.add(new esri.Graphic(featureSet.features[0].geometry,pointSymbol));
      mapp.centerAndZoom(featureSet.features[0].geometry,20);
      return callback([true,[],"ID Nodo: "+ idnodo + " encontrado","check","greenyellow"]);
    }, (Errorq)=>{
      console.log(Errorq,"Error doing query for searchRotulo");
      return callback([false,[],"ID Nodo no encontrado. Problemas realizando query.","clear","red"]);
    });
}

export {searchRotulo, searchIDNodo, gLayerFind};

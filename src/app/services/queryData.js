import layers from '../services/layers-service';
import makeSymbol from '../utils/makeSymbol';
import mymap from '../services/map-service';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import Graphic from 'esri/graphic';
import {ap_infoWindow} from '../utils/makeInfowindow';
import Tooltip from 'react-toolbox/lib/tooltip';
import React from 'react';
import FeatureLayer from 'esri/layers/FeatureLayer';

//02/03/2017: probando identify.
import IdentifyTask from 'esri/tasks/IdentifyTask';
import IdentifyParameters from 'esri/tasks/IdentifyParameters';



var gLayerMedidor = new GraphicsLayer();
var gLayerLumAsoc = new GraphicsLayer();
var gLayerTramos = new GraphicsLayer();
var gLayerLuminarias = new GraphicsLayer();
var gLayerLuminariaSearch = new GraphicsLayer();
function getMedidores(comuna, callback){

    var qTaskMedidores = new esri.tasks.QueryTask(layers.read_medidores());
    var qMedidores = new esri.tasks.Query();

    qMedidores.returnGeometry = true;
    qMedidores.outFields=["*"];
    qMedidores.where = "comuna ='" + comuna + "'";

    qTaskMedidores.execute(qMedidores, (featureSet)=>{

      if(!featureSet.features.length){
        return callback([false,[],"Medidores no encontrados","clear","red"]);
      }

      return callback([true,featureSet.features,"Medidores encontrados","check","greenyellow"]);
    }, (Errorq)=>{
      console.log(Errorq,"Error doing query for getMedidores");
      return callback([false,[],"Medidores no encontrados. Problema con query","clear","red"]);
    });
}

function getTodasLasLuminarias(comuna, callback){

    var qTaskLuminarias = new esri.tasks.QueryTask(layers.read_luminarias());
    var qLuminarias = new esri.tasks.Query();

    qLuminarias.returnGeometry = true;
    qLuminarias.outFields=["*"];
    qLuminarias.where = "comuna ='" + comuna + "' AND ID_LUMINARIA <> 0";

    qTaskLuminarias.execute(qLuminarias, (featureSet)=>{

      if(!featureSet.features.length){
        return callback([false,[],"Luminarias no encontradas","clear","red"]);
      }

      return callback([true,featureSet.features,"Luminarias encontrados","check","greenyellow"]);
    }, (Errorq)=>{
      console.log(Errorq,"Error doing query for getMedidores");
      return callback([false,[],"Luminarias no encontradas. Problema con query","clear","red"]);
    });
}

function getLuminariasAsociadas(medidor, callback){
    let map = mymap.getMap();

    let mySymbol = makeSymbol.makePointRelated();
    var qTaskLuminariasAsociadas = new esri.tasks.QueryTask(layers.read_luminarias());
    var qLuminariasAsociadas = new esri.tasks.Query();

    qLuminariasAsociadas.returnGeometry = true;
    qLuminariasAsociadas.outFields=["*"];
    qLuminariasAsociadas.where = "ID_EQUIPO_AP  =" + medidor ;

    qTaskLuminariasAsociadas.execute(qLuminariasAsociadas, (featureSet)=>{

      if(!featureSet.features.length){
        return callback([false,[],"Luminarias asociadas no encontradas","clear","red"]);
      }

      let finalResults = featureSet.features.map((result, index)=>{
        let children = {
          "ID LUMINARIA":  result.attributes['ID_LUMINARIA'],
          "TIPO CONEXIÓN": result.attributes['TIPO_CONEXION'],
          "PROPIEDAD": result.attributes['PROPIEDAD'],
          "MEDIDO": result.attributes['MEDIDO_TERRENO'],
          "DESCRIPCION": result.attributes['DESCRIPCION'],
          "ROTULO": result.attributes['ROTULO']
        };
        //draw the points
        var g = new Graphic(featureSet.features[index].geometry,mySymbol,children);
        gLayerLuminarias.add(g);
        return g;
      });


      map.addLayer(gLayerLuminarias,1);
      gLayerLuminarias.on('mouse-over',(event)=>{
          console.log("seeing the graphic here.");
            ap_infoWindow(event.graphic.attributes['ID LUMINARIA'],
              event.graphic.attributes['ROTULO'],
              event.graphic.attributes['TIPO CONEXIÓN'],
              event.graphic.attributes['DESCRIPCION'],
              event.graphic.attributes['PROPIEDAD'],
              event.graphic.attributes['MEDIDO'],
              event.graphic.geometry);
          });

      return callback([true,featureSet.features,"Luminarias asociadas encontradas","check","greenyellow"]);
    }, (Errorq)=>{
      console.log(Errorq,"Error doing query for getMedidores");
      return callback([false,[],"Luminarias asociadas. Problema con query","clear","red"]);
    });
}

function getMedidorLocation(idmedidor, callback){

  let mySymbol = makeSymbol.makeLine();
  var map = mymap.getMap();

  var qTaskMedidores = new esri.tasks.QueryTask(layers.read_medidores());
  var qMedidores = new esri.tasks.Query();

  qMedidores.returnGeometry = true;
  qMedidores.outFields=["*"];
  qMedidores.where = "id_medidor =" + idmedidor ;

  qTaskMedidores.execute(qMedidores, (featureSet)=>{

    if(!featureSet.features.length){
      return callback([false,[],"Medidor no encontrado","clear","red"]);
    }

    var myLineSymbol = makeSymbol.makeLine();
    gLayerMedidor.add(new esri.Graphic(featureSet.features[0].geometry,myLineSymbol));

  //  map.graphics.add(new esri.Graphic(featureSet.features[0].geometry,myLineSymbol));
    map.addLayer(gLayerMedidor);
  //  map.centerAndZoom(featureSet.features[0].geometry.getExtent().getCenter(),20);

    return callback([true,featureSet.features,"Medidor encontrado","check","greenyellow"]);
  }, (Errorq)=>{
    console.log(Errorq,"Error doing query for getMedidores");
    return callback([false,[],"Medidor no encontrado. Problema con query de ubicación de medidor","clear","red"]);
  });

}

function getTramosMedidor(idmedidor, callback){

  let mySymbol = makeSymbol.makeTrackLine();
  var map = mymap.getMap();

  var qTaskTramos = new esri.tasks.QueryTask(layers.read_tramosAP());
  var qTramos = new esri.tasks.Query();

  qTramos.returnGeometry = true;
  qTramos.outFields=["*"];
  qTramos.where = "id_equipo_ap  =" + idmedidor ;

  qTaskTramos.execute(qTramos, (featureSet)=>{

    if(!featureSet.features.length){
      return callback([false,[],"Tramos no encontrados","clear","red"]);
    }

    featureSet.features.forEach(feature =>{
      gLayerTramos.add(new esri.Graphic(feature.geometry,mySymbol));
      //map.graphics.add(new esri.Graphic(feature.geometry,mySymbol));
    });
  //  map.graphics.add(new esri.Graphic(featureSet.features[0].geometry,myLineSymbol));
    map.addLayer(gLayerTramos);

    var myExtend= new esri.graphicsExtent(featureSet.features);
    map.setExtent(myExtend,true);

    return callback([true,featureSet.features,"Tramos encontrados","check","greenyellow"]);
  }, (Errorq)=>{
    console.log(Errorq,"Error doing query for getTramosMedidor");
    return callback([false,[],"Tramos no encontrados. Problema con query de ubicación de tramos","clear","red"]);
  });

}

function getLuminariaLocation(idluminaria, callback){
  let mySymbol = makeSymbol.makePoint();
  var map = mymap.getMap();
  gLayerLumAsoc.clear();
  var qTaskLuminaria = new esri.tasks.QueryTask(layers.read_luminarias());
  var qLuminaria = new esri.tasks.Query();

  qLuminaria.returnGeometry = true;
  qLuminaria.outFields=["*"];
  qLuminaria.where = "ID_LUMINARIA  =" + idluminaria ;

  qTaskLuminaria.execute(qLuminaria, (featureSet)=>{

    if(!featureSet.features.length){
      return callback([false,[],"Luminaria no encontrada","clear","red"]);
    }

    gLayerLumAsoc.add(new esri.Graphic(featureSet.features[0].geometry,mySymbol));

    map.addLayer(gLayerLumAsoc,1);
    map.centerAndZoom(featureSet.features[0].geometry,20);

    return callback([true,featureSet.features,"Luminaria encontrada","check","greenyellow"]);
  }, (Errorq)=>{
    console.log(Errorq,"Error doing query for getLuminariaLocation");
    return callback([false,[],"Luminaria no encontrada. Problema con query de ubicación de luminaria","clear","red"]);
  });

}

function getFotografías(idnodo, callback){
  console.log("buscando fotos para nodo...:",idnodo);
  var map = mymap.getMap();

  var qTaskFotografías = new esri.tasks.QueryTask(layers.read_fotos());
  var qFotografias = new esri.tasks.Query();

  qFotografias.returnGeometry = true;
  qFotografias.outFields=["*"];
  qFotografias.where = "id_nodo =" + idnodo ;

  qTaskFotografías.execute(qFotografias, (featureSet)=>{
    console.log("fotos encontradas...",featureSet.features.length);
    if(!featureSet.features.length){
      return callback([false,[]]);
    }

    var queryAttachments = new FeatureLayer(layers.read_fotos());
    queryAttachments.queryAttachmentInfos(featureSet.features[0].attributes['OBJECTID'],(fotos)=>{

      return callback([true, fotos]);
    });


  }, (Errorq)=>{
    console.log(Errorq,"Error doing query for getFotografías");
    return callback([false,[]]);
  });

}

//info de luminaria
function getInfoLuminariaSeleccionada(idluminaria, callback){
  var map = mymap.getMap();

  var qTaskLuminariaSelected = new esri.tasks.QueryTask(layers.read_luminarias());
  var qLuminariaSelected = new esri.tasks.Query();

  qLuminariaSelected.returnGeometry = true;
  qLuminariaSelected.outFields=["*"];
  qLuminariaSelected.where = "ID_LUMINARIA=" + idluminaria ;

  qTaskLuminariaSelected.execute(qLuminariaSelected, (featureSet)=>{
    console.log("luminaria seleccionada ",featureSet.features.length);
    if(!featureSet.features.length){
      return callback([false,[]]);
    }

    return callback([true,featureSet.features,"Luminaria encontrada","check","greenyellow"])


  }, (Errorq)=>{
    console.log(Errorq,"Error doing query for getInfoLuminariaSeleccionada");
    return callback([false,[],"Información de Luminaria no encontrada","clear","red"]);
  });
}

//info de modificaciones de una luminaria
function getInfoLuminariaModificaciones(idnodo, idluminaria, callback){
  var map = mymap.getMap();

  var qTaskLuminariaModificaciones = new esri.tasks.QueryTask(layers.read_modificacionesAP());
  var qLuminariaModificaciones = new esri.tasks.Query();

  qLuminariaModificaciones.returnGeometry = true;
  qLuminariaModificaciones.outFields=["*"];
  qLuminariaModificaciones.where = "id_nodo=" + idnodo + "AND id_luminaria =" + idluminaria;

  qTaskLuminariaModificaciones.execute(qLuminariaModificaciones, (featureSet)=>{
    console.log("luminaria modificaciones ",featureSet.features.length);
    if(!featureSet.features.length){
      return callback([false,[]]);
    }

    return callback([true,featureSet.features,"Luminaria modificaciones","check","greenyellow"])


  }, (Errorq)=>{
    console.log(Errorq,"Error doing query for getInfoLuminariaModificaciones");
    return callback([false,[],"Información de modificaciones de luminaria no encontrada","clear","red"]);
  });
}

function getInfoLuminariaCercana(geometry, callback){

  var map = mymap.getMap();

  var myRectangulo = crearRectangulo(geometry,10);

  var qTaskLuminariaSelected = new esri.tasks.QueryTask(layers.read_luminarias());
  var qLuminariaSelected = new esri.tasks.Query();

  qLuminariaSelected.returnGeometry = true;
  qLuminariaSelected.outFields=["*"];

  qLuminariaSelected.geometry = myRectangulo;
  qLuminariaSelected.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;
  qTaskLuminariaSelected.execute(qLuminariaSelected, (featureSet)=>{

    if(!featureSet.features.length){
      return callback([false,[],"Luminarias no encontradas, intente haciendo clic en otro sitio","clear","red"]);
    }

    return callback([true,featureSet.features,"Luminaris(s) encontradas","check","greenyellow"])


  }, (Errorq)=>{
    console.log(Errorq,"Error doing query for getInfoLuminariaCercana");
    return callback([false,[],"Información de Luminaria no encontrada","clear","red"]);
  });

}

function crearRectangulo(geometry,delta){
  var rectangulo = new esri.geometry.Polygon(new esri.SpatialReference(geometry.spatialReference));
    rectangulo.addRing([ [geometry.x-1,geometry.y-1],[geometry.x-1,geometry.y+1],[geometry.x+1,geometry.y+1],[geometry.x+1,geometry.y-1],[geometry.x-1,geometry.y-1] ])

		return rectangulo;
}


//03/04/217:

function clearGraphicsLayers(Medidor,LumAsoc,Tramos,Luminarias,LuminariaSearch){
  if(Medidor){
    gLayerMedidor.clear();
  }
  if(LumAsoc){
    gLayerLumAsoc.clear();
  }
  if(Tramos){
    gLayerTramos.clear();
  }
  if(Luminarias){
    gLayerLuminarias.clear();
  }
  if(LuminariaSearch){
    gLayerLuminariaSearch.clear();
  }

}

export {getMedidores,
  getLuminariasAsociadas,
   getMedidorLocation,
   getTramosMedidor,
   getLuminariaLocation,
   gLayerMedidor,
   gLayerTramos,
   gLayerLumAsoc,
   gLayerLuminarias,
   gLayerLuminariaSearch,
   getTodasLasLuminarias,
   getFotografías,
   getInfoLuminariaSeleccionada,
   getInfoLuminariaModificaciones,
   getInfoLuminariaCercana,
   clearGraphicsLayers};

import React from 'react';
import mymap from '../services/map-service';
import ArcGISDynamicMapServiceLayer from 'esri/layers/ArcGISDynamicMapServiceLayer';
import layers from '../services/layers-service';
import myinfotemplate from '../utils/infoTemplates';
import {browserHistory} from 'react-router';
import {Simbologia} from './Simbologia.jsx';

class LinaresMap extends React.Component {
  constructor(props){
    super(props);

  }

  componentDidMount(){
    console.log("en linares map");
  /*var mapp = new Map("map",{basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
          center: [-71.2905, -33.1009], // longitude, latitude
          zoom: 9});
  */
  var mapp = mymap.createMap("map","topo",-71.5933, -35.8447,11);

  //agregando layer clientes sed.
  /*var interrClienteSED = new ArcGISDynamicMapServiceLayer(layers.read_dyn_layerClieSED(),{id:"po_interrupciones"});
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
        browserHistory.push("/");
      }
    });

    mapp.addLayer(interrClienteSED);
    */
  }


  render(){
    return (
        <div className="map_container">
          <div id="map"></div>
          <Simbologia />
        </div>

    );
  }
}

export default LinaresMap;

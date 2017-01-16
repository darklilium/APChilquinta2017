
import Map from 'esri/map';

/*
//TO DO: this var sets the map to be used in the whole app.
var map = {
    createMap: function(div,basemap,centerx,centery,zoom){
        this.map = new esri.Map(div, {
          center:[centerx, centery],
          basemap: basemap,
          zoom:zoom,
          logo: false
        });
        return this.map;
    },
    getMap: function(){
      return this.map;
    },
    changeBasemap: function(bm){
      //get all the active layers on the map:
      var myActiveLayers = layersActivated().getMapLayers();
      console.log("myActive layers", myActiveLayers);
      console.log("my basemap is", bm);

      /* Removing all the layers first and then if chilquinta add the layer simulating a basemap.
      In other cases, set the esri basemap  */

    //  var baseMapLayer = new esri.layers.ArcGISDynamicMapServiceLayer(mylayers.read_mapabase(),{id:"CHQBasemap"});

      //if bm is not chilquinta basemap, remove all the layers and add them again
      /*if(bm!='Chilquinta'){
          this.map.removeAllLayers();

          myActiveLayers.forEach(activeLayer =>{
            addCertainLayer(activeLayer,10,"", (callback)=>{});
          });

          this.map.setBasemap(bm);
          return;
        }
      //if bm is chilquinta, remove all the layers and then add chilquinta basemap layer in first(0) position.
      //also add the activeLayers on the map (depending on default layers for each app).
      this.map.removeAllLayers();

      myActiveLayers.forEach((activeLayer, index) =>{
        addCertainLayer(activeLayer,10+index,"", (callback)=>{});
      });
      this.map.addLayer(baseMapLayer,0);

    }
};

export default map;
*/

var map = {
  createMap: function(div,basemap,centerx,centery,zoom){
      this.map = new esri.Map(div, {
        center:[centerx, centery],
        basemap: basemap,
        zoom:zoom,
        logo: false
      });
      return this.map;
  },
  getMap: function(){
    return this.map;
  }
}

/*
function returnMap(){
    var mapp = new Map("map",{basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
            center: [-71.2905, -33.1009], // longitude, latitude
            zoom: 9});
    return mapp;
}
*/

export default map;

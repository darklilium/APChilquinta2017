import layers from '../services/layers-service';
import token from '../services/token-service';
import jQuery from 'jquery';
import _ from 'lodash';

function nuevoQuery(nuevosAttr, newGeometry, callback){

    const data = {
      f: 'json',
      adds: JSON.stringify([{ attributes: nuevosAttr, geometry: {"x":newGeometry.x , "y": newGeometry.y}}]),
      token: token.read()
    };



    jQuery.ajax({
      method: 'POST',
      url: layers.read_ap_modificaciones_applyedits(),
      dataType:'html',
      data: data
    })
    .done(d =>{

      let json = JSON.parse(d);
      console.log(json);
      if( (_.has(json,'error')) ){
        return callback(false);
      }else{
        if( (_.has(json,'error')) ){
          return callback(false);
        }else{
          let arrObject = [];
          if(json["addResults"][0].objectId>0){
            return callback(true);

          }else{
            return callback(false);
          }
        }

      }
    })
    .fail(f=>{
      console.log(f,"no pase")
      callback(false)
    });



}


export {nuevoQuery}

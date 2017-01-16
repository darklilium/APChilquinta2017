import layers from '../services/layers-service';
import createQueryTask from '../services/createquerytask-service';
import $ from 'jquery';
import Highcharts from 'highcharts';
import highcharts from 'highcharts/modules/exporting';
import QueryTask from 'esri/tasks/QueryTask';


var graphicResults = {
  setResultsGraphic1: function(regions,domi,red){
    this.graphicResults = [regions,domi,red];
    return this.graphicResults;

  },
  getResultsGraphic: function(){
    return this.graphicResults;
  }
};

var graphicResults2 = {
  setResultsGraphic2: function(regions,domi,red){
    this.graphicResults2 = [regions,domi,red];
    return this.graphicResults2;
  },
  getResultsGraphic2: function(){
    return this.graphicResults2;
  }
}

var graphicResults3 = {
  setResultsGraphic3: function(categories,data){
    this.graphicResults3 = [categories,data];
    return this.graphicResults3;
  },
  getResultsGraphic3: function(){
    return this.graphicResults3;
  }
}

function makeStackedGraphic(categories, dataDOM, dataRED, divName, xTitle, textTitle){
  Highcharts.setOptions({
    chart: {
        style: {
            fontFamily: 'arial'
        }
    }
  });

      Highcharts.chart(divName, {
          chart: {
              type: 'bar'
          },
          title: {
              text: textTitle
          },
          xAxis: {
              categories: categories
          },
          yAxis: {
              min: 0,
              title: {
                  text: xTitle,
                  align: 'high',
              },
              labels: {
                  overflow: 'justify'
              },
              stackLabels: {

                  enabled: true,
                  style: {
                      fontWeight: 'bold',
                      color:'black'
                  }
              }
          },
          legend: {
              reversed: true
          },
          plotOptions: {
              series: {
                  stacking: 'normal'
              }
          },
          series: [{
              name: 'DOM',
              data: dataRED
          }, {
              name: 'RED',
              data: dataDOM
          }]
      });


  /*
  $("#"+divName).highcharts({
    chart: {
            type: 'bar'
        },
        title: {
            text: textTitle
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0,
            title: {
                text: xTitle,
                align: 'high',
            },
            labels: {
                overflow: 'justify'
            },
            stackLabels: {

                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color:'black'
                }
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'DOM',
            data: dataRED
        }, {
            name: 'RED',
            data: dataDOM
        }]
    });
    */
}

function makeBarsGraphic(categories, data, divName, xTitle, seriesLabel, textTitle){
    Highcharts.setOptions({
    chart: {
        style: {
            fontFamily: 'arial'
        }
    }
  });

  Highcharts.chart(divName, {
      chart: {
          type: 'bar'
      },
      title: {
          text: textTitle,
          fontSize: '9px'
      },
      xAxis: {
          categories: categories,
          labels: {
                style: {
                    fontSize:'9px'
                }
            }
      },
      yAxis: {
          min: 0,
          title: {
              text: xTitle,
              align: 'high',
          },
          labels: {
              overflow: 'justify'
          },
          stackLabels: {

              enabled: true,
              style: {
                  fontWeight: 'bold',
                  color:'black'
              }
          }
      },
      legend: {
          reversed: true
      },
      plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
      },
      series: [{
        name: seriesLabel,
        data: data
      }],
      exporting: {
          enabled: true
      }

  });

  /*
  $("#"+divName).highcharts({
      chart: {
          type: 'bar'
      },
      title: {
          text: textTitle,
          fontSize: '9px'
      },
      xAxis: {
          categories: categories,
          labels: {
                style: {
                    fontSize:'9px'
                }
            }
      },
      yAxis: {
          min: 0,
          title: {
              text: xTitle,
              align: 'high'
          },
          labels: {
              overflow: 'justify'
          }
      },
      tooltip: {
          valueSuffix: ' '
      },
      plotOptions: {
          bar: {
              dataLabels: {
                  enabled: true
              }
          }
      },
      /*legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
          shadow: true
      },*/
      /*      credits: {
          enabled: false
      },
      series: [{
          name: seriesLabel,
          data: data
      }],
      exporting: {
          enabled: true
      }
    });
    */
}

function getStatisticsSummaryChilquinta(callback){

  var qTaskkResumenChilquinta = new QueryTask(layers.read_qtty_comuna());
    var qResumenChilquinta = new esri.tasks.Query();
    qResumenChilquinta.where = "1=1";
    qResumenChilquinta.returnGeometry = false;
    qResumenChilquinta.outFields=["*"];


    qTaskkResumenChilquinta.execute(qResumenChilquinta, (featureSet)=>{
      var reg = featureSet.features.map((region)=>{
        return region.attributes.nm_comuna;
      });
      var qttyDOM = featureSet.features.map((q)=>{
        return q.attributes.DOM;
      });
      var qttyRED = featureSet.features.map((q)=>{
        return q.attributes.RED;
      });
        var sav = graphicResults.setResultsGraphic1(reg,qttyDOM,qttyRED);

        let valuesPerGraphic = {
          reg:reg,
          qttyRED: qttyRED,
          qttyDOM: qttyDOM,
          title1: "Cant. Clientes (u)",
          title2: "Interrupciones por comuna."
        }

        return callback(valuesPerGraphic);

    }, (Errorq)=>{
        console.log("Error doing query for regions quantity chilquinta");
        return callback(false);
    });

  /*
  var getQtty = createQueryTask({
    url: layers.read_qtty_comuna(),
    whereClause: "1=1",
    returnGeometry: false
  });

  getQtty((map,featureSet)=>{
      var reg = featureSet.features.map((region)=>{
        return region.attributes.nm_comuna;
      });
      var qttyDOM = featureSet.features.map((q)=>{
        return q.attributes.DOM;
      });
      var qttyRED = featureSet.features.map((q)=>{
        return q.attributes.RED;
      });
        var sav = graphicResults.setResultsGraphic1(reg,qttyDOM,qttyRED);

        let valuesPerGraphic = {
          reg:reg,
          qttyRED: qttyRED,
          qttyDOM: qttyDOM,
          title1: "Cant. Clientes (u)",
          title2: "Interrupciones por comuna."
        }
        return callbackk(valuesPerGraphic);
      //makeBarsGraphic(reg, qtty, "container1", "Cant. Clientes (u)", "Cant. Clientes", "Interrupciones por comuna.")



  },(errorQtty)=>{
    console.log("Error doing query for regions quantity chilquinta");
  });
  */
}

function getStatisticPerOfficeChilquinta(callback){
  var office=[]
  var qtty=[];
  /*
  var getoffice = createQueryTask({
    url: layers.read_qtty_office(),
    whereClause: "1=1",
    returnGeometry: false
  });

  getoffice((map,featureSet)=>{
      var offices = featureSet.features.map((office)=>{
        return office.attributes.oficina;
      });
      var qttyDOM = featureSet.features.map((q)=>{
        return q.attributes.DOM;
      });
      var qttyRED = featureSet.features.map((q)=>{
        return q.attributes.RED;
      });
      let sav = graphicResults2.setResultsGraphic2(offices,qttyDOM,qttyRED);
      //makeBarsGraphic(office, qtty, "container2", "Cant. Clientes (u)", "Cant. Clientes", "Interrupciones por oficina.");
    //  makeStackedGraphic(offices, qttyRED, qttyDOM, "containerChilquinta2", "Cant. Clientes (u)", "Interrupciones por Oficina.");


    },(errorQtty)=>{
    console.log("Error doing query for office quantity chilquinta");

    });
    */

    var qTaskOfficeChilquinta = new QueryTask(layers.read_qtty_office());
      var qOfficeChilquinta = new esri.tasks.Query();
      qOfficeChilquinta.where = "1=1";
      qOfficeChilquinta.returnGeometry = false;
      qOfficeChilquinta.outFields=["*"];


      qTaskOfficeChilquinta.execute(qOfficeChilquinta, (featureSet)=>{
        var offices = featureSet.features.map((office)=>{
          return office.attributes.oficina;
        });
        var qttyDOM = featureSet.features.map((q)=>{
          return q.attributes.DOM;
        });
        var qttyRED = featureSet.features.map((q)=>{
          return q.attributes.RED;
        });
        let sav = graphicResults2.setResultsGraphic2(offices,qttyDOM,qttyRED);

          let valuesPerGraphic = {
            offices :offices,
            qttyRED: qttyRED,
            qttyDOM: qttyDOM,
            title1: "Cant. Clientes (u)",
            title2: "Interrupciones por Oficina."
          }

          return callback(valuesPerGraphic);

      }, (Errorq)=>{
          console.log("Error doing query for regions quantity chilquinta");
          return callback(false);
      });
}

function getStatisticsRegionPercentChilquinta(callback){
  /*TO Do: obtain the last update for customers affected by any interruption in regions.
  and then calculate the percentaje */

  //Getting the last values by customers affected by interruptions in each region and the total amount of customers.
  var getQtty = createQueryTask({
    url: layers.read_qtty_comuna(),
    whereClause: "1=1",
    returnGeometry: false
  });

  getQtty((map,featureSet)=>{
    var region_qtty_now = featureSet.features.map((region)=>{
      let reg_qtty = {
        comuna: region.attributes.nm_comuna,
        cantidad: region.attributes.DOM + region.attributes.RED
      }
      return reg_qtty;
    });

   getRegionTotal(region_qtty_now, (cbRegion, cbRegion2)=>{
      return callback(cbRegion, cbRegion2);
   });
  },(errorQtty)=>{
    console.log("Error trying to get the qtty now for calculating region percent");
    return callback(false);
  });

}

function getRegionTotal(nowAffected, callback){
  //Getting the total customers that lives in each region.
  var getRegionsTotalQtty = createQueryTask({
    url: layers.read_qtty_total_comuna(),
    whereClause: "1=1",
    returnGeometry: false
  });

  getRegionsTotalQtty((map,featureSet)=>{
      var region_qtty = featureSet.features.map((region)=>{
        let region_totalqtty = {
          comuna: region.attributes['nm_comuna'],
          cantidad: region.attributes['Total']
        };
        return region_totalqtty;
      });
      calculatePercentaje(region_qtty,nowAffected, (cb, cb2)=>{

        return callback(cb, cb2);
      });
  },(errorQtty)=>{
    console.log("Error doing query for regions quantity");
  });
}

function calculatePercentaje(totalObj, affectedObj, callback){

  /*Search if affected is in total objects*/
  var t = Array.from(totalObj);
  var a = Array.from(affectedObj);
  var r = [];
  var p = [];

  var afectados ={
      comunasAfectadas: a.map((res)=>{return res.comuna}),
      clientesAfectados: a.map((res)=>{return res.cantidad})
  };

  var totalClientesComuna = {
    comunas: t.map((res)=>{return res.comuna}),
    totalClientes: t.map((res)=>{return res.cantidad})
  };

  afectados['comunasAfectadas'].forEach((afectada, index)=>{
      var a = totalClientesComuna['comunas'].indexOf(afectada);
      r.push({
        comuna: totalClientesComuna['comunas'][a],
        totalClientes: totalClientesComuna['totalClientes'][a],
        clientesAfectados: afectados['clientesAfectados'][index],
        porcentajeAfectados: ((afectados['clientesAfectados'][index]*100)/totalClientesComuna['totalClientes'][a]).toFixed(1)
      });

  });

  var cat = r.map((res)=>{return res.comuna});
  var dat = r.map((res)=>{return parseFloat(res.porcentajeAfectados)});

  let sav = graphicResults3.setResultsGraphic3(cat, dat);
  //makeBarsGraphic(cat, dat, "containerChilquinta3", "% Clientes", "% Clientes", "Interrupciones por comuna.");
  return callback(cat,dat);
}

export {makeStackedGraphic,
        makeBarsGraphic,
        getStatisticsSummaryChilquinta,
        getStatisticPerOfficeChilquinta,
        getStatisticsRegionPercentChilquinta,
        graphicResults,
        graphicResults2,
        graphicResults3};

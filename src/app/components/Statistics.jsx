import React from 'react';
import {browserHistory} from 'react-router';
//import ReactTabs from 'react-tabs';
import {Tab, Tabs} from 'react-toolbox';
import {getStatisticsSummaryChilquinta, getStatisticPerOfficeChilquinta, getStatisticsRegionPercentChilquinta} from '../services/graphics-service';
import {makeStackedGraphic, makeBarsGraphic} from '../services//graphics-service';
import {getStatisticsRegionPercent} from '../services/graphics-service';
import exportGraphicsToPDF from '../utils/exportToPDF';
import {Button, IconButton} from 'react-toolbox/lib/button';
import autoTable from 'jspdf-autotable';

class Statistics extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        index: 0,
        indexChilquinta: 0,
        indexLitoral: 0,
        indexParral: 0,
        indexLinares: 0,
        indexCasablanca: 0

    }

  }
  componentDidMount(){
    getStatisticsSummaryChilquinta(cb=>{
      if(cb!=false){
        makeStackedGraphic(cb.reg, cb.qttyRED, cb.qttyDOM, "containerChilquinta1", "Cant. Clientes (u)", "Interrupciones por comuna.");
      }
    });

    getStatisticPerOfficeChilquinta(cb=>{});
    getStatisticsRegionPercentChilquinta(cb=>{});

  }

  //pestañas principales para filiales
  handleTabChange = (index) => {
    console.log("index",index);
    this.setState({index});
    switch (index) {
      case 0:
          console.log("chilquinta");
          this.setState({indexChilquinta: 0});
          getStatisticsSummaryChilquinta(cb=>{
             if(cb!=false){
              makeStackedGraphic(cb.reg, cb.qttyRED, cb.qttyDOM, "containerChilquinta1", "Cant. Clientes (u)", "Interrupciones por comuna.");
            }
          });
      break;
      case 1:
          console.log("Litoral");
      break;
      case 2:
          console.log("linares");
      break;
      case 3:
          console.log("parral");
      break;
      case 4:
          console.log("casablanca");
      break;
      default:

    }
  };

  //subpestañas de chilquinta
  handleTabChangeChilquinta = (indexChilquinta) => {

    this.setState({indexChilquinta});
    switch (indexChilquinta) {
      case 0:
      getStatisticsSummaryChilquinta(cb=>{
        if(cb!=false){
          makeStackedGraphic(cb.reg, cb.qttyRED, cb.qttyDOM, "containerChilquinta1", "Cant. Clientes (u)", "Interrupciones por comuna.");
        }
      });

      break;
      case 1:
        getStatisticPerOfficeChilquinta(cb=>{
          if(cb!=false){
            makeStackedGraphic(cb.offices, cb.qttyRED, cb.qttyDOM, "containerChilquinta2", "Cant. Clientes (u)", "Interrupciones por Oficina.");
          }
        });
      break;
      case 2:
        getStatisticsRegionPercentChilquinta((cb,cb2)=>{

          if(cb!=false){
            makeBarsGraphic(cb,cb2, "containerChilquinta3", "% Clientes", "% Clientes", "Interrupciones por comuna.");
          }
        });
      break;

      default:

    }
  };

  handleTabChangeLitoral = (indexLitoral) => {

    this.setState({indexLitoral});
    switch (indexLitoral) {
      case 0:

      break;
      case 1:

      break;
      case 2:

      break;

      default:

    }
  };

  handleTabChangeLinares = (indexLinares) => {

    this.setState({indexLinares});
    switch (indexLinares) {
      case 0:

      break;
      case 1:

      break;
      case 2:

      break;

      default:

    }
  };

  handleTabChangeParral = (indexParral) => {

    this.setState({indexParral});
    switch (indexParral) {
      case 0:

      break;
      case 1:

      break;
      case 2:

      break;

      default:

    }
  };

  handleTabChangeCasablanca = (indexCasablanca) => {

    this.setState({indexCasablanca});
    switch (indexCasablanca) {
      case 0:

      break;
      case 1:

      break;
      case 2:

      break;

      default:

    }
  };

  onClickExportChilquinta(e){
      exportGraphicsToPDF();
    }

  render(){
    return (
        <div className="estatisticas_wrapper_content">
          <h3 className="estadisticas_title_h3">ESTADÍSTICAS</h3>
          <section>
            <Tabs index={this.state.index} onChange={this.handleTabChange}>

              <Tab label='Chilquinta' className="estadisticas_mainTab_title">
                <div className="wrapper_estadisticas_opciones">
                <small>Seleccione una opción a visualizar</small>
                <Button icon='file_download' label='Exportar' accent  onClick={this.onClickExportChilquinta.bind(this)}/>
                </div>
                  <Tabs index={this.state.indexChilquinta} onChange={this.handleTabChangeChilquinta}>

                    <Tab label='Por Comuna'>
                        <div id="containerChilquinta1" className="statistics-summary__chart"></div>

                    </Tab>
                    <Tab label='Por Oficina'>
                        <div id="containerChilquinta2" className="statistics-summary__chart"></div>

                    </Tab>
                    <Tab label='% Por Comuna'>
                        <div id="containerChilquinta3" className="statistics-summary__chart"></div>

                    </Tab>

                  </Tabs>


              </Tab>

              <Tab label='Litoral' className="estadisticas_mainTab_title">
                <small>Seleccione una opción a visualizar</small>
                  <Tabs index={this.state.indexLitoral} onChange={this.handleTabChangeLitoral}>
                    <Tab label='Por Comuna'>
                        <div id="containerLitoral1" className="statistics-summary__chart"></div>
                        <h5>No definido aún</h5>
                    </Tab>
                    <Tab label='Por Oficina'>
                        <div id="containerLitoral2" className="statistics-summary__chart"></div>
                        <h5>No definido aún</h5>
                    </Tab>
                    <Tab label='% Por Comuna'>
                        <div id="containerLitoral3" className="statistics-summary__chart"></div>
                        <h5>No definido aún</h5>
                    </Tab>
                  </Tabs>
              </Tab>

              <Tab label='Linares' className="estadisticas_mainTab_title">
              <small>Seleccione una opción a visualizar</small>
                <Tabs index={this.state.indexLinares} onChange={this.handleTabChangeLinares}>
                  <Tab label='Por Comuna'>
                      <div id="containerLinares1" className="statistics-summary__chart"></div>
                      <h5>No definido aún</h5>
                  </Tab>
                  <Tab label='Por Oficina'>
                      <div id="containerLinares2" className="statistics-summary__chart"></div>
                      <h5>No definido aún</h5>
                  </Tab>
                  <Tab label='% Por Comuna'>
                      <div id="containerLinares3" className="statistics-summary__chart"></div>
                      <h5>No definido aún</h5>
                  </Tab>
                </Tabs>
              </Tab>

              <Tab label='Parral' className="estadisticas_mainTab_title">
              <small>Seleccione una opción a visualizar</small>
                <Tabs index={this.state.indexParral} onChange={this.handleTabChangeParral}>
                  <Tab label='Por Comuna'>
                      <div id="containerParral1" className="statistics-summary__chart"></div>
                      <h5>No definido aún</h5>
                  </Tab>
                  <Tab label='Por Oficina'>
                      <div id="containerParral2" className="statistics-summary__chart"></div>
                      <h5>No definido aún</h5>
                  </Tab>
                  <Tab label='% Por Comuna'>
                      <div id="containerParral3" className="statistics-summary__chart"></div>
                      <h5>No definido aún</h5>
                  </Tab>
                </Tabs>
              </Tab>

              <Tab label='Casablanca' className="estadisticas_mainTab_title">
              <small>Seleccione una opción a visualizar</small>
                <Tabs index={this.state.indexCasablanca} onChange={this.handleTabChangeCasablanca}>
                  <Tab label='Por Comuna'>
                      <div id="containerCasablanca1" className="statistics-summary__chart"></div>
                      <h5>No definido aún</h5>
                  </Tab>
                  <Tab label='Por Oficina'>
                      <div id="containerCasablanca2" className="statistics-summary__chart"></div>
                      <h5>No definido aún</h5>
                  </Tab>
                  <Tab label='% Por Comuna'>
                      <div id="containerCasablanca3" className="statistics-summary__chart"></div>
                      <h5>No definido aún</h5>
                  </Tab>
                </Tabs>
              </Tab>
            </Tabs>

          </section>
        </div>

    );
  }
}

export default Statistics;

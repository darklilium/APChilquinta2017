import React from 'react';
import {Router, Route, browserHistory} from "react-router";


class HomeLayout extends React.Component {
  constructor(props){
    super(props);
  }


  render(){
    return (
      <div className="container">
        {this.props.children}
      </div>

    );
  }
}

export default HomeLayout;

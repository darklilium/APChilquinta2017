import React from 'react';

export class MainLayout extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="rowContent">
          {this.props.children}
        </div>
      </div>

    );

  }
}

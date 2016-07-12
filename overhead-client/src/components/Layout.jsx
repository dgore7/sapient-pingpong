import React from 'react';


export default class Layout extends React.Component{
  componentWillMount(){
    // super();
  }
  render() {
    return (
    <div className="quad-group">
      <div className="left-quads">
        <div id="quad1"></div>
        <div id="quad2"></div>
      </div>
      <div className="right-quads">
        <div id="quad3"></div>
        <div id="quad4"></div>
      </div>
      <div id="ball"></div>
    </div>);
  }
}

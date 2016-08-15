import React from 'react';

export default class Background extends React.Component {
  render() {
    return (<div id="background-table" className="container">
        <div className="col s6">
          <div className="row"></div>
          <div className="row"></div>
        </div>
        <div className="col s6">
          <div className="row"></div>
          <div className="row"></div>
        </div>
        <div id="reset-btn-container">
          <button
              id="reset-btn"
              className="waves-effect waves-light btn"
              onClick={this.props.resetGame.bind(this)}>
            Reset
          </button>
        </div>
      </div>

    );
  }
}

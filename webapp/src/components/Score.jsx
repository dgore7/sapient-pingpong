import React from 'react';

export default class Score extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div className="score">
        <h1>{this.props.score>9?this.props.score: "0" + this.props.score}</h1>
      </div>
    );
  }
}

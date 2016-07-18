import React from 'react';

export default class Score extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div>
        <h1>{this.props.score}</h1>
      </div>
    );
  }
}

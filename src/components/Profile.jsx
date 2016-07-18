import React from 'react';

export default class Profile extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div>
        <img src={this.props.picURL}/>
        <h2>{this.props.name}</h2>
      </div>
    );
  }
}

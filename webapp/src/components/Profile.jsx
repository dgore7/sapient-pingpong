import React from 'react';

export default class Profile extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div className="profile-div">
        <img src={this.props.picURL}/>
        <h5 id={'user-name' + this.props.player}>{this.props.user.name}</h5>
      </div>
    );
  }
}

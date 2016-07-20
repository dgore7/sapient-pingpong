import React from 'react';
import Profile from './Profile';
import Score from './Score';

export default class Player extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div id={this.props.player} className={"col s4 offset-" + this.props.offset}>
        <div className="card center-align z-depth-5">
          {/*<Profile
          className="profile-div"
          name={this.props.name}
          picURL={this.props.picURL}/>*/}
          <Score
          className="score-div"
          score={this.props.score}/>
          <button
                className="take-back-point waves-effect waves-light btn"
                id={this.props.player}
                onClick={this.props.decrementScore}>
              Take Back
          </button>
        </div>
      </div>
    );
  }
}

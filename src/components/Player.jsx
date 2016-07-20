import React from 'react';
import Profile from './Profile';
import Score from './Score';

export default class Player extends React.Component {
  constructor(props){
    super(props);
  }

  onTakeBackClick(e) {
    var player = (e.target.id == "player1") ? 1 : 2;
    this.props.decrementScore(player);
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
                onClick={this.onTakeBackClick.bind(this)}>
              Take Back
          </button>
        </div>
      </div>
    );
  }
}

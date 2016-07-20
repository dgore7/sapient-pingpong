import React from 'react';
import Profile from './Profile';
import Score from './Score';

export default class Player extends React.Component {
  constructor(props){
    super(props);
    this.style ={}
  }

  checkWinner() {
    switch (this.props.winner) {
      case 1:
        if(this.props.player==="player2"){
          this.style = {backgroundColor: grey}
        }else {
          return(<h1>WINNER</h1>);
        }
        break;
      case 2:
        if (this.props.player==="player1") {
          this.style = {backgroundColor: grey}
        } else {
          return(<h1>WINNER</h1>);
        }
        break;
      default:
        this.style = {};
        break;
    }
  onTakeBackClick(e) {
    var player = (e.target.id == "player1") ? 1 : 2;
    this.props.decrementScore(player);
  }

  render() {
    return (
      <div id={this.props.player} className={"col s4 offset-" + this.props.offset}>
        <div style={this.style} className="card center-align z-depth-5">
          {this.checkWinner()}
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

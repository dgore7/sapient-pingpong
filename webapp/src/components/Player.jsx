import React from 'react';
import Profile from './Profile';
import Score from './Score';

export default class Player extends React.Component {
  constructor(props){
    super(props);
    this.state = {style:{}}
  }

  checkWinner() {
    console.log(this.props.user)
    switch (this.props.winner) {
      case "player1":
        if(this.props.player==="player1"){
          return(<h3>WINNER</h3>);
        }
        break;
      case "player2":
        if (this.props.player==="player2") {
          return(<h3>WINNER</h3>);
        }
        break;
    }
  }

  isServer() {
    return this.props.server===this.props.player
  }

  onTakeBackClick(e) {
    var player = (e.target.id == "player1") ? 1 : 2;
    this.props.decrementScore(player);
  }

  styleCard() {
    var res = {}
    if (this.props.user.name) {
      Object.assign(res, {paddingTop:"4%"})
    }
    if (this.props.winner === this.props.player) {
      Object.assign(res, {backgroundColor:"#22CC22"})
    } else if (this.props.winner) {
      Object.assign(res, {opacity: 0.5,paddingTop: 115})
    }
    return res;
  }


  render() {
    return (
      <div id={this.props.player} className={"col s4 offset-" + this.props.offset}>
        <div
            style={this.styleCard()}
            className="card center-align z-depth-5">
          {this.checkWinner()}
          <div id="serving-marker">{this.isServer()?<img src="assets/ping-pong-red.png" alt="serving marker" height="42" width="42"/>:""}</div>
          <Profile
            player={this.props.player}
            className="profile-div"
            user={this.props.user}
            picURL={this.props.picURL}/>
          <Score
          className="score-div"
          score={this.props.score}/>
          {this.props.winner?
            "":
            <button
            className="take-back-point waves-effect waves-light btn"
            id={this.props.player}
            onClick={this.onTakeBackClick.bind(this)}>
            Take Back
            </button>
          }
        </div>
      </div>
    );
  }
}

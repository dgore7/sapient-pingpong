import React from 'react';
import Profile from './Profile';
import Score from './Score';

export default class Player extends React.Component {
  constructor(props){
    super(props);
    this.state = {style:{}}
  }

  checkWinner() {
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
  onTakeBackClick(e) {
    var player = (e.target.id == "player1") ? 1 : 2;
    this.props.decrementScore(player);
  }

  render() {
    return (
      <div id={this.props.player} className={"col s4 offset-" + this.props.offset}>
        <div
            style={this.props.winner===this.props.player?
              {backgroundColor: "#22CC22"}:
              this.props.winner?
                {opacity: 0.5,paddingTop: 115}:
                {}}
            className="card center-align z-depth-5">
          {this.checkWinner()}
          {/*{this.checkWinner()}*/}
          {/*<Profile
          className="profile-div"
          name={this.props.name}
          picURL={this.props.picURL}/>*/}
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

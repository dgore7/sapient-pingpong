import React from 'react';
import Profile from './Profile';
import Score from './Score';
// var Pusher = require('pusher-js');


export default class Layout extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      playerOneScore: 0,
      playerTwoScore: 0
    };
  }

  isNewGame() {
    if (this.state.playerOneScore == 0 && this.state.playerTwoScore == 0) {
      return true;
    } else {
      return false;
    }

  }

  componentWillMount() {
    this.pusher = new Pusher('7478bf1c2d89d2efb9b0', {
      cluster: 'eu',
      encrypted:true
    });
    this.scoreBoard = this.pusher.subscribe('scoreboard') // change variable name
  }

  componentDidMount() {
    //Pusher.logToConsole = true;
    this.scoreBoard.bind('update-score', (message) => {
      switch (message.action) {
        case 'increment-score':
          console.log(message.player);
          message.player===1?
            this.setState({playerOneScore: this.state.playerOneScore+1}):
            this.setState({playerTwoScore: this.state.playerTwoScore+1});
          break;
        case 'decrement-score':
          message.player===1?
            this.setState({playerOneScore: this.state.playerOneScore-1}):
            this.setState({playerTwoScore: this.state.playerTwoScore-1});
          break;
        case 'end-game':
          this.setState({playerOneScore: 0, playerTwoScore: 0})
          break;
      }
      if (this.state.playerOneScore>=21 && this.state.playerTwoScore+2 <= this.state.playerOneScore) {
        alert("Django wins!");
        this.setState({playerTwoScore: 0, playerOneScore: 0});
      } else if (this.state.playerTwoScore>=21 && this.state.playerOneScore+2 <= this.state.playerTwoScore) {
        alert("Whiskers wins!");
        this.setState({playerTwoScore: 0, playerOneScore: 0});
      }
    });
  }

  render() {
    return (
    <div className="quad-group">
      <div className="left-quads">
        <div id="quad1">
          <Profile
            name="Django"
            picURL="http://placekitten.com/g/225/225"/>
        </div>
        <div id="quad2">
          <Score score={this.state.playerOneScore}/>
        </div>
      </div>
      <div className="right-quads">
        <div id="quad3">
          <Profile
            name="Whiskers"
            picURL="http://placekitten.com/225/225"/>
        </div>
        <div id="quad4">
          <Score score={this.state.playerTwoScore}/>
        </div>
      </div>
      {this.isNewGame()?<div id="ball"></div>:<div></div>}
    </div>);
  }
}

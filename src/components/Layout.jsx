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

  componentWillMount() {
    this.pusher = new Pusher('7478bf1c2d89d2efb9b0', {
      cluster: 'eu',
      encrypted:true
    });
    this.scoreBoard = this.pusher.subscribe('scoreboard') // change variable name
  }

  componentDidMount() {
    Pusher.logToConsole = true;
    this.scoreBoard.bind('update-score', (message) => {
      switch (message.clickType) {
        case 'single':
          message.button==="playerOne"?
            this.setState({playerOneScore: this.state.playerOneScore+1}):
            this.setState({playerTwoScore: this.state.playerTwoScore+1});
          break;
        case 'double':
          message.button==="playerOne"?
            this.setState({playerOneScore: this.state.playerOneScore-1}):
            this.setState({playerTwoScore: this.state.playerTwoScore-1});
          break;
        case 'hold':
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
            picURL="http://placekitten.com/g/250/250"/>
        </div>
        <div id="quad2">
          <Score score={this.state.playerOneScore}/>
        </div>
      </div>
      <div className="right-quads">
        <div id="quad3">
          <Profile
            name="Whiskers"
            picURL="http://placekitten.com/250/250"/>
        </div>
        <div id="quad4">
          <Score score={this.state.playerTwoScore}/>
        </div>
      </div>
      <div id="ball"></div>
    </div>);
  }
}

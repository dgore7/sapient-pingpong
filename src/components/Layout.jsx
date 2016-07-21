import React from 'react';
import Player from './Player';
import Background from './Background';

export default class Layout extends React.Component{
  constructor(props) {
    super(props);

    // Configure game state
    this.state = {
      playerOneScore: 0,
      playerTwoScore: 0,
      winner: null,
      server: null
    };

    // Configure Pusher
    this.pusher = new Pusher('7478bf1c2d89d2efb9b0', {
      cluster: 'eu',
      encrypted:true
    });
    this.scoreBoard = this.pusher.subscribe('scoreboard') // change variable name
  }

  isNewGame() {
      return this.state.playerOneScore == 0 && this.state.playerTwoScore == 0;
  }

  setServer(player) {
    this.setState({server: "player" + player});
  }

  shouldToggleServer() {
    return this.state.server != null &&
      (this.state.playerOneScore != 0 || this.state.playerTwoScore != 0) &&
      ((this.state.playerOneScore + this.state.playerTwoScore) % 5 === 0);
  }

  incrementScore(player) {
    switch (player) {
      case 1:
        this.setState({playerOneScore: this.state.playerOneScore+1});
        break;
      case 2:
        this.setState({playerTwoScore: this.state.playerTwoScore+1});
        break;
    }
    var nextServer = this.state.server==="player1"?"2":"1";
    if (this.shouldToggleServer()) {
      this.setServer(nextServer);
    }
  }

  decrementScore(player) {
    var nextServer = this.state.server==="player1"?"2":"1";
    if (this.shouldToggleServer() &&
        ((this.state.playerOneScore > 0 && player == 1) || (this.state.playerTwoScore > 0 && player == 2))) {
      this.setServer(nextServer);
    }

    switch (player) {
      case 1:
        if (this.state.playerOneScore > 0) {
          this.setState({playerOneScore: this.state.playerOneScore-1});
        }
        break;
      case 2:
        if (this.state.playerTwoScore > 0) {
          this.setState({playerTwoScore: this.state.playerTwoScore-1});
        }
        break;
    }
  }

  resetGame() {
    this.setState({playerTwoScore: 0, playerOneScore: 0, server: null, winner: null});
  }

  componentDidMount() {
    this.scoreBoard.bind('update-score', (message) => {
      switch (message.clickType) {
        case 'single':
          this.incrementScore(message.button);
          break;
        case 'double':
          this.resetGame();
          break;
        case 'hold':
          this.state.playerOneScore || this.state.playerTwoScore?
            this.decrementScore(message.button):
            this.setServer(message.button);
            console.log(this.state.server);
          break;
        case 'set-score':
          message.button===1 ?
            this.setState({playerOneScore: message.score}) :
            this.setState({playerTwoScore: message.score});
          break;
      }

      if (this.state.playerOneScore>=21 && this.state.playerTwoScore+2 <= this.state.playerOneScore) {
        this.setState({winner:"player1"});
        setTimeout(() =>{
          this.setState({winner:null,server:null});
          this.resetGame();
        },5000)
      } else if (this.state.playerTwoScore>=21 && this.state.playerOneScore+2 <= this.state.playerTwoScore) {
        this.setState({winner:"player2"});
        setTimeout(() =>{
          this.setState({winner:null, server:null});
          this.resetGame();
        },5000)
      }
    });
  }



  render() {
    return (
      <div className="row">
        <Player
          server={this.state.server}
          winner={this.state.winner}
          offset="s1"
          player="player1"
          name="Django"
          picURL="http://placekitten.com/g/225/225"
          decrementScore={this.decrementScore.bind(this)}
          score={this.state.playerOneScore} />
        <div className="col s2"></div>
        <Player
          winner={this.state.winner}
          server={this.state.server}
          offset="s2"
          player="player2"
          className="player2"
          name="Whiskers"
          picURL="http://placekitten.com/225/225"
          decrementScore={this.decrementScore.bind(this)}
          score={this.state.playerTwoScore} />
        <div id={this.isNewGame()?"ball":""}></div>
        <Background resetGame={this.resetGame.bind(this)}/>
      </div>
    );
  }
}

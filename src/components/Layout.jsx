import React from 'react';
import Player from './Player';
import Background from './Background';

const defaults = {
  playerOneScore: 0,
  playerTwoScore: 0,
  winner: null,
  server: null
};
const winTimeout = 5000;
const scoreToWin = 21;
const winBy2 = true;

export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    // Configure game state
    this.state = defaults;

    // Configure Pusher
    this.pusher = new Pusher('7478bf1c2d89d2efb9b0', {
      cluster: 'eu',
      encrypted: true
    });
    this.scoreBoard = this.pusher.subscribe('scoreboard') // change letiable name
  }

  /*
   * Checks whether the current score for both players is 0.
   */
  isNewGame() {
      return this.state.playerOneScore == 0 && this.state.playerTwoScore == 0;
  }

  /*
   * Marks a player as the server.
   */
  setServer(player) {
    this.setState({server: "player" + player});
  }

  // TODO: consider rename
  shouldToggleServer() {
    return this.state.server != null &&
      (this.state.playerOneScore != 0 || this.state.playerTwoScore != 0) &&
      ((this.state.playerOneScore + this.state.playerTwoScore) % 5 === 0);
  }

  incrementScore(player) {
    // Increment score
    switch (player) {
      case 1:
        this.setState({playerOneScore: this.state.playerOneScore + 1});
        break;
      case 2:
        this.setState({playerTwoScore: this.state.playerTwoScore + 1});
        break;
    }

    // Check if server should be changed and change server if needed
    let nextServer = this.state.server === "player1" ? "2" : "1";
    if (this.shouldToggleServer()) {
      this.setServer(nextServer);
    }
  }

  decrementScore(player) {
    // Check if server can/should be changed and change server if needed
    let nextServer = this.state.server === "player1" ? "2" : "1";
    let playerOneCanToggle = (player === 1 && this.state.playerOneScore > 0);
    let playerTwoCanToggle = (player === 2 && this.state.playerTwoScore > 0);
    if (this.shouldToggleServer() && (playerOneCanToggle || playerTwoCanToggle)) {
      this.setServer(nextServer);
    }

    // Decrement score
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

  /*
   * Resets the game to its default state.
   */
  resetGame() {
    this.setState(defaults);
  }

  onSingle(message) {
    this.incrementScore(message.button);
  }

  onDouble(message) {
    this.resetGame();
  }

  onHold(message) {
    (this.state.playerOneScore || this.state.playerTwoScore) ?
      this.decrementScore(message.button) :
      this.setServer(message.button);
  }

  onSetScore(message) {
    message.button === 1 ?
      this.setState({playerOneScore: message.score}) :
      this.setState({playerTwoScore: message.score});
  }

  checkWinner() {
    if (this.state.playerOneScore >= scoreToWin) {
      if (winBy2 && this.state.playerOneScore >= this.state.playerTwoScore + 2) {
        return { hasWinner: true, winner: "player1" };
      }
    } else if (this.state.playerTwoScore >= scoreToWin) {
      if (winBy2 && this.state.playerTwoScore >= this.state.playerOneScore + 2) {
        return { hasWinner: true, winner: "player2" };
      }
    }
    return { hasWinner: false };
  }

  componentDidMount() {
    this.scoreBoard.bind('update-score', (message) => {
      // Handle click types
      switch (message.clickType) {
        case 'single':
          this.onSingle(message);
          break;
        case 'double':
          this.onDouble(message);
          break;
        case 'hold':
          this.onHold(message);
          break;

        // Debug
        case 'set-score':
          this.onSetScore(message);
          break;
      }

      let winInfo = this.checkWinner();
      if (winInfo.hasWinner === true) {
        this.setState({winner: winInfo.winner});
        setTimeout(() => {
          this.resetGame();
        }, winTimeout);
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
          decrementScore={this.decrementScore.bind(this)}
          score={this.state.playerOneScore} />
        <div className="col s2"></div>
        <Player
          winner={this.state.winner}
          server={this.state.server}
          offset="s2"
          player="player2"
          className="player2"
          decrementScore={this.decrementScore.bind(this)}
          score={this.state.playerTwoScore} />
        <div id={this.isNewGame()?"ball":""}></div>
        <Background resetGame={this.resetGame.bind(this)}/>
      </div>
    );
  }
}

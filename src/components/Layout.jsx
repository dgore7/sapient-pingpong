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

    let debug = true;

    let timestamp = null;
    let duration = null;

    // Configure game state
    this.state = defaults;

    // Configure Pusher
    this.pusher = new Pusher('7478bf1c2d89d2efb9b0', {
      cluster: 'eu',
      encrypted: true
    });
    let pusherChannel = debug ? 'scoreboard-test' : 'scoreboard';
    this.scoreBoard = this.pusher.subscribe(pusherChannel) // change letiable name
  }

  /*
   * Checks whether the current score for both players is 0.
   */
  isNewGame() {
    return this.state.playerOneScore == 0 && this.state.playerTwoScore == 0;
  }

  isServerModeEnabled() {
    return this.state.server != null;
  }

  /*
   * Marks a player as the server.
   */
  setServer(player) {
    this.setState({server: "player" + player});
  }

  toggleServer() {
    if (!this.isServerModeEnabled() || this.isNewGame()) {
      return;
    }

    let toggleEvery5 = (this.state.playerOneScore < 20 || this.state.playerTwoScore < 20);
    let toggleEvery2 = (this.state.playerOneScore >= 20 && this.state.playerTwoScore >= 20);
    let nextServer = this.state.server === "player1" ? "2" : "1";

    if (this.state.playerOneScore == 20 && this.state.playerTwoScore < 20) {
      this.setServer(2);
      return;
    } else if (this.state.playerTwoScore == 20 && this.state.playerOneScore < 20) {
      this.setServer(1);
      return;
    }

    if (toggleEvery5 && (this.state.playerOneScore + this.state.playerTwoScore) % 5 === 0) {
      this.setServer(nextServer);
    } else if (toggleEvery2 && (this.state.playerOneScore + this.state.playerTwoScore) % 2 === 0) {
      this.setServer(nextServer);
    }
  }

  incrementScore(player) {
    // Increment score
    switch (player) {
      case 1:
        this.setState({ playerOneScore: this.state.playerOneScore + 1 });
        break;
      case 2:
        this.setState({ playerTwoScore: this.state.playerTwoScore + 1 });
        break;
    }

    if (this.state.playerOneScore + this.state.playerTwoScore === 1) {
      // A new game has started
      this.timestamp = Date.now();
    }

    this.toggleServer();
  }

  decrementScore(player) {
    this.toggleServer();

    // Decrement score
    switch (player) {
      case 1:
        if (this.state.playerOneScore > 0) {
          this.setState({playerOneScore: this.state.playerOneScore - 1});
        }
        break;
      case 2:
        if (this.state.playerTwoScore > 0) {
          this.setState({playerTwoScore: this.state.playerTwoScore - 1});
        }
        break;
    }
  }

  /*
   * Resets the game to its default state.
   */
  resetGame() {
    this.timestamp = null;
    this.duration = null;
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
    if (this.state.playerOneScore < scoreToWin || this.state.playerOneScore < scoreToWin) {
      return { hasWinner: false };
    }

    if (winBy2 && (this.state.playerOneScore >= this.state.playerTwoScore + 2)) {
      return { hasWinner: true, winner: "player1" };
    } else if (winBy2 && (this.state.playerTwoScore >= this.state.playerOneScore + 2)) {
      return { hasWinner: true, winner: "player2" };
    }

    return { hasWinner: false };
  }

  postGameStats() {
    let stats = {
      timestamp: this.timestamp,
      duration: this.duration,
      score: [this.state.playerOneScore, this.state.playerTwoScore]
    };

    // TODO: post stats to db
    console.log(JSON.stringify(stats));
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
        case 'reset':
          this.resetGame();
          break;
        case 'set-server':
          this.setServer(message.button);
          break;
      }

      let winInfo = this.checkWinner();
      if (winInfo.hasWinner === true) {
        this.duration = Date.now() - this.timestamp;
        if (!debug) {
          this.postGameStats();
        }
        this.setState({winner: winInfo.winner, server: null});
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

import React from 'react';
import Layout from './Layout';

const defaults = {
  playerOneScore: 0,
  playerTwoScore: 0,
  winner: null,
  server: null
};
const winTimeout = 5000;
const scoreToWin = 21;
const winBy2 = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    let debug = false;

    let timestamp = null;
    let duration = null;

    // Configure game state
    this.state = defaults;

    // Configure Pusher
    this.pusher = new Pusher('7478bf1c2d89d2efb9b0', {
      cluster: 'eu',
      encrypted: true
    });
    let pusherChannel = debug === true ? 'scoreboard-test' : 'scoreboard';
    this.scoreBoard = this.pusher.subscribe(pusherChannel);
  }

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
    if (this.state.playerOneScore < scoreToWin && this.state.playerTwoScore < scoreToWin) {
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
    console.log(JSON.stringify(stats, null, 2));
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
      console.log(winInfo);
      if (winInfo.hasWinner === true) {
        this.duration = Date.now() - this.timestamp;
        if (!this.debug) {
          this.postGameStats();
        }
        this.setState({winner: winInfo.winner, server: null});
        setTimeout(() => {
          this.resetGame();
        }, winTimeout);
      }

      console.log(this.state);
    });
  }

  render() {
    return (
      <Layout
        server={this.state.server}
        winner={this.state.winner}
        playerOneScore={this.state.playerOneScore}
        playerTwoScore={this.state.playerTwoScore}
        decrementScore={this.decrementScore.bind(this)}
        isNewGame={this.isNewGame.bind(this)}
        resetGame={this.resetGame.bind(this)} />
    );
  }
}

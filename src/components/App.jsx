import React from 'react';
import Layout from './Layout';

// Drefault game state
const defaults = {
  playerOneScore: 0,
  playerTwoScore: 0,
  winner: null,
  server: null
};

// Game and display rules
const winTimeout = 5000;
const scoreToWin = 21;
const winBy2 = true;

/*
 * Game Logic
 */
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

  /*
   * Checks whether this is a new game by checking if both players' scores are
   * zero.
   */
  isNewGame() {
    return this.state.playerOneScore == 0 && this.state.playerTwoScore == 0;
  }

  /*
   * Checks if the ping-pong server tracking icon should be shown.
   */
  isServerModeEnabled() {
    return this.state.server != null;
  }

  /*
   * Marks a player as the server.
   */
  setServer(player) {
    this.setState({server: "player" + player});
  }

  /*
   * Switches the server from one player to the other, but only if it is time
   * to do so.
   *
   * Servers are toggled/set based on the following rules:
   *    - Toggle every 5 points if both scores are less than 20
   *    - Toggle every 2 points if both scores are greater than 20
   *    - If one player is on game point, set the other player to be the server
   */
  toggleServer() {
    if (!this.isServerModeEnabled() || this.isNewGame()) {
      return;
    }

    // Check which server toggling mode to use
    let toggleEvery5 = (this.state.playerOneScore < 20 || this.state.playerTwoScore < 20);
    let toggleEvery2 = (this.state.playerOneScore >= 20 && this.state.playerTwoScore >= 20);

    // Check if a player is on game point
    if (this.state.playerOneScore == 20 && this.state.playerTwoScore < 20) {
      this.setServer(2);
      return;
    } else if (this.state.playerTwoScore == 20 && this.state.playerOneScore < 20) {
      this.setServer(1);
      return;
    }

    // Toggle server
    let nextServer = this.state.server === "player1" ? "2" : "1";

    // Set server based on points and toggle mode ('toggle every 5' or 'toggle every 2')
    if (toggleEvery5 && (this.state.playerOneScore + this.state.playerTwoScore) % 5 === 0) {
      this.setServer(nextServer);
    } else if (toggleEvery2 && (this.state.playerOneScore + this.state.playerTwoScore) % 2 === 0) {
      this.setServer(nextServer);
    }
  }

  /*
   * Adds 1 to a player's current score.
   */
  incrementScore(player) {
    switch (player) {
      case 1:
        this.setState({ playerOneScore: this.state.playerOneScore + 1 });
        break;
      case 2:
        this.setState({ playerTwoScore: this.state.playerTwoScore + 1 });
        break;
    }

    if (this.state.playerOneScore + this.state.playerTwoScore === 1) {
      // A new game has started; used for game stats
      this.timestamp = Date.now();
    }

    this.toggleServer();
  }

  /*
   * Subtracts 1 from a player's current score.
   */
  decrementScore(player) {
    this.toggleServer();

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

  // ===== BUTTON ACTION HANDLERS ===== //

  /*
   * Action to perform when a button is clicked once.
   */
  onSingle(message) {
    this.incrementScore(message.button);
  }

  /*
   * Action to perform when a button is double clicked.
   */
  onDouble(message) {
    this.resetGame();
  }

  /*
   * Action to perform when a button is held.
   */
  onHold(message) {
    if (this.state.playerOneScore != 0 || this.state.playerTwoScore != 0) {
      this.decrementScore(message.button);
    } else {
      this.setServer(message.button);
    }
  }

  // ===== END: BUTTON ACTION HANDLERS ===== //

  /*
   * Checks if the game has a winner.
   */
  checkWinner() {
    // Both scores under 21, no winner.
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

  /*
   * Posts game stats to the database.
   */
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
          message.button === 1 ?
            this.setState({playerOneScore: message.score}) :
            this.setState({playerTwoScore: message.score});
          break;
        case 'reset':
          this.resetGame();
          break;
        case 'set-server':
          this.setServer(message.button);
          break;
      }

      let winInfo = this.checkWinner();
      if (!winInfo.hasWinner) {
        return;
      }

      // Calculate game duration and post game stats.
      this.duration = Date.now() - this.timestamp;
      if (!this.debug) {
        this.postGameStats();
      }

      // Set winner and delay before game reset.
      this.setState({winner: winInfo.winner, server: null});
      setTimeout(() => {
        this.resetGame();
      }, winTimeout);
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

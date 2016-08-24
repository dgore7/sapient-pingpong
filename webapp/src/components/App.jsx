/*
 * MIT License
 *
 * Copyright (c) 2016 David Gorelik, Wes Hampson.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React from 'react';
import Layout from './Layout';
import axios from 'axios';


if (!String.prototype.trim) {
    (function() {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function() {
            return this.replace(rtrim, '');
        };
    })();
}


// Drefault game state
const defaults = {
  playerOneScore: 0,
  playerTwoScore: 0,
  userOne:{
    name: null,
    id: 0  // evaluates as falsey
  },
  userTwo:{
    name: null,
    id: 0  // evaluates as falsey
  },
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
export default class ScoreboardApp extends React.Component {
  constructor(props) {
    super(props);
    let debug = false;
    let timestamp = null;
    let duration = null;


    // Configure game state
    this.state = defaults;

    // Configure Pusher
    const pusher = new Pusher('3c2527d150d803fc2cd0', {
      cluster: 'eu',
      encrypted: true
    });

    let pusherChannel = debug === true ? 'scoreboard-test' : 'scoreboard';
    this.scoreBoard = pusher.subscribe(pusherChannel);
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

    if (this.timestamp == null) {
      // A new game has started; used for game stats
      this.timestamp = Date.now();
      console.log("timestamp created: " + this.timestamp);
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
    // Both scores under 21, no winner.,
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
   * Swap user cards
   */
  swapUser() {
    this.setState({userTwo:this.state.userOne, userOne:this.state.userTwo});
  }


  logoutUser(id) {
    if (this.state.userOne.id === id) {
      this.setState({userOne: {name: null, id: 0}});
    } else {
      this.setState({userTwo: {name: null, id: 0}});
    }
  }


  /*
   * Posts game stats to the database.
   */
  postGameStats() {
    let stats = {
      timestamp: this.timestamp,
      duration: this.duration,
      playerOne: {
        user_id: this.state.userOne.id,
        score: this.state.playerOneScore
      },
      playerTwo: {
        user_id: this.state.userTwo.id,
        score: this.state.playerTwoScore
      }
      // score: [this.state.playerOneScore, this.state.playerTwoScore]
    };
    axios.post('/api/games', stats)
      .catch((err) => {
        console.log(err);
      });
  }


  assignUser(name, id) {
    if(this.state.userOne.id && this.state.userTwo.id) {
      this.setState({userOne: {name:name, id:id}});
    } else if(this.state.userOne.id === id) {
      this.setState({userOne: this.state.userTwo, userTwo: {name:name, id:id}});
    } else if(this.state.userTwo.id === id) {
      this.setState({userTwo: this.state.userOne, userOne: {name:name, id:id}});
    } else {
      if (this.state.userOne.id) {
        this.setState({userTwo: {name:name, id:id}});
      } else {
        this.setState({userOne: {name:name, id:id}});
      }
    }
  }


  postWithRFID(e) {
    e.preventDefault();
    var playerName = $('#name');
    axios.post("api/user/register", {rfid:this.state.rfid, name:playerName.val()})
      .then((response) => {
        console.log(response)
        if (response.data) {
          this.assignUser(response.data.name, response.data._id);
        }
      })
      .catch(function (error) {
        alert(error);
      });
    playerName.val('');
  }


  componentDidMount() {
    this.scoreBoard.bind('user-sign-in', (data) => {
      console.log('made it to front end');
      // check if players are already in a game
      if (this.state.playerOneScore == 0 && this.state.playerTwoScore == 0) {
        if (data.err) alert(data.err);
        else if (data.userExists) {
          this.assignUser(data.user.name, data.user._id);
        } else {
          console.log(data);
          if(!data.rfid || String(data.rfid).length > 6) {
            alert("something went wrong");
          } else {
            this.setState({rfid:data.rfid});
            $('#modal1').openModal();
            $('#name').focus();
          }
        }
      }
    });

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
    console.log(this.scoreBoard);

  }


  render() {
    return (
      <Layout
        userOne={this.state.userOne}
        userTwo={this.state.userTwo}
        server={this.state.server}
        winner={this.state.winner}
        playerOneScore={this.state.playerOneScore}
        playerTwoScore={this.state.playerTwoScore}
        decrementScore={this.decrementScore.bind(this)}
        isNewGame={this.isNewGame.bind(this)}
        resetGame={this.resetGame.bind(this)}
        postWithRFID={this.postWithRFID.bind(this)}
        swapUser={this.swapUser.bind(this)}
        logoutUser={this.logoutUser.bind(this)}/>
    );
  }
}

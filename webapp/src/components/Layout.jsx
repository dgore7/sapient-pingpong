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
import Player from './Player';
import Background from './Background';
import Modal from './Modal';

export default class Layout extends React.Component {
  render() {
    return (
      <div className="row">
        <Player
          user={this.props.userOne}
          server={this.props.server}
          winner={this.props.winner}
          offset="s1"
          player="player1"
          decrementScore={this.props.decrementScore}
          swapUser={this.props.swapUser}
          logoutUser={this.props.logoutUser}
          updateUserName={this.props.updateUserName}
          score={this.props.playerOneScore} />
        <div className="col s2"></div>
        <Player
          user={this.props.userTwo}
          server={this.props.server}
          winner={this.props.winner}
          offset="s2"
          player="player2"
          className="player2"
          decrementScore={this.props.decrementScore}
          swapUser={this.props.swapUser}
          logoutUser={this.props.logoutUser}
          updateUserName={this.props.updateUserName}
          score={this.props.playerTwoScore} />
        <div id={this.props.isNewGame() ? "ball" : ""}></div>
        <Background resetGame={this.props.resetGame}/>
        <Modal formHandler={this.props.postWithRFID} idSuffix="post" user={undefined}/>
      </div>
    );
  }
}

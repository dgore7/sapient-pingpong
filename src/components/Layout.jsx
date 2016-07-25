import React from 'react';
import Player from './Player';
import Background from './Background';

export default class Layout extends React.Component {
  render() {
    return (
      <div className="row">
        <Player
          server={this.props.server}
          winner={this.props.winner}
          offset="s1"
          player="player1"
          decrementScore={this.props.decrementScore}
          score={this.props.playerOneScore} />
        <div className="col s2"></div>
        <Player
          server={this.props.server}
          winner={this.props.winner}
          offset="s2"
          player="player2"
          className="player2"
          decrementScore={this.props.decrementScore}
          score={this.props.playerTwoScore} />
        <div id={this.props.isNewGame() ? "ball" : ""}></div>
        <Background resetGame={this.props.resetGame}/>
      </div>
    );
  }
}

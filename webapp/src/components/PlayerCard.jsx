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
import Profile from './Profile';
import Score from './Score';
import Modal from './Modal';

export default class PlayerCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {style:{}}
  }

  checkWinner() {
    console.log(this.props.user)
    switch (this.props.winner) {
      case "player1":
        if(this.props.player==="player1"){
          return(<h3>WINNER</h3>);
        }
        break;
      case "player2":
        if (this.props.player==="player2") {
          return(<h3>WINNER</h3>);
        }
        break;
    }
  }

  isServer() {
    return this.props.server===this.props.player
  }

  onTakeBackClick(e) {
    var player = (e.target.id == "player1") ? 1 : 2;
    this.props.decrementScore(player);
  }

  styleCard() {
    var res = {}
    if (this.props.user.name) {
      Object.assign(res, {paddingTop:"4%"})
    }
    if (this.props.winner === this.props.player) {
      Object.assign(res, {backgroundColor:"#22CC22"})
    }
    else if (this.props.winner) {
      Object.assign(res, {opacity: 0.5,paddingTop: 115})
    }
    if (this.props.user.id !== 0) {
      Object.assign(res, {paddingBottom: 10})
    }
    return res;
  }


  activatePutModal() {
    $('#modal-'+this.props.player).openModal();
    $('.name').val(this.props.user.name);
    $('.name').focus();
  }

  render() {
    return (
      <div id={this.props.player} className={"col s4 offset-" + this.props.offset}>
        {this.props.user.streak >= 3?<img className="flames" src="assets/flames.png" />:""}
        <div style={this.styleCard()} className="card center-align z-depth-5">
          {this.checkWinner()}
          <div id="serving-marker">{this.isServer()?<img src="assets/ping-pong-red.png" alt="serving marker" height="42" width="42"/>:""}</div>
          <Profile
            player={this.props.player}
            className="profile-div"
            user={this.props.user}
            picURL={this.props.picURL}/>
          <Score
            className="score-div"
            score={this.props.score}
            user={this.props.user}/>
          {this.props.winner?
            "":
            <button
            className="take-back-point waves-effect waves-light btn"
            id={this.props.player}
            onClick={this.onTakeBackClick.bind(this)}>
            Take Back
            </button>
          }
          {this.props.user.id !== 0?
            <div className="bottom-buttons">
              <i className="material-icons" onClick={this.activatePutModal.bind(this)}>mode_edit</i>
              <i className="material-icons" onClick={this.props.swapUser.bind(this)}>loop</i>
              <i className="material-icons" onClick={this.props.logoutUser.bind(this, this.props.user.id)}>not_interested</i>
            </div>:
            ""
          }

        </div>
        <Modal formHandler={this.props.updateUserName} idSuffix={this.props.player} user={this.props.user}/>
      </div>
    );
  }
}

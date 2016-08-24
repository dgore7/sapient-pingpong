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
import axios from 'axios';

export default class Modal extends React.Component {

  render(){
    return (
      <div style={{"position":"absolute"}, {"zIndex":500}}>
        {/*<!-- Modal Structure -->*/}
        <div id={"modal-" + this.props.player} className="modal">
          <div>{this.props.uid}</div>
          <form onSubmit={this.props.formHandler.bind(this, this.props.user)} method="" action="">
            <div className="modal-content">
              <h4>Welcome to <br/>Ping-Pong Nitro</h4>
              <div className="input-field col s8 offset-s2">
                <label>Player Name</label>
                <input className={"name" + (this.props.user?this.props.user.id:"")} type="text" name="name"/>
                <br/>
              </div>
            </div>
            <div className="modal-footer">
              <input type="submit" href="#!" className="modal-action modal-close waves-effect waves-green btn-flat " value="submit" />
            </div>
          </form>
        </div>
      </div>
    )
  }

}

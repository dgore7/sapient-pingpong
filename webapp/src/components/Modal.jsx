import React from 'react';
import axios from 'axios';

export default class Modal extends React.Component {

  render(){
    return (
      <div style={{"position":"absolute"}, {"zIndex":500}}>
        {/*<!-- Modal Structure -->*/}
        <div id="modal1" className="modal">
          <form onSubmit={this.props.postWithRFID.bind(this)}method="post" action="api/user/register">
            <div className="modal-content">
              <h4>Welcome to <br/>Ping-Pong Nitro</h4>
              <div className="input-field col s8 offset-s2">
                <label>Player Name</label>
                <input id="name" type="text" name="name"/>
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

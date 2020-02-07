import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import { Grid } from 'semantic-ui-react';

import SidePanel from './SidePanel/SidePanel';
import MetaPanel from './MetaPanel/MetaPanel';
import ColorPanel from './ColorPanel/ColorPanel';
import Messages from './Messages/Messages';

import * as Selectors from '../../selectors/index';

const App = props => {
  const { currentUser, currentChannel, isPrivateChannel } = props;

  return (
    <Grid columns="equal" className="app" style={{background: '#eee'}}>
      <ColorPanel />
      <SidePanel
        userId={ currentUser && currentUser.uid }
        currentUser={ currentUser }
        currentChannel={ currentChannel }
      />
      <Grid.Column style={{marginLeft: 320}}>
        <Messages 
          channelId={currentChannel && currentChannel.id}
          currentUser={currentUser}
          currentChannel={currentChannel}
          isPrivateChannel={isPrivateChannel}
        />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel 
          currentChannel={currentChannel}
          isPrivateChannel={isPrivateChannel}
        />
      </Grid.Column>
    </Grid>
  );
}

const mapStateToProps = state => ({
  currentUser: Selectors.getCurrentUser(state),
  currentChannel: Selectors.getCurrentChannel(state),
  isPrivateChannel: false
})

export default connect(mapStateToProps, null)(App);

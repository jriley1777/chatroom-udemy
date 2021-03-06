import React from "react";
import { Menu } from 'semantic-ui-react';

import UserPanel from './UserPanel/UserPanel';
import Channels from './Channels/Channels';

const SidePanel = props => {
  const { currentUser, currentChannel } = props;
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: "#4c3c4c", fontSize: "1.2rem" }}
    >
      <UserPanel currentUser={ currentUser } />
      <Channels currentUser={currentUser} currentChannel={currentChannel} />
    </Menu>
  );
};


export default SidePanel;

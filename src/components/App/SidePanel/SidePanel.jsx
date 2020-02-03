import React from "react";
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';

import UserPanel from './UserPanel/UserPanel';
import Channels from './Channels/Channels';
import * as Selectors from '../../../selectors/index';

const SidePanel = props => {
  const { currentUser } = props;
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: "#4c3c4c", fontSize: "1.2rem" }}
    >
      <UserPanel currentUser={ currentUser } />
      <Channels currentUser={ currentUser} />
    </Menu>
  );
};

const mapStateToProps = state => ({
  currentUser : Selectors.getCurrentUser(state)
})

export default connect(mapStateToProps, null)(SidePanel);

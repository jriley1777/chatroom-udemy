import * as Actions from './types';

export const setUser = currentUser => {
    return {
      type: Actions.USER_ACTIONS.SET_USER,
      payload: {
        currentUser
      }
    };
};
export const clearUser = () => {
  return {
    type: Actions.USER_ACTIONS.CLEAR_USER
  };
};

export const setActiveChannel = channel => {
  return {
    type: Actions.CHANNEL_ACTIONS.SET_ACTIVE_CHANNEL,
    payload: {
      channel
    }
  };
};

export const setChannels = channels => {
  return {
    type: Actions.CHANNEL_ACTIONS.SET_CHANNELS,
    payload: {
      channels
    }
  }
}
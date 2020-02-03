import { combineReducers } from 'redux';
import * as Actions from '../actions/types';

const user_reducer = (state = { currentUser: null, isLoading: true } , action) => {
    switch(action.type){
        case Actions.USER_ACTIONS.SET_USER:
            return {
              currentUser: action.payload.currentUser,
              isLoading: false
            };
        case Actions.USER_ACTIONS.CLEAR_USER:
            return {
                currentUser: null,
                isLoading: false
            }    
        default:
            return state;
    }
}

const channel_reducer = (state = { activeChannel: null, channels: [] }, action) => {
    switch(action.type){
        case Actions.CHANNEL_ACTIONS.SET_ACTIVE_CHANNEL:
            return {
                ...state,
                activeChannel: action.payload.channel
            }
        case Actions.CHANNEL_ACTIONS.SET_CHANNELS:
            return {
              ...state,
              channels: action.payload.channels
            };    
        default: 
            return state;    
    }
}

const rootReducer = combineReducers({
  user: user_reducer,
  channel: channel_reducer
});

export default rootReducer;
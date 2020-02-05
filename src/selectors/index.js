export const getCurrentUser = state => state.user.currentUser;
export const getUserIsLoading = state => state.user.isLoading;
export const getCurrentChannel = state => state.channel.currentChannel || '';
export const getChannels = state => state.channel.channels;
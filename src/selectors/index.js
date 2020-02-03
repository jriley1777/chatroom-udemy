export const getCurrentUser = state => state.user.currentUser;
export const getUserIsLoading = state => state.user.isLoading;
export const getActiveChannel = state => state.channel.activeChannel || '';
export const getChannels = state => state.channel.channels;
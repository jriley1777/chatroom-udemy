import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import firebase from '../../../../utils/firebase/firebase';

import { Menu, Icon, Modal, Form, Button, Message, Label } from 'semantic-ui-react';

import * as Actions from '../../../../actions/index';
import * as Selectors from '../../../../selectors/index';

const IconButton = styled(Icon)`
    &:hover {
        cursor: pointer;
        color: green;
    }
`

const Channels = props => {
    const { currentUser, setCurrentChannel, setChannels, channels, currentChannel } = props;
    const [modal, setModal ] = useState(false);
    const [errors, setErrors] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialChannelState = {
        channelName: '',
        channelDetails: ''
    }
    const [channelToAdd, setChannelToAdd] = useState(initialChannelState);
    const [notifications, setNotifications ] = useState([]);
    const [channelListeners, setChannelListeners ] = useState([]);
    const channelsRef = firebase.database().ref('channels');
    const messagesRef = firebase.database().ref('messages');

    useEffect(() => {
        const listener = channelsRef.on('value', snap => {
            let initialChannels = [];
            if(!snap.val()) {
                setChannels([]);
            }
            Object.values(snap.val()).map(x => {
               return initialChannels.push(x);
            })
            setChannels(initialChannels);
            setCurrentChannel(initialChannels[0]);
        });
        return function unsub(){
            channelsRef.off('value', listener);
        }
    }, []);

    useEffect(() => {
        if(currentChannel) {
            channels.map(x => {
                if(!channelListeners.includes(x.id)) {
                    addNotificationListener(x.id);
                }
                return null;
            });
            setChannelListeners(channels.map(x => x.id));
        }
        return () => {
            channelListeners.map(x => {
                return messagesRef.child(x).off('value')
            })
        }
    }, [currentChannel, channels])

    const handleNotifications = (channelId, currentChannelId, not, snap) => {
        let lastTotal = 0;
        let index = not.findIndex(notification => notification.id === channelId);
        if (index !== -1) {
            if (channelId !== currentChannelId) {
                lastTotal = not[index].total;
                if(snap.numChildren() - lastTotal > 0) {
                    not[index].count = snap.numChildren() - lastTotal;
                }
                not[index].lastKnownTotal = snap.numChildren();
            }
        } else {
            not.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            })
        }
        const copy = [...not];
        setNotifications(copy);
    }
    const clearNotifications = newChannelId => {
        let index = notifications.findIndex(notification => notification.id === newChannelId );

        if(index !== -1) {
            let updatedNotifications = [...notifications];
            updatedNotifications[index].total = notifications[index].lastKnownTotal;
            updatedNotifications[index].count = 0;
            setNotifications(updatedNotifications);
        }
    }

    const getNotificationCount = channel => {
        let cnt = notifications.find(notification => notification.id === channel.id);
        if(cnt && cnt.count > 0) {
            return cnt.count;
        }
    }

    const addNotificationListener = channelId => {
        messagesRef.child(channelId).on('value', snap => {
            handleNotifications( channelId, currentChannel.id, notifications, snap );
        })
    }

    const closeModal = () => {
        setChannelToAdd(initialChannelState);
        setModal(false);
    }
    const handleChannelChange = e => {
        setErrors('');
        return setChannelToAdd({
            ...channelToAdd,
            [e.target.name]: e.target.value
        });
    }
    const isFormValid = () => {
        const { channelName, channelDetails } = channelToAdd;
        return channelName && channelDetails;
    }
    const addChannel = () => {
        const key = channelsRef.push().key;
        const newChannel = {
            id: key,
            name: channelToAdd.channelName,
            details: channelToAdd.channelDetails,
            createdBy: {
                name: currentUser.displayName,
                avatar: currentUser.photoURL,
            }
        };
        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                setErrors('');
                setChannelToAdd(initialChannelState);
                closeModal();
            })
            .catch(err => {
                console.error(err);
            });

    }
    const handleChannelSubmit = e => {
        e.preventDefault();
        setIsSubmitting(true);
        if(isFormValid()){
            addChannel();
        } else {
            setErrors("Please fill in name and description.")
        }
        setIsSubmitting(false);
    };
    const renderErrors = () => {
        if (errors){
            return (
                <Message error>{ errors }</Message>
            )
        }
    };
    const renderChannels = channels => {
        return channels.map(channel => {
            return (
                <Menu.Item 
                    key={channel.id}
                    onClick={() => {
                        setCurrentChannel( channel );
                        clearNotifications( channel.id );
                    }}
                    name={ channel.name }
                    style={{ opacity: 0.7 }}
                    active={ !!(currentChannel && channel.id === currentChannel.id) }
                >
                    { getNotificationCount(channel) && (
                        <Label color="red">{ getNotificationCount(channel) }</Label>
                    )}
                    # { channel.name }
                </Menu.Item>
            )
        })
    }

    return (
        <>
            <Menu.Menu>
                <Menu.Item>
                    <span style={{ marginRight: '0.2rem' }}>
                        <Icon name="exchange" /> CHANNELS
                    </span>
                    ({channels.length})
                    <IconButton name="add" onClick={() => setModal(true)} />
                </Menu.Item>
                {renderChannels(channels)}
            </Menu.Menu>
            <Modal size="small" open={ modal } onClose={ closeModal }>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input 
                            fluid
                            name="channelName"
                            label="Name of Channel"
                            error={errors.toLowerCase().includes("name")}
                            value={channelToAdd.channelName}
                            onChange={ handleChannelChange }
                        />
                        <Form.Input
                            fluid
                            name="channelDetails"
                            label="Channel Description"
                            error={errors.toLowerCase().includes("description")}
                            value={channelToAdd.channelDetails}
                            onChange={handleChannelChange}
                        />
                    </Form>
                    { renderErrors() }
                </Modal.Content>
                <Modal.Actions>
                    <Button 
                        color="green" 
                        inverted 
                        disabled={ isSubmitting }
                        onClick={handleChannelSubmit}>
                        <Icon name={isSubmitting ? "loading" : "checkmark"} /> Add
                    </Button>
                    <Button color="red" inverted onClick={closeModal}>
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    )
};

const mapStateToProps = state => ({
    channels: Selectors.getChannels(state),
});

const mapDispatchToState = {
    setCurrentChannel: Actions.setCurrentChannel,
    setChannels: Actions.setChannels
}

export default connect(mapStateToProps, mapDispatchToState)(Channels);
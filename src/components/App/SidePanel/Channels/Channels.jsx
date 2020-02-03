import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import firebase from '../../../../utils/firebase/firebase';

import { Menu, Icon, Modal, Form, Button, Message } from 'semantic-ui-react';

import * as Actions from '../../../../actions/index';
import * as Selectors from '../../../../selectors/index';

const IconButton = styled(Icon)`
    &:hover {
        cursor: pointer;
        color: green;
    }
`

const Channels = props => {
    const { currentUser, setActiveChannel, setChannels, channels, activeChannel } = props;
    const [modal, setModal ] = useState(false);
    const [errors, setErrors] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialChannelState = {
        channelName: '',
        channelDetails: ''
    }
    const [channelToAdd, setChannelToAdd] = useState(initialChannelState);
    const channelsRef = firebase.database().ref('channels');

    useEffect(() => {
        channelsRef.once('value').then(snap => {
            console.log(snap.val());
            let initialChannels = [];
            Object.values(snap.val()).map(x => {
               return initialChannels.push(x);
            })
            setChannels(initialChannels);
            setActiveChannel(loadedChannels[0]);
        });
        let loadedChannels = [];
        const update = channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            if(channels !== loadedChannels) {
                setChannels(loadedChannels);
            }
        });
        return function unsub(){
            channelsRef.off('child_added', update);
        }
    }, []);

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
                    onClick={() => { setActiveChannel( channel )}}
                    name={ channel.name }
                    style={{ opacity: 0.7 }}
                    active={ activeChannel && channel.id === activeChannel.id }
                ># { channel.name }</Menu.Item>
            )
        })
    }

    return (
        <>
            {console.log(JSON.stringify(channels))}
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
    activeChannel: Selectors.getActiveChannel(state),
});

const mapDispatchToState = {
    setActiveChannel: Actions.setActiveChannel,
    setChannels: Actions.setChannels
}

export default connect(mapStateToProps, mapDispatchToState)(Channels);
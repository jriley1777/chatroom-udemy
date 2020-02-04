import React, { useState } from 'react';
import firebase from '../../../../utils/firebase/firebase';

import { Segment, Button, Input, Message } from 'semantic-ui-react';

const MessageForm = props => {
    const { messagesRef, currentUser, currentChannel } = props;

    const [ message, setMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ errors, setErrors ] = useState('');

    const handleChange = e => {
        setErrors('');
        setMessage(e.target.value);
    }

    const sendMessage = e => {
        if(message) {
            setLoading(true)
            const newMessage = {
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                content: message,
                user: {
                    id: currentUser.uid,
                    name: currentUser.displayName,
                    avatar: currentUser.photoURL
                }
            }
            messagesRef
                .child(currentChannel.id)
                .push()
                .set(newMessage)
                .then(() => {
                    setMessage('');
                })
                .catch(err => {
                    console.error(err);
                    setErrors(err);
                });
            setLoading(false);    
        }
    }

    const renderErrors = () => {
        if (errors) {
            return (
                <Message error>{ errors }</Message>
            )
        }
    }

    return (
        <Segment className="message__form">
            <Input
                fluid
                name="message"
                onChange={ handleChange }
                value={ message }
                style={{ marginBottom: '0.7em' }}
                label={<Button icon={'add'} />}
                labelPosition="left"
                placeholder="Write your message"
            />
            <Button.Group icon width="2">
                <Button 
                    onClick={ sendMessage }
                    color="orange"
                    content="Add reply"
                    labelPosition="left"
                    icon={ loading ? "loading" : "edit" }
                    disabled={ loading }
                />
                <Button
                    color="teal"
                    content="Upload Media"
                    labelPosition="right"
                    icon="cloud upload"
                />
            </Button.Group>
            { renderErrors() }
        </Segment>
    )
};

export default MessageForm;
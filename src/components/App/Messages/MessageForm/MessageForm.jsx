import React, { useState } from 'react';
import styled from 'styled-components';
import firebase from '../../../../utils/firebase/firebase';

import { Segment, Button, Input, Message } from 'semantic-ui-react';
import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

const StyledMessageForm = styled(Segment).attrs({
    className: 'message__form'
})`
    position: fixed !important;
    bottom: 1em;
    margin-left: 320px !important;
    left: 0;
    right: 1em;
    z-index: 200
`

const MessageForm = props => {
    const { messagesRef, currentUser, currentChannel } = props;

    const [ message, setMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ errors, setErrors ] = useState('');
    const [ emojiPicker, setEmojiPicker ] = useState(false);

    const inputRef = React.createRef();

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

    const handleTogglePicker = () => {
        setEmojiPicker(!emojiPicker);
    }

    const colonToUnicode = message => {
        return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
            x = x.replace(/:/g, "");
            let emoji = emojiIndex.emojis[x];
            if( typeof(emoji) !== "undefined") {
                let unicode = emoji.native;
                if( typeof(unicode) !== "undefined") {
                    return unicode;
                }
            }
            x = ":" + x + ":";
            return x;
        });
    }

    const handleAddEmoji = emoji => {
        const oldMessage = message;
        const newMessage = colonToUnicode(`${oldMessage} ${emoji.colons}`);
        setMessage(newMessage);
        setEmojiPicker(false);
        inputRef.current.focus();
    }

    const handleKeyDown = event => {
        if (event.keyCode === 13 && inputRef.current.props.id === document.activeElement.id) {
            sendMessage();
        }
    }

    return (
        <StyledMessageForm>
            { emojiPicker && (
                <Picker 
                    set="apple"
                    className="emojiPicker"
                    title="Pick your emoji"
                    emoji="point_up"
                    onSelect={ handleAddEmoji }
                    darkMode={false}
                    style={{ position: 'absolute', bottom: '100%'}}
                />
            )}
            <Input
                fluid
                id="messageInput"
                name="message"
                onChange={ handleChange }
                onKeyDown={ handleKeyDown }
                value={ message }
                ref={inputRef}
                style={{ marginBottom: '0.7em' }}
                label={
                    <Button 
                        icon={emojiPicker ? 'close' : 'add'} 
                        onClick={ handleTogglePicker }
                    />}
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
        </StyledMessageForm>
    )
};

export default MessageForm;
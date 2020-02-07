import React, { useState } from 'react';
import styled from 'styled-components';
import firebase from '../../../../utils/firebase/firebase';
import uuidv4 from 'uuid/v4';
import axios from 'axios';

import { Segment, Button, Input, Message } from 'semantic-ui-react';
import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import FileModal from '../FileModal/FileModal';

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

    const [ showUploadModal, setShowUploadModal ] = useState(false);
    const [ uploadState, setUploadState ] = useState('');

    const inputRef = React.createRef();
    const storageRef = firebase.storage().ref();

    const handleChange = e => {
        setErrors('');
        setMessage(e.target.value);
    }

    const createMessage = async (fileUrl = '') => {
        let newMessage = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: currentUser.uid,
                name: currentUser.displayName,
                avatar: currentUser.photoURL
            },
        }
        if (fileUrl) {
            newMessage['image'] = fileUrl;
        } else if(message.startsWith(":")) {
            newMessage['content'] = await handleMessageCommand(message);
        } else {
            newMessage['content'] = message;
        }
        return newMessage;
    }

    const handleMessageCommand = async (message) => {
        switch(message.split(" ")[0]){
            case ':crypto':
                const ticker = message.split(" ")[1].toUpperCase();
                return await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${ticker}&tsyms=USD`).then(x => {
                    return `The USD price for ${ticker} is: ${x.data.USD}`;
                }).catch(err => {
                    setErrors(err.message);
                    return '';
                })
            default:
                return '';
        }
    }

    const sendTextMessage = async () => {
        const newMessage = await createMessage();
        if(newMessage && newMessage.content){
            setLoading(true);
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

    const sendFileMessage = (url, ref, pathToUpload) => {
        const newMessage = createMessage(url);
        if (newMessage) {
            ref.child(pathToUpload)
                .push()
                .set(newMessage)
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
            sendTextMessage();
        }
    }

    const uploadFile = (file, metadata) => {
        const pathToUpload = currentChannel.id;
        const ref = messagesRef;
        const filePath = `chat/public/${uuidv4()}.jpg`;
        setUploadState('loading');
        const fileRef = storageRef.child(filePath);
        fileRef.put(file,metadata).then(snapshot => {
            snapshot.ref.getDownloadURL().then(url => {
                console.log(url, ref, pathToUpload);
                sendFileMessage(url, ref, pathToUpload);
            })
        }).catch(err => {
            console.error(err);
            setErrors(err.message);
            setUploadState('error');
        });

        const listener = fileRef.put(file, metadata).on('state_changed', snap => {
            const percentUploaded = Math.floor((snap.bytesTransferred / snap.totalBytes) * 100);
        });

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
                    onClick={ sendTextMessage }
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
                    onClick={() => setShowUploadModal(true) }
                />
                <FileModal 
                    disabled={ uploadState === 'uploading' }
                    modal={ showUploadModal }
                    closeModal={ () => setShowUploadModal(false) }
                    uploadFile={ uploadFile }
                />
            </Button.Group>
            { renderErrors() }
        </StyledMessageForm>
    )
};

export default MessageForm;
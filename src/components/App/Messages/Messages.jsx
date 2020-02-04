import React, { useEffect, useState } from "react";
import firebase from '../../../utils/firebase/firebase';

import { Segment, Comment } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader/MessagesHeader';
import MessageForm from './MessageForm/MessageForm';
import Message from './Message/Message';

const Messages = props => {
    const { currentChannel, currentUser } = props;
    const messagesRef = firebase.database().ref('messages');
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);

    useEffect(() => {
        let key = currentChannel && currentChannel.id;
        if (key) {
            const ref = messagesRef.child(key);
            ref.once('value', snap => {
                let initialMessages = [];
                console.log('run');
                Object.values(snap.val()).map(x => {
                    initialMessages.push(x);
                })
                setMessages(initialMessages);
                setMessagesLoading(false);
            });
            let loadedMessages = [];
            const listener = ref.on('child_added', snap => {
                loadedMessages.push(snap.val());
                setMessages(loadedMessages);
            })
            return () => ref.off('child_added', listener);
        }
        
        
       
    }, [currentChannel])

    const renderMessages = () => {
        if (messagesLoading) {
            return <div>Messages loading...</div>
        } else if(messages.length > 0){
            return messages.map((msg, i) => {
                return (
                <Message 
                    key={msg.timestamp}
                    currentUser={currentUser}
                    message={msg} 
                />
                )
            })
        } else {
            return (
                <div style={{opacity: 0.7, fontStyle: 'italic', marginTop: '1rem'}}>This is the beginning of the channel.  Add a message below.</div>
            )
        }
    }
    return (
        <>
            <MessagesHeader 
                currentChannel={ currentChannel }
            />
            <Segment>
                <Comment.Group className="messages">
                    { renderMessages() }
                </Comment.Group>
            </Segment>
            <MessageForm 
                currentUser={ currentUser }
                currentChannel={ currentChannel }
                messagesRef={ messagesRef }
            />
        </>
    )
};

export default Messages; 

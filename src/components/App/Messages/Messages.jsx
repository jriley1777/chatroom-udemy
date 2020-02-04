import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import firebase from '../../../utils/firebase/firebase';

import { Segment, Comment } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader/MessagesHeader';
import MessageForm from './MessageForm/MessageForm';
import Message from './Message/Message';
import Skeleton from './Skeleton/Skeleton';

const StyledMessageComments = styled(Comment.Group)`
    min-height: 50vh;
    overflow-y: scroll;
`;

const Messages = props => {
    const { currentChannel, currentUser } = props;
    const messagesRef = firebase.database().ref('messages');
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const messagesEnd = React.createRef();

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
                messagesEnd && messagesEnd.current && messagesEnd.current.scrollIntoView({ behavior: 'smooth ' });
            })
            return () => ref.off('child_added', listener);
        }
        
        
       
    }, [currentChannel])

    const renderMessages = () => {
        if (messagesLoading) {
            return [...Array(10)].map((_,i) => {
                return <Skeleton key={i} />
            })
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
                <StyledMessageComments className="messages">
                    { renderMessages() }
                </StyledMessageComments>
                <div ref={messagesEnd}></div>
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

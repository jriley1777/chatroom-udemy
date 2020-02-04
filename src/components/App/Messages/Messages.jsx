import React, { useEffect, useState, useRef } from "react";
import styled from 'styled-components';
import firebase from '../../../utils/firebase/firebase';

import { Segment, Comment, Input } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader/MessagesHeader';
import MessageForm from './MessageForm/MessageForm';
import Message from './Message/Message';
import Skeleton from './Skeleton/Skeleton';

const StyledMessageComments = styled(Comment.Group)`
    min-height: 50vh;
    max-height: 60vh;
    overflow-y: scroll;
`;

const Messages = props => {
    const { currentChannel, currentUser } = props;
    const messagesRef = firebase.database().ref('messages');
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const endMessageRef = useRef(null);

    useEffect(() => {
        if (currentChannel && currentChannel.id) {
            const ref = messagesRef.child(currentChannel.id);
            setMessagesLoading(true);
            const listener = ref.on('value', snap => {
                const loadedMessages = [];
                Object.values(snap.val()).map(x => {
                    return loadedMessages.push(x);
                })
                setMessages(loadedMessages);
                setMessagesLoading(false);
                if(endMessageRef.current) {
                    endMessageRef.current.scrollIntoView(false, { behavior: 'smooth' })
                }
            })
            return () => ref.off('value', listener); 
        }
    }, [currentChannel]);

    

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
            });
        } else {
            return (
                <div style={{opacity: 0.7, fontStyle: 'italic', marginTop: '1rem'}}>This is the beginning of the channel.  Add a message below.</div>
            )
        }
    }
    return (
        <div>
            <MessagesHeader 
                currentChannel={ currentChannel }
            />
            <Segment>
                <StyledMessageComments className="messages">
                    { renderMessages() }
                    <div className="endMessages" ref={endMessageRef}></div>
                </StyledMessageComments>
            </Segment>
            <MessageForm 
                currentUser={ currentUser }
                currentChannel={ currentChannel }
                messagesRef={ messagesRef }
            />
        </div>
    )
};

export default Messages; 

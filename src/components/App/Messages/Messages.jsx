import React, { useEffect, useState, useRef } from "react";
import styled from 'styled-components';
import firebase from '../../../utils/firebase/firebase';

import { Segment, Comment } from 'semantic-ui-react';

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
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [numUniqueUsers, setNumUniqueUsers] = useState('');
    const [searchTerm, setSearchTerm] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const messagesRef = firebase.database().ref("messages");
    const endMessageRef = useRef(null);

    useEffect(() => {
        if (currentChannel && currentChannel.id) {
            const ref = messagesRef.child(currentChannel.id);
            setMessagesLoading(true);
            const listener = ref.on('value', snap => {
                const loadedMessages = [];
                if(!snap.val()) {
                    setMessages([]);
                    setMessagesLoading(false);
                    return;
                }
                Object.values(snap.val()).map(x => {
                    return loadedMessages.push(x);
                })
                setMessages(loadedMessages);
                setMessagesLoading(false);
                if(endMessageRef.current) {
                    endMessageRef.current.scrollIntoView(false, { behavior: 'smooth'})
                }
                countUniqueUsers(loadedMessages);
            })
            return () => ref.off('value', listener); 
        }
    }, [currentChannel]);

    const countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if(!acc.includes(message.user.name)){
                acc.push(message.user.name);
            }
            return acc;
        }, [])
        setNumUniqueUsers(`${uniqueUsers.length} Users`)
    } 

    const renderMessages = (messages) => {
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

    const handleSearchChange = e => {
        setSearchTerm(e.target.value);
        setSearchLoading(true);
    }

    const handleSearchMessages = () => {
        const channelMessages = [...messages];
        const regex = new RegExp(searchTerm, 'gi');
        const results = channelMessages.reduce((acc, message) => {
            if(message.content && (message.content.match(regex) || message.user.name.match(regex))) {
                acc.push(message);
            }
            return acc;
        }, [])
        setSearchResults(results);
    }

    useEffect(() => {
        handleSearchMessages();
        setSearchLoading(false);
    }, [ searchTerm ]);

    return (
        <div>
            <MessagesHeader 
                numUniqueUsers={ numUniqueUsers }
                currentChannel={ currentChannel }
                handleSearchChange={ handleSearchChange }
            />
            <Segment>
                <StyledMessageComments className="messages">
                    { searchTerm ? renderMessages(searchResults) : renderMessages(messages) }
                    <div ref={ endMessageRef } />
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

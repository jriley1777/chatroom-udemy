import React from "react";
import { connect } from 'react-redux';

import { Segment, Comment } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader/MessagesHeader';
import MessageForm from './MessageForm/MessageForm';

import * as Selectors from '../../../selectors/index';

const Messages = props => {
    const { activeChannel, messages } = props;

    const renderMessages = () => {
        if(messages.length > 0){
             
        } else {
            return (
                <div style={{opacity: 0.7, fontStyle: 'italic'}}>This is the beginning of the channel.  Add a message below.</div>
            )
        }
    }
    return (
        <>
            <MessagesHeader 
                activeChannel={ activeChannel }
            />
            <Segment>
                <Comment.Group className="messages">
                    { renderMessages() }
                </Comment.Group>
            </Segment>
            <MessageForm />
        </>
    )
};

const mapStateToProps = state => ({
    activeChannel: Selectors.getActiveChannel(state),
    messages: []
})

export default connect(mapStateToProps, null)(Messages);

import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { Comment, Image } from 'semantic-ui-react';

const StyledMessageContent = styled(Comment.Content)`
    &.message__self {
        border-left: 2px solid orange;
        padding-left: 8px
    }
    &.message__image {
        padding: 1em;
        
    }
`

const Message = props => {
    const { message, currentUser } = props;

    const isOwnMessage = (message, user) => {
        return message.user.id === user.uid ? 'message__self' : '';
    }

    const timeFromNow = timestamp => moment(timestamp).fromNow(); 
    const renderMessageContent = () => {
        return message.image ? (
            <Image src={ message.image } className="message__image" />
        ) : (
            <Comment.Text>{ message.content }</Comment.Text>
        )
    }

    return (
        <Comment>
            <Comment.Avatar src={ message.user.avatar } style={{ border: '1px solid #eee', borderRadius: '5px'}}/>
            <StyledMessageContent className={ isOwnMessage(message, currentUser) } >
                <Comment.Author as="a">{ message.user.name }</Comment.Author>
                <Comment.Metadata>{ timeFromNow(message.timestamp) }</Comment.Metadata>
                { renderMessageContent() }
            </StyledMessageContent>
        </Comment>
    ) 
};

export default Message;
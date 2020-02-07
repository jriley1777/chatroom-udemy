import React from 'react';

import { Segment, Header, Input, Icon } from 'semantic-ui-react';

const MessagesHeader = props => {
    const { currentChannel, numUniqueUsers, handleSearchChange } = props;

    return (
        <Segment clearing>
            <Header fluid="true" as="h2" floated="left" style={{marginBottom:0}}>
                <span>
                    # {currentChannel.name }
                    <Icon name={"star outline"} color="black" style={{ marginLeft: '5px'}}/>
                </span>
                <Header.Subheader>{ numUniqueUsers }</Header.Subheader>
            </Header>
            <Header floated="right">
                <Input 
                    onChange={ handleSearchChange }
                    size="mini"
                    icon="search"
                    name="searchTerm"
                    placeholder="Search Messages" 
                />
            </Header>
        </Segment>
    )
};

export default MessagesHeader;
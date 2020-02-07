import React, { useState } from "react";

import { Segment, Accordion, Header, Icon, Image, Loader } from 'semantic-ui-react';

const MetaPanel = props => {
    const { currentChannel, isPrivateChannel } = props;
    const [ activeIndex, setActiveIndex ] = useState(0);

    const setIndex = (event, titleProps) => {
        const { index } = titleProps;
        const newIndex = index === activeIndex ? -1 : index;
        setActiveIndex(newIndex);
    }

    const accordion = [
        {
            title: 'Channel Details',
            renderContent: () => currentChannel.details,
            iconName: 'info'
        },
        {
            title: 'Top Posters',
            renderContent: () => 'posters',
            iconName: 'user circle'
        },
        {
            title: 'Created By',
            renderContent: () => {
                return currentChannel.createdBy
                ? (
                    <>
                        <Image 
                            src={currentChannel.createdBy.avatar} 
                            style={{ height:'40px',width:'40px', display:'inline', marginRight:'10px'}}    
                        /> 
                        {currentChannel.createdBy.name}
                    </>
                )
                : ''
            },
            iconName: 'pencil alternate'
        }
    ]

    const renderAccordion = () => {
        return accordion.map((x, i) => {
            return (
                <React.Fragment key={ i } >
                    <Accordion.Title
                        active={activeIndex === i}
                        index={i}
                        onClick={setIndex}
                    >
                        <Icon name="dropdown" />
                        <Icon name={ x.iconName } />
                        { x.title }
                    </Accordion.Title>
                    <Accordion.Content
                        active={activeIndex === i}
                    >
                        {x.renderContent() }
                    </Accordion.Content>
                </React.Fragment>
            );
        })
    }

    return !isPrivateChannel ? 
        !currentChannel ? 
            <Loader /> :
            (
                <Segment>
                    <Header as="h3" attached="top">About { currentChannel.name }</Header>
                    <Accordion attached="true" styled>
                        { renderAccordion() }
                    </Accordion>
                </Segment>
            ) : null;
};

export default MetaPanel;

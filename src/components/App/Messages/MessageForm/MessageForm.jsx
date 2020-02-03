import React from 'react';

import { Segment, Button, Input } from 'semantic-ui-react';

const MessageForm = () => {
    return (
        <Segment className="message__form">
            <Input
                fluid
                name="message"
                style={{ marginBottom: '0.7em' }}
                label={<Button icon={'add'} />}
                labelPosition="left"
                placeholder="Write your message"
            />
            <Button.Group icon width="2">
                <Button 
                    color="orange"
                    content="Add reply"
                    labelPosition="left"
                    icon="edit"
                />
                <Button
                    color="teal"
                    content="Upload Media"
                    labelPosition="right"
                    icon="cloud upload"
                />

            </Button.Group>
        </Segment>
    )
};

export default MessageForm;
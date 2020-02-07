import React, { useState } from 'react';
import mime from 'mime-types';

import { Modal, Input, Button, Icon } from 'semantic-ui-react';

const FileModal = props => {
    const { modal, closeModal, uploadFile } = props;

    const [file, setFile] = useState(null);
    const authorized = ['image/jpeg','image/jpg','image/png'];

    const addFile = e => {
        const newFile = e.target.files[0];
        if (newFile) {
            setFile(newFile);
        }
    };
    const sendFile = file => {
        if( file ) {
            if (isAuthorized(file)) {
                //send file
                const metadata = { contentType: mime.lookup(file.name) };
                uploadFile(file, metadata);
                setFile(null);
                closeModal();
            } else {
                console.error("File type is not authorized");
            }
        } 
    };

    const isAuthorized = file => {
        return authorized.includes(mime.lookup(file.name));
    }

    return (
        <Modal basic open={modal} onClose={closeModal} >
            <Modal.Header>Select an Image File</Modal.Header>
            <Modal.Content>
                <Input 
                    fluid
                    label="File: jpeg, jpg, png"
                    name="file"
                    type="file"
                    onChange={ addFile }
                />
            </Modal.Content>
            <Modal.Actions>
                <Button
                    color="green"
                    inverted
                    onClick={() => sendFile(file) }
                >
                    <Icon name="checkmark" /> Send
                </Button>
                <Button
                    color="red"
                    inverted
                    onClick={ closeModal }
                >
                    <Icon name="remove" /> Cancel
                </Button>
            </Modal.Actions>
        </Modal>
    )
};

export default FileModal;
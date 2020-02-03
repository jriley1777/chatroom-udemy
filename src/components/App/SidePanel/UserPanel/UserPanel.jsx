import React from 'react';
import firebase from '../../../../utils/firebase/firebase';
import { withRouter } from 'react-router-dom';
import * as Constants from '../../../../constants/index';

import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';

const UserPanel = props => {

    const { currentUser } = props;

    const handleLogout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                console.log("Signed out.")
                props.history.push(Constants.ROUTES.LOGIN);
            })
    }
    const dropdownOptions = () => [
        { 
            key: "user",
            text: <span>Signed in as <strong>{ currentUser.displayName }</strong></span>,
            disabled: true
        },
        {
            key: "avatar",
            text: <span>Change Avatar</span>,
            disabled: false,
        },
        {
            key: "signout",
            text: <span onClick={ handleLogout }>Sign Out</span>,
            disabled: false,
        },
    ]
    return (
        <Grid style={{ background: '#4c3c4c'}}>
            <Grid.Column>
                <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                    <Header inverted floated="left" as="h2" >
                        <Icon name="code"/>
                        <Header.Content>DevChat</Header.Content>
                    </Header>
                    <Header style={{ padding: '0.25em' }} as="h4" inverted>
                        <Dropdown trigger={
                            <span>
                                <Image src={currentUser.photoURL} spaced="right" avatar />
                                {currentUser.displayName}
                            </span>
                        } options={dropdownOptions()} />
                    </Header>
                </Grid.Row>
            </Grid.Column>
        </Grid>
    )
};

export default withRouter(UserPanel);
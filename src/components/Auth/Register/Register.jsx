import React, { useState } from "react";
import firebase from '../../../utils/firebase/firebase';
import md5 from 'md5';
import { Grid, Form, Header, Message, Segment, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Register = () => {
  const defaultFormState = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: ""
  };
  const usersRef = firebase.database().ref("users");
  const [data, setData] = useState(defaultFormState);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { username, email, password, passwordConfirmation } = data;

  let isFormEmpty = !(username && email && password && passwordConfirmation);

  const isPasswordValid = () => {
    return password.length >= 6 && password === passwordConfirmation
  }
  const isFormValid = () => {
    if (isFormEmpty) {
      setErrors([{ message: "All fields are required." }]);
      return false;
    } else if(!isPasswordValid()) {
      setErrors([{ message: 'Password must be at least 6 characters and match confirmation.'}]);
      return false;
    } else {
      return true;
    }
  }

  const handleChange = e => {
    setErrors([]);
    setData({
      ...data, 
      [e.target.name]: e.target.value
    })
  };

  const saveUser = createdUser => {
    return usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    })
  }

  const handleSubmit = e => {
    e.preventDefault();
    if (isFormValid()) {
      setLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(createdUser => {
          createdUser.user.updateProfile({
            displayName: username,
            photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
          })
          .then(() => {
            saveUser(createdUser).then(() => {
              console.log("user saved.")
            })
            setData(defaultFormState);
          })
          .catch(err => {
            setErrors([{message: err.message}])
          })
          setLoading(false);
        })
        .catch(err => {
          setErrors([{message: err.message}]);
          setLoading(false);
        });
    }
  }

  const renderErrors = () => {
    if(errors.length){
      return <Message negative>{errors.map(err => err.message)}</Message>;
    }
  }

  const handleInputError = inputName => {
    return errors.some(err => err.message.toLowerCase().includes(inputName));
  }

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="orange" textAlign="center">
          <Icon name="puzzle piece" color="orange" />
          Register for DevChat
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              onChange={handleChange}
              error={handleInputError("username")}
              value={username}
              type="text"
            />
            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email Address"
              onChange={handleChange}
              error={handleInputError("email")}
              value={email}
              type="email"
            />
            <Form.Input
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              onChange={handleChange}
              error={handleInputError("password")}
              value={password}
              type="password"
            />
            <Form.Input
              fluid
              name="passwordConfirmation"
              icon="repeat"
              iconPosition="left"
              placeholder="Password Confirmation"
              onChange={handleChange}
              error={handleInputError("password")}
              value={passwordConfirmation}
              type="password"
            />
            <Button
              disabled={loading ? true : false}
              className={loading ? "loading" : ""}
              color="orange"
              fluid
              size="large"
            >
              Submit
            </Button>
            {renderErrors()}
          </Segment>
        </Form>
        <Message>
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;

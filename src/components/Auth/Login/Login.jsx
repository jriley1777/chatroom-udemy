import React, { useState } from "react";
import firebase from "../../../utils/firebase/firebase";
import {
  Grid,
  Form,
  Header,
  Message,
  Segment,
  Button,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";

const Login = () => {
  const defaultFormState = {
    email: "",
    password: "",
  };
  const [data, setData] = useState(defaultFormState);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { email, password } = data;

  const handleChange = e => {
    setErrors([]);
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isFormValid()) {
        setLoading(true);
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(signedInUser => {
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setErrors([{message: err.message}])
                setLoading(false);
            })
    }
  };

  const isFormValid = () => {
      return email && password;
  }

  const renderErrors = () => {
    if (errors.length) {
      return <Message negative>{errors.map(err => err.message)}</Message>;
    }
  };

  const handleInputError = inputName => {
    return errors.some(err => err.message.toLowerCase().includes(inputName));
  };

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" icon color="violet" textAlign="center">
          <Icon name="puzzle piece" color="violet" />
          Login to DevChat
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Segment stacked>
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
            <Button
              disabled={loading ? true : false}
              className={loading ? "loading" : ""}
              color="violet"
              fluid
              size="large"
            >
              Submit
            </Button>
            {renderErrors()}
          </Segment>
        </Form>
        <Message>
          Don't have an account? <Link to="/register">Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;

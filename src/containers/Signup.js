import React, { useState, useEffect } from 'react';
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import queryString from 'query-string';
import LoaderButton from '../components/LoaderButton';
import { useFormFields } from '../libs/hooksLib';
import './Signup.css';

const Signup = props => {
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: ''
  });
  const [newUser, setNewUser] = useState(null);
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { p } = queryString.parse(props.location.search);

    if (p === 'confirm') {
      setIsConfirmation(true);
    }
  }, [props.location.search]);

  const validateForm = () =>
    fields.email.length > 0 &&
    fields.password.length > 0 &&
    fields.password === fields.confirmPassword;

  const validateConfirmationForm = () => fields.confirmationCode.length > 0;

  const handleSubmit = async event => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  };

  const handleConfirmationSubmit = async event => {
    const { email } = queryString.parse(props.location.search);

    event.preventDefault();

    setIsLoading(true);

    try {
      if (!email) {
        await Auth.confirmSignUp(fields.email, fields.confirmationCode);
        await Auth.signIn(fields.email, fields.password);

        props.userHasAuthenticated(true);
        props.history.push('/');
      } else {
        await Auth.confirmSignUp(email, fields.confirmationCode);

        props.history.push('/login');
      }
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  };

  const renderConfirmationForm = () => (
    <form onSubmit={handleConfirmationSubmit}>
      <FormGroup controlId="confirmationCode" bsSize="large">
        <ControlLabel>Confirmation Code</ControlLabel>
        <FormControl
          id="confirmationCode"
          type="tel"
          autoFocus
          value={fields.confirmationCode}
          onChange={handleFieldChange}
        />
        <HelpBlock>Please check your email for the code.</HelpBlock>
      </FormGroup>
      <LoaderButton
        block
        type="submit"
        bsSize="large"
        isLoading={isLoading}
        disabled={!validateConfirmationForm()}
      >
        Verify
      </LoaderButton>
    </form>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <FormGroup controlId="email" bsSize="large">
        <ControlLabel>Email</ControlLabel>
        <FormControl
          id="email"
          type="email"
          autoFocus
          value={fields.email}
          onChange={handleFieldChange}
        />
      </FormGroup>
      <FormGroup controlId="password" bsSize="large">
        <ControlLabel>Password</ControlLabel>
        <FormControl
          id="password"
          type="password"
          value={fields.password}
          onChange={handleFieldChange}
        />
      </FormGroup>
      <FormGroup controlId="confirmPassword" bsSize="large">
        <ControlLabel>Confirm Password</ControlLabel>
        <FormControl
          id="confirmPassword"
          type="password"
          value={fields.confirmPassword}
          onChange={handleFieldChange}
        />
      </FormGroup>
      <LoaderButton
        block
        type="submit"
        bsSize="large"
        isLoading={isLoading}
        disabled={!validateForm()}
      >
        Signup
      </LoaderButton>
    </form>
  );

  return (
    <div className="Signup">
      {isConfirmation
        ? renderConfirmationForm()
        : newUser === null
        ? renderForm()
        : renderConfirmationForm()}
    </div>
  );
};

export default Signup;

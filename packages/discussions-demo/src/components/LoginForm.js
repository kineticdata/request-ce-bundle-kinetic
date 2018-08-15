import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { Button, Input } from 'reactstrap';

const LoginComponent = ({
  handleSubmit,
  userInput,
  handleUserInput,
  passInput,
  handlePassInput,
}) => (
  <div>
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={userInput}
        onChange={handleUserInput}
        placeholder="Username..."
      />

      <Input
        type="text"
        value={passInput}
        onChange={handlePassInput}
        placeholder="Password..."
      />

      <Button color="success">Login</Button>
    </form>
  </div>
);

const handleUserInput = ({ setUserInput }) => e => setUserInput(e.target.value);
const handlePassInput = ({ setPassInput }) => e => setPassInput(e.target.value);
const handleSubmit = ({ handleLogin, userInput, passInput }) => e => {
  e.preventDefault();
  handleLogin(userInput, passInput);
};
export const LoginForm = compose(
  withState('userInput', 'setUserInput', ''),
  withState('passInput', 'setPassInput', ''),
  withHandlers({
    handleUserInput,
    handlePassInput,
    handleSubmit,
  }),
)(LoginComponent);

import React from 'react';
import { compose, withState, withHandlers } from 'recompose';
import { Button, Input } from 'reactstrap';

const ConnectionComponent = ({
  handleSubmit,
  host,
  handleHostInput,
  port,
  handlePortInput,
}) => (
  <div>
    <form onSubmit={handleSubmit}>
      <Input type="text" value={host} onChange={handleHostInput} />
      <Input type="text" value={port} onChange={handlePortInput} />

      <Button color="success">Connect</Button>
    </form>
  </div>
);

const handleHostInput = ({ setHost }) => e => setHost(e.target.value);
const handlePortInput = ({ setPort }) => e => setPort(e.target.value);
const handleSubmit = ({ handleConnect, host, port }) => e => {
  e.preventDefault();

  handleConnect(host, port);
};

export const ConnectionForm = compose(
  withState('host', 'setHost', 'localhost'),
  withState('port', 'setPort', '7070'),
  withHandlers({
    handleHostInput,
    handlePortInput,
    handleSubmit,
  }),
)(ConnectionComponent);

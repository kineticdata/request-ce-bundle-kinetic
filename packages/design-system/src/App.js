import React, { Component } from 'react';
import { TimeAgo } from 'common/src/components/TimeAgo';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: new Date(),
    };
  }

  render() {
    return (
      <div>
        <p>Get started here.</p>
        <TimeAgo timestamp={this.state.timestamp} />
      </div>
    );
  }
}

export default App;

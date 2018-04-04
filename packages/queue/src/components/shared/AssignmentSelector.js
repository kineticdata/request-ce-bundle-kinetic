import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { AssignmentItem } from './AssignmentItem';

/* eslint-disable class-methods-use-this */
export class AssignmentSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assignment: '',
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMenuVisible = this.handleMenuVisible.bind(this);
  }

  componentDidMount() {
    this.input.focus();
  }

  handleSelect(value, state) {
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(value, state);
    }
  }

  handleChange(e, value) {
    this.setState({ assignment: value });
  }

  handleMenuVisible(isOpen) {
    if (!isOpen) {
      // TODO:MTR Find a better solution to this problem.
      // This is a pretty big hack but I'm not sure how to fix this. When you press
      // escape or click out of the selection area it closes normally. When you
      // click to select an assignment it closes normally. When you use the enter key
      // to select an assignment this handler gets called first and it causes the
      // menu to be destroyed before the value can be selected and passed out.
      setTimeout(() => {
        if (this.props.toggle) {
          this.props.toggle(false);
        }
      }, 100);
    }
  }

  shouldItemRender(item, value) {
    // Return true for all assignments whose team matches.
    if (item.team.toUpperCase().includes(value.toUpperCase())) {
      return true;
    }

    // Otherwise check to see if the user itself matches.
    return item.displayName.toUpperCase().includes(value.toUpperCase());
  }

  renderItem(item, isHighlighted) {
    return (
      <AssignmentItem
        key={`${item.team}::${item.username}`}
        item={item}
        isHighlighted={isHighlighted}
      />
    );
  }

  renderMenu(items) {
    const byTeams = items.reduce((acc, item) => {
      if (acc[item.props.item.team]) {
        acc[item.props.item.team].push(item);
      } else {
        acc[item.props.item.team] = [item];
      }
      return acc;
    }, {});

    return (
      <div key="menu">
        {Object.keys(byTeams).map(t => (
          <div key={t}>
            <h5 className="team">{t}</h5>
            {byTeams[t]}
          </div>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="assignment-badge">
        Assignment
        <div className="select">
          <Autocomplete
            ref={el => {
              this.input = el;
            }}
            value={this.state.assignment}
            wrapperStyle={{}}
            menuStyle={{}}
            items={this.props.assignments}
            getItemValue={item => item.username}
            shouldItemRender={this.shouldItemRender}
            renderItem={this.renderItem}
            renderMenu={this.renderMenu}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
            onMenuVisibilityChange={this.handleMenuVisible}
          />
        </div>
      </div>
    );
  }
}

import React from 'react';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

export const PopConfirm = props => (
  <Popover
    placement={props.placement}
    isOpen={props.isOpen}
    target={props.target}
    toggle={props.toggle}
  >
    <PopoverHeader>{props.title}</PopoverHeader>
    <PopoverBody>{props.children}</PopoverBody>
  </Popover>
);

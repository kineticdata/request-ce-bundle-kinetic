import React from 'react';
import { Popover, PopoverTitle, PopoverContent } from 'reactstrap';

export const PopConfirm = props => (
  <Popover
    placement={props.placement}
    isOpen={props.isOpen}
    target={props.target}
    toggle={props.toggle}
  >
    <PopoverTitle>{props.title}</PopoverTitle>
    <PopoverContent>{props.children}</PopoverContent>
  </Popover>
);

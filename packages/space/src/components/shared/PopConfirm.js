import React from 'react';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { I18n } from '@kineticdata/react';

export const PopConfirm = props => (
  <Popover
    placement={props.placement}
    isOpen={props.isOpen}
    target={props.target}
    toggle={props.toggle}
  >
    <PopoverHeader>
      <I18n>{props.title}</I18n>
    </PopoverHeader>
    <PopoverBody>{props.children}</PopoverBody>
  </Popover>
);

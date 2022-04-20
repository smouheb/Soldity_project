import React from 'react';
import {Menu, Input} from 'semantic-ui-react';

export default props => {
  return (
    <Menu>
      <Menu.Item
          name='home'
        />
      <Menu.Item
            name='campaign'
          />
      <Menu.Item header> Our Company </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>
          <Input icon='search' placeholder='Search...' />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

// eslint-disable-next-line no-unused-vars
import React from 'react';
import { FlexPlugin } from 'flex-plugin';
import MessageTimer from './Components/MessageTimer'

const PLUGIN_NAME = 'MessageTimerPlugin';

export default class Plugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    flex.TaskListButtons.Content.add(<MessageTimer key="test-component" />, {
      sortOrder: 1,
      align: "end"
    });

  }

}
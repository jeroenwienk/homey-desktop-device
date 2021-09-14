const REND = {
  INIT: 'renderer:init',
  BUTTON_CREATE: 'button:create',
  BUTTON_UPDATE: 'button:update',
  BUTTON_REMOVE: 'button:remove',
  BUTTON_RUN: 'button:run',
  ACCELERATOR_CREATE: 'accelerator:create',
  ACCELERATOR_UPDATE: 'accelerator:update',
  ACCELERATOR_REMOVE: 'accelerator:remove',
  ACCELERATOR_RUN: 'accelerator:run',
  DISPLAY_CREATE: 'display:create',
  DISPLAY_UPDATE: 'display:update',
  DISPLAY_REMOVE: 'display:remove',
  INPUT_CREATE: 'input:create',
  INPUT_UPDATE: 'input:update',
  INPUT_REMOVE: 'input:remove',
  INPUT_RUN: 'input:run',
  TEST: 'test',
};

const OVERLAY = {
  INIT: 'overlay:init',
};

const MAIN = {
  BUTTONS_INIT: 'buttons:init',
  BUTTONS_BROKEN: 'buttons:broken',
  ACCELERATORS_INIT: 'accelerators:init',
  ACCELERATORS_BROKEN: 'accelerators:broken',
  ACCELERATOR_TEST: 'accelerator:test',
  HISTORY_INIT: 'history:init',
  HISTORY_PUSH: 'history:push',
  DISPLAYS_INIT: 'displays:init',
  DISPLAYS_BROKEN: 'displays:broken',
  DISPLAY_SET: 'display:set',
  INPUTS_INIT: 'inputs:init',
  INPUTS_BROKEN: 'inputs:broken',

  SOCKETS_INIT: 'sockets:init',

  VESION: 'version',

  TEST: 'test',
};

const IO_EMIT = {
  BUTTONS_SYNC: 'buttons:sync',
  BUTTON_RUN: 'button:run',
  ACCELERATORS_SYNC: 'accelerators:sync',
  ACCELERATOR_RUN: 'accelerator:run',
  DISPLAYS_SYNC: 'displays:sync',
  INPUTS_SYNC: 'inputs:sync',
  INPUT_RUN: 'input:run',
};

const IO_ON = {
  BROWSER_OPEN_RUN: 'browser:open:run',
  PATH_OPEN_RUN: 'path:open:run',
  COMMAND_RUN: 'command:run',
  BUTTON_RUN_SUCCESS: 'button:run:success',
  BUTTON_RUN_ERROR: 'button:run:error',
  FLOW_BUTTON_SAVED: 'flow:button:saved',
  ACCELERATOR_RUN_SUCCESS: 'accelerator:run:success',
  ACCELERATOR_RUN_ERROR: 'accelerator:run:error',
  FLOW_ACCELERATOR_SAVED: 'flow:accelerator:saved',
  NOTIFICATION_SHOW_RUN: 'notification:show:run',
  DISPLAY_SET_RUN: 'display:set:run',
  FLOW_DISPLAY_SAVED: 'flow:display:saved',
  INPUT_RUN_SUCCESS: 'input:run:success',
  INPUT_RUN_ERROR: 'input:run:error',
  FLOW_INPUT_SAVED: 'flow:input:saved',
};

module.exports = {
  REND,
  OVERLAY,
  MAIN,
  IO_EMIT,
  IO_ON,
};

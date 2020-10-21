const REND = {
  INIT: 'init',
  BUTTON_CREATE: 'button:create',
  BUTTON_UPDATE: 'button:update',
  BUTTON_REMOVE: 'button:remove',
  BUTTON_RUN: 'button:run',
  ACCELERATOR_CREATE: 'accelerator:create',
  ACCELERATOR_UPDATE: 'accelerator:update',
  ACCELERATOR_REMOVE: 'accelerator:remove',
  ACCELERATOR_RUN: 'accelerator:run',
  TEST: 'test',
};

const MAIN = {
  BUTTONS_INIT: 'buttons:init',
  BUTTONS_BROKEN: 'buttons:broken',
  ACCELERATORS_INIT: 'accelerators:init',
  ACCELERATORS_BROKEN: 'accelerators:broken',
  HISTORY_INIT: 'history:init',
  HISTORY_PUSH: 'history:push',

  SOCKETS_INIT: 'sockets:init',
  TEST: 'test',
};

const IO_EMIT = {
  BUTTONS_SYNC: 'buttons:sync',
  BUTTON_RUN: 'button:run',
  ACCELERATORS_SYNC: 'accelerators:sync',
  ACCELERATOR_RUN: 'accelerator:run',
};

const IO_ON = {
  BROWSER_OPEN_RUN: 'browser:open:run',
  PATH_OPEN_RUN: 'path:open:run',
  COMMAND_RUN: 'command:run',
  BUTTON_RUN_SUCCESS: 'button:run:success',
  BUTTON_RUN_ERROR: 'button:run:error',
  ACCELERATOR_RUN_SUCCESS: 'accelerator:run:success',
  ACCELERATOR_RUN_ERROR: 'accelerator:run:error',
  NOTIFICATION_SHOW_RUN: 'notification:show:run',
  FLOW_BUTTON_SAVED: 'flow:button:saved',
  FLOW_ACCELERATOR_SAVED: 'flow:accelerator:saved',
};

module.exports = {
  REND,
  MAIN,
  IO_EMIT,
  IO_ON,
};

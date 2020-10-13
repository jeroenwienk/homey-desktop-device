const REND = {
  INIT: 'init',
  BUTTON_CREATE: 'button:create',
  BUTTON_UPDATE: 'button:update',
  BUTTON_REMOVE: 'button:remove',
  BUTTON_RUN: 'button:run'
};

const MAIN = {
  BUTTONS_INIT: 'buttons:init',
  BUTTONS_BROKEN: 'buttons:broken',
  HISTORY_INIT: 'history:init',
  HISTORY_PUSH: 'history:push',

  SOCKETS_INIT: 'sockets:init',
};

const IO_EMIT = {
  BUTTONS_SYNC: 'buttons:sync',
  BUTTON_RUN: 'button:run',
  COMMANDS_SYNC: 'commands:sync'
};

const IO_ON = {
  BROWSER_OPEN_RUN: 'browser:open:run',
  PATH_OPEN_RUN: 'path:open:run',
  BUTTON_RUN_SUCCESS: 'button:run:success',
  BUTTON_RUN_ERROR: 'button:run:error',
  NOTIFICATION_SHOW_RUN: 'notification:show:run',
  FLOW_BUTTON_SAVED: 'flow:button:saved'
};

module.exports = {
  REND,
  MAIN,
  IO_EMIT,
  IO_ON
};

module.exports.REND = {
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
  SETTINGS_UPDATE: 'settings:update',
  TEST: 'test',
};

module.exports.OVERLAY = {
  INIT: 'overlay:init',
};

module.exports.MAIN = {
  BUTTONS_INIT: 'buttons:init',
  ACCELERATORS_INIT: 'accelerators:init',
  ACCELERATOR_TEST: 'accelerator:test',
  HISTORY_INIT: 'history:init',
  HISTORY_PUSH: 'history:push',
  DISPLAYS_INIT: 'displays:init',
  DISPLAY_SET: 'display:set',
  INPUTS_INIT: 'inputs:init',
  SETTINGS_INIT: 'settings:init',
  SETTINGS_SET: 'settings:set',

  INIT: 'init',

  SOCKETS_INIT: 'sockets:init',

  VESION: 'version',
  ON_API_PROPS: 'onApiProps',

  TEST: 'test',
};

module.exports.IO_EMIT = {
  BUTTONS_SYNC: 'buttons:sync',
  BUTTON_RUN: 'button:run',
  ACCELERATORS_SYNC: 'accelerators:sync',
  ACCELERATOR_RUN: 'accelerator:run',
  DISPLAYS_SYNC: 'displays:sync',
  INPUTS_SYNC: 'inputs:sync',
  INPUT_RUN: 'input:run',
};

module.exports.IO_ON = {
  BROWSER_OPEN_RUN: 'browser:open:run',
  PATH_OPEN_RUN: 'path:open:run',
  WINDOW_ACTION_RUN: 'window:action:run',
  WINDOW_MOVE_RUN: 'window:move:run',
  COMMAND_RUN: 'command:run',
  WEB_APP_EXECUTE_CODE_RUN: 'web:app:execute:code:run',
  SCREENS_FETCH: 'screens:fetch',
  NOTIFICATION_SHOW_RUN: 'notification:show:run',
  DISPLAY_SET_RUN: 'display:set:run',
  FLOW_DISPLAY_SAVED: 'flow:display:saved',
  FLOW_INPUT_SAVED: 'flow:input:saved',
  FLOW_BUTTON_SAVED: 'flow:button:saved',
  FLOW_ACCELERATOR_SAVED: 'flow:accelerator:saved',
};

module.exports.events = {
  BUTTONS_SYNC: 'buttons:sync',

  ACCELERATORS_SYNC: 'accelerators:sync',
  ACCELERATOR_RUN: 'accelerator:run',

  DISPLAYS_SYNC: 'displays:sync',

  INPUTS_SYNC: 'inputs:sync',

  GET_API_PROPS: 'getApiProps',
  ON_API_PROPS: 'onApiProps',

  SYNC: 'sync',

  ON_COMMAND_ARGUMENT_VALUES: 'onCommandArgumentValues',
  GET_COMMAND_ARGUMENT_VALUES: 'getCommandArgumentValues',
  SEND_COMMAND: 'sendCommand',

  ON_COMMANDER_WINDOW_MESSAGE: 'onCommanderWindowMessage',
};

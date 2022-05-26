import { defaultTextValueSort } from '../defaultTextValueSort';

export async function makeInsightsSections({ value }) {
  const baseKey = `${value.key}-insights`;
  const { homey } = value.context;

  const logs = await homey.api.insights.getLogs();

  const logsObject = {};

  for (const log of logs) {
    if (log.type !== 'number') continue;
    logsObject[`${log.uri}::${log.id}`] = log;
  }

  console.log(logsObject);

  return {
    logs: logsObject,
    sections: [
      {
        key: baseKey,
        title: 'Insights',
        children: Object.entries(logsObject)
          .map(([key, log]) => {
            return {
              key: key,
              type: 'log',
              textValue: log.title,
              hint: '',
              filter: '',
              action({ input }) {},
              context: {
                log,
              },
            };
          })
          .sort(defaultTextValueSort),
      },
    ],
  };
}

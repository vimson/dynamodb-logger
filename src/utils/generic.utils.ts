import { Credentials } from '@aws-sdk/types';
import { LoggerConfig } from '../lib';

const getLoggerConfig = (): LoggerConfig => {
  const config: LoggerConfig = {
    region: 'eu-west-1',
    table: {
      name: 'LambdaLogs',
      partitionKey: 'PK',
      sortKey: 'SK',
      lsi1SortKey: 'LSI-1-SK',
      lsi2SortKey: 'LSI-2-SK',
      lsi1Index: 'LSI-1-index',
      lsi2Index: 'LSI-2-index',
    },
  };

  if (process.env.accessKeyId && process.env.secretAccessKey) {
    const credentials: Credentials = {
      accessKeyId: process.env.accessKeyId ?? '',
      secretAccessKey: process.env.secretAccessKey ?? '',
    };
    config.credentials = credentials;
  }
  return config;
};

export { getLoggerConfig };

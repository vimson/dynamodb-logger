import * as dotenv from 'dotenv';
dotenv.config();
import { logger, LogSearchConfig, LogResult } from '../lib';
import { getLoggerConfig } from '../utils/generic.utils';

enum LogLevel {
  'INFO' = 'INFO',
  'WARNING' = 'WARNING',
  'ERROR' = 'ERROR',
  'DEBUG' = 'DEBUG',
  'CRITICAL' = 'CRITICAL',
  'FATAL' = 'FATAL',
  'ALERT' = 'ALERT',
  'EMERGENCY' = 'EMERGENCY',
  'NOTICE' = 'NOTICE',
  'TRACE' = 'TRACE',
  'VERBOSE' = 'VERBOSE',
  'SUCCESS' = 'SUCCESS',
  'PAYLOAD' = 'PAYLOAD',
}

enum LogModules {
  'CourseResizer' = 'CourseResizer',
  'ProviderResizer' = 'ProviderResizer',
  'SpotlightResizer' = 'SpotlightResizer',
  'SlackNotifier' = 'SlackNotifier',
  'EmailNotifier' = 'EmailNotifier',
  'PushNotifier' = 'PushNotifier',
}

describe('Testing the logger', () => {
  test('Logger search configuration', async () => {
    logger.initailize(getLoggerConfig());

    const searchOptions: LogSearchConfig = {
      module: LogModules.PushNotifier,
      level: LogLevel.ERROR,
      startTime: '2022-10-03T07:01:46.037Z',
      endTime: '2022-12-03T07:01:46.037Z',
      limit: 1,
      sort: 'asc',
    };

    let logResult: LogResult;
    do {
      logResult = await logger.search(searchOptions);
      if (logResult.lastEvaluatedKey) {
        searchOptions.lastEvaluatedKey = logResult.lastEvaluatedKey;
      }
      console.log(logResult);
    } while (logResult.lastEvaluatedKey);

    expect(true).toBe(true);
  });
});

import * as dotenv from 'dotenv';
dotenv.config();
import { logger } from '../lib';
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
  test('Logger with full configuration', async () => {
    const config = getLoggerConfig();
    logger.initailize(config);
    const response = await logger.log(LogModules.CourseResizer, LogLevel.NOTICE, `Log: ${Math.random()}`);
    expect(response).toBe(true);
  });
});

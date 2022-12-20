import dynamoDBHelper from './helpers/dynamodb.helper';
import { LoggerConfig, LogSearchConfig } from './types/types';

class Logger {
  static initailize(config: LoggerConfig) {
    dynamoDBHelper.initialize(config);
  }

  static async log(module: string, level: string, log: string): Promise<boolean> {
    return dynamoDBHelper.saveLog(module, level, log);
  }

  static async search(config: LogSearchConfig): Promise<any> {
    return dynamoDBHelper.search(config);
    return true;
  }
}

export { Logger as logger };
export * from './types/types';
export * from './utils/generic.utils';

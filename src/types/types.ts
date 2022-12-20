import { Credentials } from '@aws-sdk/types';
import { AttributeValue } from '@aws-sdk/client-dynamodb';

export type LoggerTableConfig = {
  name: string;
  partitionKey?: string;
  sortKey?: string;
  lsi1SortKey?: string;
  lsi2SortKey?: string;
  lsi1Index?: string;
  lsi2Index?: string;
};

export type LoggerConfig = {
  region: string;
  credentials?: Credentials;
  table?: LoggerTableConfig;
};

export type LogSearchConfig = {
  module: string;
  level?: string;
  startTime?: string;
  endTime?: string;
  lastEvaluatedKey?: Record<string, any>;
  limit?: number;
  sort?: 'asc' | 'desc';
};

export type LogItem = {
  PK: string;
  SK: string;
  module: string;
  level: string;
  log: string;
};

export type LogResult = {
  items: LogItem[];
  lastEvaluatedKey?: Record<string, any>;
};

export type SearchParams = {
  condition: string;
  index: string | undefined;
  attrNames: Record<string, string> | null;
  attrValues: Record<string, AttributeValue>;
};

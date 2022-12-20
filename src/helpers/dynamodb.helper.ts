import * as short from 'short-uuid';
import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { LoggerConfig, LoggerTableConfig, LogSearchConfig, LogResult, LogItem, SearchParams } from '../types/types';
import { map } from 'lodash';

class DynamoDBHelper {
  private client!: DynamoDBClient;

  private tableName = 'LambdaLogs';
  private partitionKey = 'PK';
  private sortKey = 'SK';
  private lsi1SortKey = 'LSI-1-SK';
  private lsi2SortKey = 'LSI-2-SK';
  private lsi1Index = 'LSI-1-index';
  private lsi2Index = 'LSI-2-index';

  initialize(config: LoggerConfig) {
    if (config.table) {
      this.populateTableProperties(config.table);
    }
    this.client = config.credentials
      ? new DynamoDBClient({
          region: config.region,
          credentials: config.credentials,
        })
      : new DynamoDBClient({
          region: config.region,
        });
  }

  populateTableProperties(tableConfig: LoggerTableConfig) {
    this.tableName = tableConfig.name ?? this.tableName;
    this.partitionKey = tableConfig.partitionKey ?? this.partitionKey;
    this.sortKey = tableConfig.sortKey ?? this.sortKey;
    this.lsi1SortKey = tableConfig.lsi1SortKey ?? this.lsi1SortKey;
    this.lsi2SortKey = tableConfig.lsi2SortKey ?? this.lsi2SortKey;
    this.lsi1Index = tableConfig.lsi1Index ?? this.lsi1Index;
    this.lsi2Index = tableConfig.lsi2Index ?? this.lsi2Index;
  }

  clientExists() {
    if (!this.client) {
      throw new Error('DynamoDB helper is not initialized');
    }
  }

  async saveLog(module: string, level: string, log: string): Promise<boolean> {
    this.clientExists();

    const timeStamp = new Date().toJSON();
    const params: PutItemCommandInput = {
      TableName: this.tableName,
      Item: marshall({
        [this.partitionKey]: module,
        [this.sortKey]: `${level}-${timeStamp}-${short.generate()}`,
        [this.lsi1SortKey]: timeStamp,
        [this.lsi2SortKey]: `${level}-${timeStamp}`,
        module,
        level,
        log,
      }),
    };

    try {
      await this.client.send(new PutItemCommand(params));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async search(config: LogSearchConfig): Promise<LogResult> {
    const searchParams: SearchParams = this.getSearchCriteria(config);
    const scanIndexForward = config.sort === 'asc' ? true : false;
    const searchOptions: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: searchParams.condition,
      ExpressionAttributeValues: searchParams.attrValues,
      Limit: config.limit ?? 10,
      ScanIndexForward: scanIndexForward,
    };

    if (searchParams.index) {
      searchOptions.IndexName = searchParams.index;
    }
    if (searchParams.attrNames) {
      searchOptions.ExpressionAttributeNames = searchParams.attrNames;
    }

    if (config.lastEvaluatedKey) {
      searchOptions.ExclusiveStartKey = config.lastEvaluatedKey;
    }

    const response: QueryCommandOutput = await this.client.send(new QueryCommand(searchOptions));
    const items = map(response.Items, item => {
      delete item[this.lsi1SortKey];
      delete item[this.lsi2SortKey];
      return unmarshall(item) as LogItem;
    });

    return {
      items,
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  }

  getSearchCriteria(config: LogSearchConfig): SearchParams {
    let condition: SearchParams['condition'] = 'PK = :module';
    let index: SearchParams['index'];
    let attrNames: SearchParams['attrNames'] = null;
    let attrValues: SearchParams['attrValues'] = { ':module': { S: config.module } };

    if (config.startTime && config.endTime && !config.level) {
      condition = 'PK = :module and #LSI1SK between :startTime and :endTime';
      attrNames = {
        '#LSI1SK': this.lsi1SortKey,
      };
      attrValues = {
        ':module': { S: config.module },
        ':startTime': { S: config.startTime },
        ':endTime': { S: config.endTime },
      };
      index = this.lsi1Index;
    }

    if (config.level) {
      condition = 'PK = :module and begins_with(SK, :filter)';
      attrValues = {
        ':module': { S: config.module },
        ':filter': { S: config.level },
      };
    }

    return { condition, index, attrNames, attrValues };
  }
}

const dynamoDBHelper = new DynamoDBHelper();
export default dynamoDBHelper;

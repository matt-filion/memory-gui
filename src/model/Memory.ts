import { DynamoDBValue } from './DynamoDBValue';

export interface Memory {
  color: DynamoDBValue;
  created: DynamoDBValue;
  from: DynamoDBValue;
  id: DynamoDBValue;
  to: DynamoDBValue;
  title: DynamoDBValue;
  when: DynamoDBValue;
  content: DynamoDBValue;
}
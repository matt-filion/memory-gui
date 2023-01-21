export interface DynamoDBValue {
  S: string;
  N?: never;
  B?: never;
  SS?: never;
  NS?: never;
  BS?: never;
  M?: never;
  L?: never;
  NULL?: never;
  BOOL?: never;
  $unknown?: never;
}
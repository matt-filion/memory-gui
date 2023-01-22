import { DynamoDBValue } from './DynamoDBValue';

export interface StreamEventDynamoDB<T> {
    ApproximateCreationDateTime: number;
    Keys: {
        [key: string]: DynamoDBValue;
    },
    NewImage: T,
    OldImage: T,
    SequenceNumber: number,
    SizeBytes: number,
    StreamViewType: 'NEW_IMAGE' | string;
}
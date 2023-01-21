import { StreamEventDynamoDB } from './StreamEventDynamoDB';

export interface StreamEvent<T> {
    eventID: string;
    eventName: 'MODIFY' | string;
    eventVersion: string;
    eventSource: 'aws:dynamodb' | string;
    awsRegion: 'us-west-2' | string;
    eventSourceARN: string;
    dynamodb: StreamEventDynamoDB<T>,
}
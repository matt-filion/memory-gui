import { v5, validate } from 'uuid';
import { StreamEvent } from "../model/StreamEvent";
import { Memory } from "../model/Memory";
import { StreamEventDynamoDB } from "../model/StreamEventDynamoDB";
import { HTMLGenerator } from "../services/HTMLGenerator";
import { GUIPersistence } from "../services/GUIPersistence";

const htmlGenerator: HTMLGenerator = new HTMLGenerator();
const guiPersistence: GUIPersistence = new GUIPersistence();

export const handler = async ({ Records }: { Records: any[] }) => {
  console.log('event', JSON.stringify(Records, undefined, 2));

  await Promise.all(Records
    // TODO handle REMOVE
    /**
     * {
    "eventID": "b767aedb6dc550dfdb6a7fe6535ec0f9",
    "eventName": "REMOVE",
    "eventVersion": "1.1",
    "eventSource": "aws:dynamodb",
    "awsRegion": "us-west-2",
    "dynamodb": {
        "ApproximateCreationDateTime": 1674363139,
        "Keys": {
            "id": {
                "S": "77fa16b4-ada0-5d81-b8eb-9fbdd100ac75"
            }
        },
        "SequenceNumber": "26051700000000014517304573",
        "SizeBytes": 38,
        "StreamViewType": "NEW_IMAGE"
    },
    "eventSourceARN": "arn:aws:dynamodb:us-west-2:169568158130:table/development-memories/stream/2023-01-21T07:23:50.677"
    }
     */
    .filter((event: StreamEvent<Memory>) =>['MODIFY', 'INSERT'].includes(event.eventName))
    .map((event: StreamEvent<Memory>) => event.dynamodb)
    .filter((dynamodb: StreamEventDynamoDB<Memory>) => dynamodb.ApproximateCreationDateTime >= 1674362538)
    .map((dynamodb: StreamEventDynamoDB<Memory>) => !dynamodb.OldImage ? dynamodb.NewImage : { ...dynamodb.OldImage, ...dynamodb.NewImage })
    .filter((memory: Memory) => validate(memory.id?.S))
    .map((memory: Memory) => {
      console.log('PROCESSING.', memory);
      const { id, from, to } = memory;
      const key: string = v5(to.S, id.S);
      const document: string = htmlGenerator.generate(memory);
      console.log('Document generated for memory.', document);
      return guiPersistence.save(`${key}.html`, document, from.S, to.S);
    })
  );

  return Promise.resolve({ Body: 'ok' });
}
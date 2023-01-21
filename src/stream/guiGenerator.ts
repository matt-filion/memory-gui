import { v5 } from 'uuid';
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
    .map((event: StreamEvent<Memory>) => event.dynamodb)
    .map((dynamodb: StreamEventDynamoDB<Memory>) => dynamodb.NewImage)
    .map((memory: Memory) => {
      const { id, from, to } = memory;
      const key: string = v5(to.S, id.S);
      const document: string = htmlGenerator.generate(memory);
      console.log('Document generated for memory.', document);
      return guiPersistence.save(`${key}.html`, document, from.S, to.S);
    })
  );

  return Promise.resolve({ Body: 'ok' });
}
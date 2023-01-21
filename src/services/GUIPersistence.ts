import { PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput, S3Client} from "@aws-sdk/client-s3";

export class GUIPersistence {
  private readonly client: S3Client;

  constructor() {
    this.client = new S3Client({ region: process.env.REGION || process.env.AWS_REGION || process.env.AWS_LAMBDA_REGION });
  }

  public async save(key: string, document: string, from: string, to: string): Promise<void> {
    const request: PutObjectCommandInput = {
      Key: key,
      Bucket: process.env.HTML_BUCKET,
      Body: document,
      ContentLength: document.length,
      Metadata: {
        from,
        to,
        'Content-Type': 'text/html'
      }
    }

    console.log('Saving document.', request);

    const response: PutObjectCommandOutput = await this.client.send(new PutObjectCommand(request));

    console.log('Response', response);

    return undefined;
  }


}
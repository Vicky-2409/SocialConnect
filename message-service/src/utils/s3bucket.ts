import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { IMulterFile } from "../types/types";

export async function uploadToS3Bucket(file: IMulterFile): Promise<string> {
  try {
    if (!file) {
      throw new Error("No file uploaded");
    }

    // Initialize the S3 client with credentials and region
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Construct the file name with the folder and timestamp
    const fileName = `chat-images/${Date.now()}_${file.originalname}`;

    // Define the parameters for the PutObjectCommand
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Execute the upload command
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Return the file URL in the S3 bucket
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error: any) {
    // Throw an error with the message if the upload fails
    throw new Error(error.message);
  }
}

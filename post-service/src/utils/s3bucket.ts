import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { IMulterFile } from "./types";
import dotenv from "dotenv";

// Load environment variables
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3Bucket(file: IMulterFile): Promise<string> {
  if (!file) {
    throw new Error("No file uploaded");
  }

  const fileName = `posts/${Date.now()}_${file.originalname}`;
  const bucketName = process.env.AWS_BUCKET_NAME!;
  let uploadId: string | undefined;

  try {
    // Step 1: Initiate Multipart Upload
    const createMultipartCommand = new CreateMultipartUploadCommand({
      Bucket: bucketName,
      Key: fileName,
      ContentType: file.mimetype,
    });

    const createResponse = await s3Client.send(createMultipartCommand);
    uploadId = createResponse.UploadId;
    if (!uploadId) throw new Error("Failed to initiate multipart upload");

    // Step 2: Upload Parts
    const chunkSize = 5 * 1024 * 1024; // 5MB
    const fileStream = Readable.from(file.buffer);
    let partNumber = 1;
    let uploadedParts = [];
    let chunk;

    while (null !== (chunk = fileStream.read(chunkSize))) {
      const uploadPartCommand = new UploadPartCommand({
        Bucket: bucketName,
        Key: fileName,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: chunk,
      });

      try {
        const uploadResult = await s3Client.send(uploadPartCommand);
        uploadedParts.push({ ETag: uploadResult.ETag, PartNumber: partNumber });
        partNumber++;
      } catch (partError: any) {
        console.error(`Error uploading part ${partNumber}:`, partError.message);
        throw new Error(
          `Failed to upload part ${partNumber}: ${partError.message}`
        );
      }
    }

    // Step 3: Complete Multipart Upload
    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: bucketName,
      Key: fileName,
      UploadId: uploadId,
      MultipartUpload: { Parts: uploadedParts },
    });

    await s3Client.send(completeCommand);
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error: any) {
    if (uploadId) {
      await s3Client.send(
        new AbortMultipartUploadCommand({
          Bucket: bucketName,
          Key: fileName,
          UploadId: uploadId,
        })
      );
    }
    console.error("Upload failed:", error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

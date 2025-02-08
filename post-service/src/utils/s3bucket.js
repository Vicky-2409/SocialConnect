"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3Bucket = uploadToS3Bucket;
const client_s3_1 = require("@aws-sdk/client-s3");
const stream_1 = require("stream");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
function uploadToS3Bucket(file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file) {
            throw new Error("No file uploaded");
        }
        const fileName = `posts/${Date.now()}_${file.originalname}`;
        const bucketName = process.env.AWS_BUCKET_NAME;
        let uploadId;
        try {
            // Step 1: Initiate Multipart Upload
            const createMultipartCommand = new client_s3_1.CreateMultipartUploadCommand({
                Bucket: bucketName,
                Key: fileName,
                ContentType: file.mimetype,
            });
            const createResponse = yield s3Client.send(createMultipartCommand);
            uploadId = createResponse.UploadId;
            if (!uploadId)
                throw new Error("Failed to initiate multipart upload");
            // Step 2: Upload Parts
            const chunkSize = 5 * 1024 * 1024; // 5MB
            const fileStream = stream_1.Readable.from(file.buffer);
            let partNumber = 1;
            let uploadedParts = [];
            let chunk;
            while (null !== (chunk = fileStream.read(chunkSize))) {
                const uploadPartCommand = new client_s3_1.UploadPartCommand({
                    Bucket: bucketName,
                    Key: fileName,
                    UploadId: uploadId,
                    PartNumber: partNumber,
                    Body: chunk,
                });
                try {
                    const uploadResult = yield s3Client.send(uploadPartCommand);
                    uploadedParts.push({ ETag: uploadResult.ETag, PartNumber: partNumber });
                    partNumber++;
                }
                catch (partError) {
                    console.error(`Error uploading part ${partNumber}:`, partError.message);
                    throw new Error(`Failed to upload part ${partNumber}: ${partError.message}`);
                }
            }
            // Step 3: Complete Multipart Upload
            const completeCommand = new client_s3_1.CompleteMultipartUploadCommand({
                Bucket: bucketName,
                Key: fileName,
                UploadId: uploadId,
                MultipartUpload: { Parts: uploadedParts },
            });
            yield s3Client.send(completeCommand);
            return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        }
        catch (error) {
            if (uploadId) {
                yield s3Client.send(new client_s3_1.AbortMultipartUploadCommand({
                    Bucket: bucketName,
                    Key: fileName,
                    UploadId: uploadId,
                }));
            }
            console.error("Upload failed:", error.message);
            throw new Error(`Upload failed: ${error.message}`);
        }
    });
}

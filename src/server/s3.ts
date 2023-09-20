import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: process.env.DIGITAL_OCEAN_SPACES_URL,
  forcePathStyle: true,
  region: "nyc3",
  credentials: {
    accessKeyId: process.env.DIGITAL_OCEAN_SPACES_KEY || '',
    secretAccessKey: process.env.DIGITAL_OCEAN_SPACES_SECRET || '',
  },
});

exports.s3Client = s3Client;

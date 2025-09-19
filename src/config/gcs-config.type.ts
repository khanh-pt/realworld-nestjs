export type GcsConfig = {
  projectId: string;
  keyFilename?: string;
  bucketName: string;
  signedUrlExpires: number; // in seconds
};

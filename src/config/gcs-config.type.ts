export type GcsConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  bucketName: string;
  signedUrlExpires: number; // in seconds
};

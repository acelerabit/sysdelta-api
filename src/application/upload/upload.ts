export abstract class Uploader {
  abstract deleteImage(imageKey: string): Promise<void>;
  abstract getPublicImageUrl(imageKey: string): Promise<string>;
  abstract presignedURL(imageKey: string): Promise<string>;
  abstract uploadFilePublic(
    dataImage: any,
    folderName?: string,
  ): Promise<string>;
  abstract uploadFile(dataImage: any, folderName?: string): Promise<string>;
}

const {
  S3,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} = require('@aws-sdk/client-s3');
const {
  CloudFrontClient,
  CreateInvalidationCommand,
} = require('@aws-sdk/client-cloudfront');

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const distributionId = process.env.CDN_DISTRIBUTION_ID;

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: bucketRegion,
});

const cloudFront = new CloudFrontClient({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: bucketRegion,
});

const uploadObjectToS3 = async (objectKey, imageBuffer, file) => {
  if (!file) return null;
  try {
    if (!imageBuffer) return null;
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Body: imageBuffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    const result = await s3.send(command);
    if (result?.$metadata?.httpStatusCode === 200) {
      return objectKey;
    }
  } catch (error) {
    console.log(error.message);
  }
  return null;
};

const bulkUploadImageObjectsToS3 = async (imagesArrayBuffer, imageName = null) => {
  const uploaded = [];
  try {
    await Promise.all(
      imagesArrayBuffer.map(async (image, index) => {
        let object = null;
        if (image?.buffer && image?.fileInfo) {
          const objectName = (imageName) ? `${imageName}${index + 1}.jpeg` : image?.fileInfo?.originalname;
          object = await uploadObjectToS3(
            objectName,
            image.buffer,
            image.fileInfo
          );
          uploaded.push(object);
        }
      })
    );
  } catch (error) {}
  return uploaded;
};


const bulkUploadObjectsToS3 = async (objectsToUpload, objectPathName = null) => {
  const uploaded = [];
  try {
    await Promise.all(
      objectsToUpload.map(async (image, index) => {
        let object = null;
        if (image?.buffer && image?.originalname) {
          const objectName = (objectPathName) ? objectPathName : image?.originalname;
          object = await uploadObjectToS3(
            objectName,
            image.buffer,
            image
          );
          uploaded.push(object);
        }
      })
    );
  } catch (error) {
    console.log(error?.message);
  }
  return uploaded;
};

const getBucketObject = async (objectKey) => {
  try {
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: `${objectKey}`,
    });
    const { Body } = await s3.send(getCommand);
    console.log(Body);
  } catch (err) {
    //console.log(err);
  }
  return null;
};

const folderContents = async (folderName) => {
  try {
    const params = {
      Bucket: bucketName,
      Prefix: `${folderName}`,
    };
    const listCommand = new ListObjectsV2Command(params);
    const objects = await s3.send(listCommand);
    if (objects && objects.Contents?.length) {
      return objects.Contents;
    }
    return null;
  } catch (err) {
    console.log(err.message);
    return null;
  }
};

const deleteObjectsFromS3 = async (objectsToDelete) => {
  try {
    const params = {
      Bucket: bucketName,
      Delete: {
        Objects: objectsToDelete.map(({ Key }) => ({ Key })),
        Quiet: false,
      },
    };
    const deleteCommand = new DeleteObjectsCommand(params);
    const result = await s3.send(deleteCommand);
    if (
      result &&
      result.$metadata?.httpStatusCode === 200 &&
      result.Deleted?.length
    ) {
      return true;
    }
  } catch (error) {
    console.log(error.message);
  }
  return false;
};

const findAndDeleteFolder = async (objectKey) => {
  try {
    const contents = await folderContents(objectKey);
    if (contents !== null) {
      await deleteObjectsFromS3(contents);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const invalidateFromCDN = async (imageName) => {
  try {
    const invalidationCommand = new CreateInvalidationCommand({
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: String(new Date().getTime()),
        Paths: {
          Quantity: 1,
          Items: ['/' + imageName],
        },
      },
    });
    await cloudFront.send(invalidationCommand);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  uploadObjectToS3,
  bulkUploadObjectsToS3,
  bulkUploadImageObjectsToS3,
  getBucketObject,
  folderContents,
  deleteObjectsFromS3,
  findAndDeleteFolder,
  invalidateFromCDN,
};

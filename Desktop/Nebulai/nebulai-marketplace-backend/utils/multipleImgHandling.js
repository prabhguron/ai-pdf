const { resizeImage } = require('../lib/sharp');
const {
  invalidateFromCDN,
  bulkUploadImageObjectsToS3,
} = require('../controllers/awsController');

async function multipleImageHandling(
  user,
  model,
  category,
  field,
  newImages,
  imageType,
  updateFieldIdx = null
) {
  const profile = await model.findOne({ userId: user._id });
  let newId = category[field][category[field].length - 1]._id;
  if(updateFieldIdx && updateFieldIdx !== -1){
    newId = category[field][updateFieldIdx]._id;
  }

  let newImagesToUpload = [];
  let imagesPathsToUpdate = [];
  if (newId?._id) {
    const bucketFilePathPrefix =  `user-${user._id}/${field}/${newId._id}`;
    const fieldRecord = profile[field][0] || null;
    if(fieldRecord) {
      if(newImages?.length){
        newImages.forEach((nImg, idx) => {
          const imgName = `${bucketFilePathPrefix}/${field}-${idx + 1}.jpeg`;
          const imgObj = {...nImg, originalname: imgName}
          if(nImg.size !== 0){
            newImagesToUpload.push(imgObj);
          }
          imagesPathsToUpdate.push(imgName);
        });
      }

      if(newImagesToUpload.length){
        let imgsToUpload = await Promise.all(
          newImagesToUpload.map(async (file) => {
            if (file?.buffer) {
              const resized = await resizeImage(file.buffer, 2000, 1333);
              const { buffer, ...fileInfo } = file;
              if (resized) {
                return {
                  buffer: resized,
                  fileInfo,
                };
              }
            }
          })
        );

        imgsToUpload = imgsToUpload.filter((img) => img);
        if (imgsToUpload.length) {
          const uploadedImgs = await bulkUploadImageObjectsToS3(imgsToUpload);
          invalidateFromCDN(`${bucketFilePathPrefix}/*`);
          // const existingImageUrls = category[field]?.[newImagesToUpload] || [];
          // const urlsToRemove = existingImageUrls.filter(
          //   (url) => !uploadedImgs.includes(url)
          // );
          // TODO:
          // await deleteObjectsFromS3(urlsToRemove);
          // if (uploadedImgs.length) {
          //   imagesPathsToUpdate = [...imagesPathsToUpdate, ...uploadedImgs];
          // }
        }
      }
    }
    await model.updateOne(
      {
        userId: user._id,
        [`${field}._id`]: newId?._id,
      },
      {
        $set: {
          [`${field}.$.${imageType}`]: imagesPathsToUpdate,
        },
      }
    );
  }
  return imagesPathsToUpdate;
}

module.exports = multipleImageHandling;

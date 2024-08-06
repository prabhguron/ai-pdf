const { findAndDeleteFolder } = require('../controllers/awsController');

async function deleteElement(model, user, id, fieldName, containsImages) {
  let httpCode = 500;
  const response = {
    status: 'error',
    message: '',
  };
  const profile = await model.findOne({ userId: user._id });
  if (profile) {
    const result = await model.updateOne(
      {
        [fieldName]: {
          $elemMatch: {
            _id: id,
          },
        },
      },
      {
        $pull: {
          [fieldName]: {
            _id: id,
          },
        },
      }
    );
    if (result?.modifiedCount >= 1) {
      if (containsImages) {
        //delete images from s3 bucket
        const objectKey = `user-${user._id}/${fieldName}/${id}/`;
        findAndDeleteFolder(objectKey);
      }
      httpCode = 204;
      response.status = 'success';
      response.message = 'Deleted';
    } else {
      httpCode = 404;
      response.status = 'error';
      response.message = 'Not Found';
    }
  }
  return { httpCode, response };
}

module.exports = deleteElement;

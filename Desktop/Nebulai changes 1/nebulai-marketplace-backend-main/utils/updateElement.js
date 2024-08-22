const multipleImageHandling = require('./multipleImgHandling');

async function updateElement(req, model, fieldName) {
  const imagesFieldName = `${fieldName}Images`;
  const { user, [imagesFieldName]: images, ...updates } = req.body;
  const { id } = req.params;

  let updatedField = null;
  let updateFieldIdx = null
  const profileOne = await model.findOne({ userId: req.body.user._id, [`${fieldName}._id`]: id });
  if(profileOne && profileOne[fieldName]){
      let fieldIdx = profileOne[fieldName].findIndex(p => p._id.toString() === id);
      if(fieldIdx !== -1){
        updateFieldIdx = fieldIdx
        for(const key in updates) {
          if (profileOne[fieldName][fieldIdx][key]) {
            // Update the field in the found document
            profileOne[fieldName][fieldIdx][key] = updates[key];
          }
        }
      }

      try {
        // Save the updated document
        const updatedProfile = await profileOne.save();
        if(updatedProfile && updatedProfile[fieldName][fieldIdx]){
          updatedField = updatedProfile[fieldName][fieldIdx];
        }
      } catch (error) {
        console.log(error.message);
      }
  }

  let uploadedImages = [];
  if(images){
    uploadedImages = await multipleImageHandling(user, model, profileOne, [fieldName], images, [
      imagesFieldName,
    ], updateFieldIdx);
  }

  if(updatedField &&  updatedField[imagesFieldName]){
    updatedField[imagesFieldName] = uploadedImages
  }

  return updatedField;
}

module.exports = updateElement;

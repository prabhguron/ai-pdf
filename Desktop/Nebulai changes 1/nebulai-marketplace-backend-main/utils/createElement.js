const multipleImageHandling = require('./multipleImgHandling');

async function createElement(req, model, fieldName) {
  const imagesFieldName = `${fieldName}Images`;
  const { user, [imagesFieldName]: images, ...updates } = req.body;
  let update = {};
  for (const key in updates) {
    if (Object.hasOwnProperty.call(updates, key)) {
      const dynamicKey = `${key}`;
      update[dynamicKey] = updates[key];
    }
  }
  const profile = await model.findOneAndUpdate(
    { userId: user._id },
    { $push: { [fieldName]: update } },
    { new: true, runValidators: true }
  );
  let uploadedImages = null;
  if(images){
    uploadedImages = await multipleImageHandling(user, model, profile, [fieldName], images, [
      imagesFieldName,
    ]);
  }
  const newId = profile[fieldName][profile[fieldName].length - 1]._id;
  return {
    newId,
    images : uploadedImages || null
  };
}

module.exports = createElement;

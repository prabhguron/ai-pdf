const sharp = require('sharp');

module.exports.resizeImage = async (
  imgBuffer,
  width = 330,
  height = 300,
  format = 'jpeg'
) => {
  if (!imgBuffer) return null;
  try {
    const imageBuffer = await sharp(imgBuffer)
      .resize(width, height)
      .toFormat(format)
      .jpeg({ quality: 90 })
      .toBuffer();
    return imageBuffer;
  } catch (error) {
    console.log(error.message);
  }
  return null;
};

const flippedObj = (obj) => {
    return Object.keys(obj).reduce((acc, key) => {
        acc[obj[key]] = key;
        return acc;
    }, {});
}

const regexArray = (info) => {
  return info.split(',').map(data => new RegExp(data, 'i'));
}

module.exports = {
  flippedObj,
  regexArray
};

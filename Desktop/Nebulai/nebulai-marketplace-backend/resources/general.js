const mongoose = require("mongoose");

const getRecords = async (
  collectionName,
  fieldsToSelect,
  whereCondition,
  findOne = false
) => {
  try {
    const collection = await mongoose.connection.db.collection(collectionName);

    const projection = fieldsToSelect.reduce((obj, field) => {
      obj[field] = 1;
      return obj;
    }, {});

    let query;
    if (findOne) {
      query = collection.findOne(whereCondition, projection);
    } else {
      query = collection.find(whereCondition, projection).toArray();
    }

    const records = await query;

    return records;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

module.exports = {
  getRecords,
};

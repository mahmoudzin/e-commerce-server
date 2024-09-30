module.exports = class ModelGeneric {
  #Model;
  constructor(model) {
    this.#Model = model;
  }

  // Get all users with optional filters
  //{ref, fields}

  //config
  async getAll(
    filters = {},
    populateObj = { ref: "", fields: [] },
    sortBy = null,
    sortOrder = "asc",
    page,
    limit,
    fields
  ) {
    const query = this.#Model.find(filters);

    if (populateObj.ref) {
      query.populate(populateObj.ref, populateObj.fields);
    }
    if (sortBy) {
      query.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 });
    }

    if (page && limit) {
      //page => 11 , 15
      //20 / 5 = 4
      // page4 => 16, 20
      const skip = (page - 1) * limit;
      query.skip(skip).limit(limit);
    }

    if (fields) {
      //title,desc,price
      const selectedFields = fields.split(",").join(" "); //"["title", "desc"]"
      query.select(selectedFields);
    }
    return await query;
  }

  async create(data, populateObj = { ref: "", fields: [] }) {
    const instance = new this.#Model(data);
    return await instance.save();
  }

  // Read a user by ID
  async getById(id, populateObj = { ref: "", fields: [] }) {
    const query = this.#Model.findById(id);

    if (populateObj.ref) {
      query.populate(populateObj.ref, populateObj.fields);
    }

    return await query;
  }

  // Update a this.#Model by ID
  async update(id, data, populateObj = { ref: "", fields: [] }) {
    return await this.#Model.findByIdAndUpdate(id, data, { new: true });
  }

  // Delete a this.#Model by ID
  async delete(id) {
    return await this.#Model.findByIdAndDelete(id);
  }

  async getDoucmnetsCount() {
    return await this.#Model.countDocuments();
  }
};

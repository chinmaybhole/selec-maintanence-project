const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addSchema = new Schema(
  {
    // Schema name, Schema Structure
    template_name: {
      type: String,
      require: true,
      unique: true,
    },
    schema_structure: [Schema.Types.Mixed],
  },
  {
    timestamps: {
      type: Date,
    },
  }
);

const addTemp = mongoose.model("addTemplate", addSchema);

module.exports = { addTemp };

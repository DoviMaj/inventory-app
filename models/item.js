const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  description: { type: String, required: true, minlength: 3, maxlength: 1000 },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  img_url: { type: String, required: false },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
});

// Virtual for genre's URL
ItemSchema.virtual("url").get(function () {
  return "/catalog/category/item" + this._id;
});

module.exports = mongoose.model("Item", ItemSchema);

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  description: { type: String, required: true, minlength: 3, maxlength: 100 },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  price: { type: Number, required: true, minlength: 3, maxlength: 100 },
  number_in_stock: { type: Number, required: true },
});

// Virtual for genre's URL
ItemSchema.virtual("url").get(function () {
  return "/catalog/category/item" + this._id;
});

module.exports = mongoose.model("Item", ItemSchema);

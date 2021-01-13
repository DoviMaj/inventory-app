const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");
const async = require("async");

exports.index = function (req, res) {
  async.parallel(
    {
      item_count: function (callback) {
        Item.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      category_count: function (callback) {
        Category.countDocuments({}, callback);
      },
      item_list: function (callback) {
        Item.find({}, "img_url name category").limit(10).exec(callback);
      },
    },
    function (err, results) {
      res.render("index", {
        title: "Home",
        error: err,
        data: results,
      });
    }
  );
};

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
      category_list: function (callback) {
        Category.find({}, "name").exec(callback);
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

exports.item_create_get = async function (req, res) {
  // Get all authors and genres, which we can use for adding to our book.
  async.parallel(
    {
      category_list: function (callback) {
        Category.find({}, "name").exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("item_create", {
        title: "Create Book",
        data: results,
      });
    }
  );
};

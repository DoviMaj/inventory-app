const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");
const async = require("async");

exports.create_category_get = function (req, res, next) {
  async.parallel(
    {
      category_list: function (callback) {
        Category.find({}).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results == null) {
        // No results.
        var err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("category_create", {
        data: results,
      });
    }
  );
};

exports.get_category_items = async function (req, res, next) {
  async.parallel(
    {
      item_list: function (callback) {
        Item.find({}).exec(callback);
      },
      category_list: function (callback) {
        Category.find({}).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.item_list == null) {
        // No results.
        var err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      const item_list = results.item_list.filter(
        (item) => item.category.name === req.params.name
      );
      let data = results;
      data.item_list = item_list;
      // Successful, so render.
      console.log(item_list, "im, cat");
      res.render("index", {
        data,
      });
    }
  );
};

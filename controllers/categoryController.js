const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");
const async = require("async");

exports.get_category_items = async function (req, res, next) {
  async.parallel(
    {
      item_list: function (callback) {
        Item.find({}).exec(callback);
      },
      category_list: function (callback) {
        Category.find({}).exec(callback);
      },
      thisCategory: function (callback) {
        Category.find({ name: req.params.name }).exec(callback);
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
      const item_list = results.item_list.filter(
        (item) => item.category.name === req.params.name
      );
      let data = results;
      data.item_list = item_list;
      // Successful, so render.
      res.render("index", {
        isCategory: true,
        title: req.params.name,
        data,
      });
    }
  );
};

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

exports.category_create_post = [
  // Validate and sanitise fields.
  body("category", "Title must not be empty.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({
      name: req.body.category,
      description: req.body.description,
      _id: req.body.id,
    });

    // Get all authors and genres for form.
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
        // There are errors. Render form again with sanitized values/error messages.
        if (!errors.isEmpty()) {
          res.render("category_create", {
            data: results,
            name: req.body.category,
            description: req.body.description,
            errors: errors.array(),
          });
        } else {
          // Data from form is valid. Save .
          category.save(function (err) {
            if (err) {
              return next(err);
            }
            //successful - redirect to new category.
            res.redirect(category.url);
          });
        }
      }
    );
    return;
  },
];

exports.category_delete_post = async function (req, res, next) {
  try {
    await Category.findOneAndDelete({ name: req.params.name });
    res.redirect("/items");
  } catch (err) {
    return next(err);
  }
};

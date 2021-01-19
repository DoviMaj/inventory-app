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
        Item.find({}, "img_url name category").exec(callback);
      },
      category_list: function (callback) {
        Category.find({}, "name").exec(callback);
      },
    },
    function (err, results) {
      res.render("index", {
        title: "All",
        error: err,
        data: results,
      });
    }
  );
};

exports.item_create_get = async function (req, res) {
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
      res.render("item_form", {
        title: "New Item",
        data: results,
      });
    }
  );
};

exports.get_item_details = function (req, res, next) {
  async.parallel(
    {
      item_details: function (callback) {
        Item.findById(req.params.id).exec(callback);
      },
      category_list: function (callback) {
        Category.find({}).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.item_details == null) {
        // No results.
        var err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("item_details", {
        data: results,
      });
    }
  );
};

exports.item_create_post = [
  // Validate and sanitise fields.
  body("name", "Title must not be empty.")
    .trim()
    .isLength({ min: 3, max: 100 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 3, max: 1000 })
    .escape(),
  body(
    "number_in_stock",
    "Number in stock must not be empty and must be number."
  )
    .trim()
    .isInt()
    .isLength({ min: 3 })
    .escape(),
  body("price", "Price must not be empty and must be number.")
    .trim()
    .isInt()
    .escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Item object with escaped and trimmed data.
    const category = await Category.findOne({ _id: req.body.category });
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
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
          res.render("item_form", {
            name: req.body.name,
            description: req.body.description,
            category,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            data: results,
            errors: errors.array(),
          });
          return;
        } else {
          // Data from form is valid. Save .
          item.save(function (err) {
            if (err) {
              return next(err);
            }
            //successful - redirect to new item.
            res.redirect("/items/" + item._id);
          });
        }
      }
    );
    return;
  },
];

exports.item_delete_post = async function (req, res, next) {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect("/items");
};

exports.item_update_get = async function (req, res, next) {
  try {
    const data = {};
    data.category_list = await Category.find({});
    const item = await Item.findById(req.params.id);
    if (data !== null) {
      res.render("item_form", {
        title: "Update",
        data,
        name: item.name,
        img: item.img,
        description: item.description,
        number_in_stock: item.number_in_stock,
        price: item.price,
      });
    } else {
      var err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
};

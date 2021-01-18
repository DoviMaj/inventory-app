const express = require("express");
const router = express.Router();
const category_controller = require("../controllers/categoryController");

// /// Category ROUTES ///

// // GET request for creating a category. NOTE This must come before route that displays category (uses id).
router.get("/new", category_controller.create_category_get);

// //POST request for creating category.
router.post("/new", category_controller.category_create_post);

// // GET request for one category.
router.get("/:name", category_controller.get_category_items);

// POST request to delete category.
router.post("/:name/delete", category_controller.category_delete_post);

module.exports = router;

const express = require("express");
const router = express.Router();

// Require category controller modules.
const category_controller = require("../controllers/categoryController");

router.get("/new", category_controller.create_category_get);

router.get("/:name", category_controller.get_category_items);

module.exports = router;

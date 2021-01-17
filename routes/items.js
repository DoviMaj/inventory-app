const express = require("express");
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");

/// Items ROUTES ///

// // GET request for list of all Items.
router.get("/", item_controller.index);

// GET request for creating a Item. NOTE This must come before routes that display Item (uses id).
router.get("/new", item_controller.item_create_get);

// POST request for creating a Item.
router.post("/new", item_controller.item_create_post);

// // GET request for one Item.
router.get("/:id", item_controller.get_item_details);

// POST request to delete Item.
router.post("/:id/delete", item_controller.item_delete_post);

// //  request to delete Item.
// router.post("/:id/delete", item_controller.item_delete_post);

// // GET request to update Item.
// router.get("/:id/update", item_controller.item_update_get);

// // POST request to update Item.
// router.post("/:id/update", item_controller.item_update_post);

module.exports = router;

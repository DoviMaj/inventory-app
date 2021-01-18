const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const GridFsStorage = require("multer-gridfs-storage");
require("dotenv").config();

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

// Require controller modules.
const item_controller = require("../controllers/itemController");

/// Items ROUTES ///

// // GET request for list of all Items.
router.get("/", item_controller.index);

// GET request for creating a Item. NOTE This must come before routes that display Item (uses id).
router.get("/new", item_controller.item_create_get);

// POST request for creating and updating Item.
router.post("/new", upload.single("image"), item_controller.item_create_post);

// // GET request for one Item.
router.get("/:id", item_controller.get_item_details);

// POST request to delete Item.
router.post("/:id/delete", item_controller.item_delete_post);

// GET request to update Item.
router.get("/:id/update", item_controller.item_update_get);

module.exports = router;

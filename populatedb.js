#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require("async");
const Item = require("./models/item");
const Category = require("./models/category");

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const items = [];
const categories = [];

function categoryCreate(name, description, cb) {
  categorydetail = { name, description };
  const category = new Category(categorydetail);

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(
  name,
  description,
  category,
  img_url,
  price,
  number_in_stock,
  cb
) {
  itemdetail = {
    name,
    description,
    category,
    img_url,
    price,
    number_in_stock,
  };

  const item = new Item(itemdetail);
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          "Kitchen",
          "All thing related to cooking and prep",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Baby",
          "All things related to your baby and taking care of him",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Garden",
          "All thing related to your garden and gardening",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

// "name, description, img_url, category, price, number_in_stock",
function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate(
          "Danmu Garden Decor",
          `Danmu Garden Decor, 4pcs (Random Color) Ceramic Mushroom for Garden, Yard, Fairy Garden - Lawn Ornament Décor, Pottery Ornament 4.52" in Height`,
          categories[2],
          "https://images-na.ssl-images-amazon.com/images/I/71Q6LgTa7KL._AC_SX569_.jpg",
          9,
          23,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Cosylove Clear Cut Crystal Ball Prisms ",
          "Cosylove Clear Cut Crystal Ball Prisms Chandelier Sun Catcher Hanging Crystals Ornament, Home Garden Office Decoration with Gift Box,Christmas Wedding Pendant Purple Dreamcatcher",
          categories[2],
          "https://images-na.ssl-images-amazon.com/images/I/71tq9oezPJL._AC_SX522_.jpg",
          10,
          223,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Bird Animal Garden Statues Figurine",
          "Funny Sculpture Ornaments Décor - Best Indoor Outdoor Statues Yard Art Figurines for Patio Lawn House (Blue + Orange Bird)",
          categories[2],
          "https://images-na.ssl-images-amazon.com/images/I/61U7JGLh0fL._AC_SX522_.jpg",
          21,
          123,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Silicone Cooking Utensil Set",
          "AILUKI Kitchen Utensils 17 Pcs Cooking Utensils Set,Non-stick Heat Resistant Silicone,Cookware with Stainless Steel Handle (rose gold)",
          categories[1],
          "https://images-na.ssl-images-amazon.com/images/I/71oA3WYGW4L._AC_SX569_.jpg",
          41,
          1223,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SimpleHouseware",
          "Stackable Can Rack Organizer, Silver",
          categories[1],
          "https://images-na.ssl-images-amazon.com/images/I/915jv1h3DzL._AC_SX569_.jpg",
          41,
          1223,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Blige SMTF Cute Animal Soft Baby Socks",
          "Toys Wrist Rattles and Foot Finders for Fun Butterflies and Lady bugs Set 4 pcs",
          categories[0],
          "https://images-na.ssl-images-amazon.com/images/I/61VUQRWPZAL._SX522_.jpg",
          41,
          1223,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Simple Joys by Carter's Girls",
          "6-Piece Bodysuits (Short and Long Sleeve) and Pants Set",
          categories[0],
          "https://images-na.ssl-images-amazon.com/images/I/81kcdsSnDqL._AC_UY445_.jpg",
          41,
          1223,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "teytoy My First Soft Book",
          "Nontoxic Fabric Baby Cloth Books Early Education Toys Activity Crinkle Cloth Book for Toddler, Infants and Kids Perfect for Baby Shower -Pack of 6",
          categories[0],
          "https://images-na.ssl-images-amazon.com/images/I/714XCyNu%2BFL._AC_SX569_.jpg",
          41,
          1223,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createItems, createCategories],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("items: " + items);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);

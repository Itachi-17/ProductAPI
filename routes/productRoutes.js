const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProduct,
  postProduct,
  // addProducts,
} = require("../controllers/productController");

router.route("/").get(getAllProducts).post(postProduct);
// router.route("/addProducts").post(addProducts);
router.route("/:id").get(getProduct);

module.exports = router;

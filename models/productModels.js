const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: [true, "Please add the product price"],
    },
    rating: {
      type: Number,
      required: [true, "Please add the product rating"],
      min: 0,
      max: 5,
    },
    stock: {
      type: Number,
      required: [true, "Please add the stock quantity"],
    },
    discount: {
      type: Number,
      required: [true, "Please add the discount percentage"],
    },
    release_date: {
      type: Date,
      required: [true, "Please add the release date"],
    },
    color: {
      type: String,
      required: [true, "Please add the product color"],
    },
    warranty: {
      type: String,
      required: [true, "Please add the warranty information"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);

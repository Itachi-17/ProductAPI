const asyncHandler = require("express-async-handler");
const Products = require("../models/productModels");

// Get all products with query parameters, sorting, and pagination
const getAllProducts = asyncHandler(async (req, res) => {
  const queryObject = {};

  // Extract query parameters and add them to the query object if they exist
  const {
    category,
    company,
    name,
    featured,
    price,
    rating,
    stock,
    discount,
    release_date,
    color,
    warranty,
    sort,
    select,
    page = 1,
    limit = 10,
  } = req.query;

  if (category) queryObject.category = category;
  if (company) queryObject.company = company;
  if (name) queryObject.name = name;
  if (featured !== undefined) queryObject.featured = featured === "true";
  if (price) queryObject.price = price;
  if (rating) queryObject.rating = rating;
  if (stock) queryObject.stock = stock;
  if (discount) queryObject.discount = discount;
  if (release_date) queryObject.release_date = release_date;
  if (color) queryObject.color = color;
  if (warranty) queryObject.warranty = warranty;

  let sortCriteria = { name: 1 }; // Default sort
  let selectCriteria = "";
  if (select) {
    selectCriteria = select.split(",").join(" ");
  }

  if (sort) {
    const sortFields = sort.split(",");
    if (
      sortFields.length === 2 &&
      (sortFields[1] === "asc" || sortFields[1] === "desc")
    ) {
      sortCriteria = { [sortFields[0]]: sortFields[1] === "desc" ? -1 : 1 };
    } else {
      // Handle multiple fields and default to ascending if no valid order is specified
      sortCriteria = sortFields.reduce((acc, field) => {
        const [key, order] = field.split(" ");
        acc[key] = order === "desc" ? -1 : 1;
        return acc;
      }, {});
    }
  }

  // Calculate skip value for pagination
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const products = await Products.find(queryObject)
    .sort(sortCriteria)
    .select(selectCriteria)
    .skip(skip)
    .limit(limitNumber);

  const totalProducts = await Products.countDocuments(queryObject);

  res.status(200).json({
    total: totalProducts,
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(totalProducts / limitNumber),
    products,
  });
});

// Get a single product by ID
const getProduct = asyncHandler(async (req, res) => {
  const product = await Products.findById(req.params.id);
  if (!product) {
    res.status(404).json({ Error: "Product not found" });
  } else {
    res.status(200).json(product);
  }
});

// Add a new product (Admin only)
const postProduct = asyncHandler(async (req, res) => {
  const {
    category,
    company,
    name,
    description,
    featured,
    price,
    rating,
    stock,
    discount,
    release_date,
    color,
    warranty,
  } = req.body;

  if (
    !category ||
    !company ||
    !name ||
    !description ||
    featured === undefined ||
    !price ||
    !rating ||
    !stock ||
    !discount ||
    !release_date ||
    !color ||
    !warranty
  ) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const productExists = await Products.findOne({ category, name, company });
  if (productExists) {
    res.status(400);
    throw new Error("Product already exists!!!");
  }

  const product = await Products.create({
    category,
    company,
    name,
    description,
    featured,
    price,
    rating,
    stock,
    discount,
    release_date,
    color,
    warranty,
  });

  res.status(201).json({ message: "Product added successfully", product });
});

// Update a product by ID (Admin and Manager roles)
const putProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    category,
    company,
    name,
    description,
    featured,
    price,
    rating,
    stock,
    discount,
    release_date,
    color,
    warranty,
  } = req.body;

  const product = await Products.findByIdAndUpdate(
    id,
    {
      category,
      company,
      name,
      description,
      featured,
      price,
      rating,
      stock,
      discount,
      release_date,
      color,
      warranty,
    },
    { new: true, runValidators: true }
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json(product);
});

// Delete a product by ID (Admin only)
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Products.findByIdAndDelete(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({ message: "Product deleted successfully" });
});

module.exports = {
  getAllProducts,
  getProduct,
  postProduct,
  putProduct,
  deleteProduct,
};

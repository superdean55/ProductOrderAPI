import db from "../models/index.js";
import { APIError } from "../utils/APIError.js";
import { successResponse } from "../utils/response.js";
import { logger } from "../utils/logger.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/cloudinaryService.js";
import validator from "validator";

const { Product } = db;

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();

    if (!products || products.length === 0) {
      logger.info("No products found in database");
      return successResponse(res, "No products found", [], 200);
    }

    logger.info(`Fetched ${products.length} products from database`);
    successResponse(res, "Products fetched successfully", {products}, 200);
  } catch (err) {
    next(
      new APIError("Failed to fetch products from the database", 500, null, err)
    );
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !validator.isUUID(id, 4))
      throw new APIError(
        "Product ID is required and must be a valid number",
        400
      );

    const product = await Product.findByPk(id);

    if (!product) throw new APIError("Product not found", 404);

    logger.info(`Fetched product [id=${id}] successfully`);
    successResponse(res, "Product fetched successfully", { product }, 200);
  } catch (err) {
    if (err instanceof APIError) return next(err);
    next(
      new APIError("Failed to fetch product from the database", 500, null, err)
    );
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock } = req.body;
    let imageId = null;
    let imageUrl = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: "products",
      });
      imageId = result.public_id;
      imageUrl = result.secure_url;
    }

    let product;
    try {
      product = await Product.create({
        name,
        description,
        price,
        stock,
        imageId,
        imageUrl,
      });
    } catch (dbError) {
      if (imageId) {
        await deleteFromCloudinary(imageId);
      }
      throw new APIError(
        "Failed to save product data to the database",
        500,
        null,
        dbError
      );
    }

    logger.info(`User [id=${req.user.id}] created Product [id=${product.id}]`);

    successResponse(res, "Product created successfully", { product }, 201);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !validator.isUUID(id, 4))
      throw new APIError("Product ID is required", 400);

    const product = await Product.findByPk(id);
    if (!product) throw new APIError("Product not found", 404);

    const { name, description, price, stock } = req.body;
    await product.update({
      name: name ?? product.name,
      description: description ?? product.description,
      price: price ?? product.price,
      stock: stock ?? product.stock,
    });

    logger.info(`Product [id=${id}] updated by user [id=${req.user.id}]`);
    successResponse(res, "Product updated successfully", { product }, 200);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) return next(new APIError("Product not found", 404));

    if (product.imageId) await deleteFromCloudinary(product.imageId);

    await product.destroy();

    logger.info(
      `Product deleted successfully (id: ${product.id}) by user ${
        req.user?.id || "unknown"
      }`
    );
    return successResponse(res, "Product deleted successfully", null, 200);
  } catch (err) {
    return next(new APIError("Failed to delete product", 500, null, err));
  }
};

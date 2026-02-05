import cloudinary from "../config/cloudinary.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

export async function createProduct(req, res) {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: "All feilds are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At Least one image is required " });
    }

    if (req.files.length > 3) {
      return res.status(400).json({ message: "max 3 images are allowed " });
    }

    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
    });

    const uploadResults = await Promise.all(uploadPromises);

    // secure url
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: imageUrls,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllProducts(_, res) {
  try {
    const products = (await Product.find()).Sort({ createdAt: -1 }); //-1 means decending(most recents one)
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching product", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProducts(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);
    if (category) product.category = category;

    // handling images updates if new images are uplaoded
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ message: "max 3 images are allowed " });
      }
    }

    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
    });

    const uploadResults = await Promise.all(uploadPromises);
    product.images = uploadResults.map((result) => result.secure_url);

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error in getAllorders controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["pending", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ error: "invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    order.status = status;

    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    }

    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    res
      .status(200)
      .json({ message: "order status updated succcessfully", order });
  } catch (error) {
    console.error("Error in updatingorderstatus controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllCustomers(_, res) {
  try {
    const customers = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching customer", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getDashboardStats(_, res) {
  try {
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      +{
        $group: {
          _id: null,
          total: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

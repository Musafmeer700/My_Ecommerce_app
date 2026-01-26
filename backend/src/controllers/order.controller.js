import { Order } from "../models/oder.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createOrders(req, res) {
  try {
    const user = req.user;
    const {orderItems, shippingAddress, paymentResult, totalPrice} = req.body

    if (!orderItems || orderItems.length === 0){
        return res.status(400).json({error: "No order items"});
    }

    // validate product and stock
    for(const item of orderItems){
        const product = await Product.findById(item.product._id);
        if(!product){
            return res.status(400).json({error: `Product ${item.name} not found`});
        }

        if (product.stock < item.quantity){
            return res.status(400).json({error: `Insufficent stock for ${product.name}`});
        }
    }

    const order = await Order.create({
        user: user._id,
        clerkId: user.clerkId,
        orderItems,
        shippingAddress,
        paymentResult,
        totalPrice
    });

    // update product stock
    for(const item of orderItems){
        await Product.findByIdAndUpdate(item.product._id, {
            $inc: {stock: -item.quantity},
        });
    }

    res.status(201).json({message: "order created successfully", order});

  } catch (error) {
    console.error("Error in createOrder controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getOrders(req, res) {
  try {
    const orders = await Order.find({clerkId: req.user.clerkId}).populate("orderItems.product").sort({createdAt: -1})

    // check if each order is reviewed
    const orderWithReviewStatus  = await Promise.all(
        orders.map(async (order) => {
            const review  = await Review.findOne({ orderId: order._id});
            return {
                ...order.toObject(),
                hasReviewed: !!review,
            };
        })
    );

    res.status(200).json({orders: orderWithReviewStatus});


  } catch (error) {
    console.error("Error in getUserOrders controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

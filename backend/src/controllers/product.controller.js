import { Product } from "../models/product.model.js";

export async function getProductsById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if(!product){
        return res.status(404).json({message: "product not found"});
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductsById controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

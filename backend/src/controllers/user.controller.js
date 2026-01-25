import { User } from "../models/user.model.js";

export async function addAddress(req, res) {
    try {
        const {label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault} = req.body;
        const user = req.user;

        if(!fullName || !streetAddress || !city || !state || !zipCode){
            return res.status(400).json({message: "Missing required Feilds"});
        }

        // this unset all other addresses from default to non default 
        if(isDefault){
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }

        user.addresses.push({
            label,
            fullName,
            streetAddress,
            city,
            state,
            zipCode,
            phoneNumber,
            isDefault: isDefault || false
        })

        await user.save();

        res.status(200).json({message: "address added succesfully", addresses: user.addresses});

    } catch (error) {
        console.error("Errro in addAdress controller:", error);
        res.status(500).json({error: "internal server errror"});
    }
}

export async function getAddresses(req, res) {
    try {
        const user = req.user;
        return res.status(200).json({addresses: user.addresses});
    } catch (error) {
        console.error("Error in fetching user addresses:", error);
        res.status(500).json({error: "internal server errror"});
    }
}

export async function updateAddress(req, res) {
    try {
        const {label, fullName, streetAddress, city, state, zipCode, phoneNumber, isDefault} = req.body;
        const {addressId} = req.params;
        const user = req.user;

        const address = user.addresses.id(addressId)
        if(!address){
            return res.status(404).json({error: "Address not found"});
        }

        // this unset all other addresses from default to non default 
        if(isDefault){
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }

        address.label = label || address.label;
        address.fullName = fullName || address.fullName;
        address.streetAddress = streetAddress || address.streetAddress;
        address.city = city || address.city;
        address.state = state || address.state;
        address.zipCode = zipCode || address.zipCode;
        address.phoneNumber = phoneNumber || address.phoneNumber;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        await user.save()

        res.status(200).json({message: "Adress updated succfylly", addresses: user.addresses});
    } catch (error) {
        console.error("Error in updating user addresses:", error);
        res.status(500).json({error: "internal server errror"});
    }
}

export async function deleteAddress(req, res) {
    try {
        const {addressId} = req.params;
        const user = req.user;

        user.addresses.pull(addressId);
        await user.save()

        res.status(200).json({message: "address deleted successfully", addresses: user.addresses})
    } catch (error) {
        console.error("Error in deleteAddress controller:", error);
        res.status(500).json({error: "internal server errror"});
    }
}

export async function addToWishlist(req, res) {
    try {
        const {productId} = req.body;
        const user = req.user;

        // check if the product is already in wishlist
        const hasProduct = user.wishlist.some(
            (id) => id?.equals?.(productId) || String(id) === String(productId)
        );
        if(hasProduct){
             return res.status(400).json({error: "product already in the wishlist"});
         }

        user.wishlist.push(productId)
        await user.save()

        res.status(200).json({message: "product added to wishlist", wishlist: user.wishlist})

    } catch (error) {
        console.error("Error in adding product to wishlist:", error);
        res.status(500).json({error: "internal server errror"});
    }
}

export async function removeFromWishlist(req, res) {
    try {
        const {productId} = req.params;
        const user = req.user;

        // check if the product is already in wishlist
        const hasProduct = user.wishlist.some(
            (id) => id?.equals?.(productId) || String(id) === String(productId)
        );
        if(!hasProduct){
             return res.status(400).json({error: "product is not even in the wishlist"});
         }

        user.wishlist.pull(productId);
        await user.save();

        res.status(200).json({message: "product added to wishlist", wishlist: user.wishlist})

    } catch (error) {
        console.error("Error in deleting product from wishlist:", error);
        res.status(500).json({error: "internal server errror"});
    }
}

export async function getWishlist(req, res) {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");
        res.status(200).json({wishlist: user.wishlist})
    } catch (error) {
        console.error("Error in fetching product from wishlist:", error);
        res.status(500).json({error: "internal server errror"});
    }
}


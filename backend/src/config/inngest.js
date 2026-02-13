import { Inngest } from "inngest"
import { connectDB } from "./db.js"
import { User } from "../models/user.model.js"

export const inngest = new Inngest({
    id: "ecommerce-app"
})

const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        try {
            await connectDB();
            
            const { id, email_addresses, first_name, last_name, image_url } = event.data;

            const email = email_addresses?.[0]?.email_address;
            if (!email) {
                console.error(`No email found for clerkId ${id}`);
                // Don't retry — this won't resolve on its own
                return { message: "No email address provided, skipping user creation" };
            }
            
            // 1. Check if user already exists to avoid duplicate errors
            const existingUser = await User.findOne({ clerkId: id });
            if (existingUser) {
                console.log(`User with clerkId ${id} already exists.`);
                return { message: "User already exists" };
            }

            // 2. Prepare the user object
            const newUser = {
                clerkId: id, 
                email: email_addresses[0]?.email_address,
                name: first_name ? `${first_name} ${last_name || ""}`.trim() : "User",
                imageUrl: image_url,
                addresses: [],
                wishlist: []
            };

            // 3. Save to MongoDB
            const savedUser = await User.create(newUser);
            return { message: "User created successfully", userId: savedUser._id };

        } catch (error) {
            console.error("Error in sync-user function:", error);
            // Throwing the error lets Inngest know the function failed so it can retry
            throw new Error(`Failed to sync user: ${error.message}`);
        }
    }
);

const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user-from-db" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        try {
            await connectDB();
            const { id } = event.data;
            
            const result = await User.deleteOne({ clerkId: id });
            return { message: "User deleted successfully", count: result.deletedCount };
            
        } catch (error) {
            console.error("Error in delete-user function:", error);
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }
)

export const functions = [syncUser, deleteUserFromDB]
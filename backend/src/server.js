import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from 'inngest/express';
import { functions, inngest } from './config/inngest.js';


import adminRoutes from "./routes/admin.route.js"
import userRoutes from "./routes/user.route.js"



const app = express();

const __dirname = path.resolve();

//middlewares
app.use(clerkMiddleware()) //it add req.auth to request
app.use(express.json())


app.use("/api/inngest", serve({client: inngest, functions}));
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);


//testing
app.get("/api/health", (req, res) => {
    res.status(200).json({message: "success"});
});


if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../admin/dist")));

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"))
    });
}

app.listen(ENV.PORT, () => {
    console.log("server is running 123332");
    connectDB();
});



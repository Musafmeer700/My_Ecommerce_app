import express from 'express'


const app = express()

app.listen(3000, () => console.log("server is running 123332"));

app.get("/api/health", (req, res) => {
    res.status(200).json({message: "success"})
})
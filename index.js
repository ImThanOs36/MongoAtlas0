const express = require("express");
const app = express();
const cors = require('cors')
app.use(express.json(),cors({origin:"https://mongo-atlas-frontend.vercel.app"}));
const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const dotenv = require('dotenv');
dotenv.config();
const PORT = 5000;


mongoose.connect(process.env.MONGO_CONNECTION);
const cnx = mongoose.connection;

const UserSchema = new Schema({
    name: { type: String },
});
const User = mongoose.model("users", UserSchema);

if (cnx) {
    console.log("connection sucessfully");
}

app.get("/", async (req, res) => {
    let data = await User.find({ name: "ThanOs" });
    res.json({ msg: "Working Properly", name: data });
});
app.post("/add", async (req, res) => {
    let name = req.body.name;

    const newUser = await new User({ name: "ThanOs" });
    newUser.save();
    res.json("user created..");
});
app.put("/modify", async (req, res) => {
    let target = await User.findOne({ name: req.body.name });
    if (target) {
        let update = await User.findOneAndUpdate(
            { name: req.body.name },
            { name: req.body.modName }
        );
        res.json({ modified: await User.findOne({ name: req.body.modName }) });
    }
});
app.delete("/delete", async (req, res) => {
    let response = await User.deleteMany({ name: req.body.name });
    res.json({ msg: "Deleted Sucessfully" });
});
app.listen(PORT, () => {
    console.log("app is running on http://localhost:5000");
});

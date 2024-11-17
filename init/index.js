const mongoose =  require("mongoose");
const initData =  require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/exploration";

main()
.then(()=>{
    console.log("connectred to Db");
})
.catch((err) =>{
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
await Listing.deleteMany({});
initData.data = initData.data.map((obj)=>({ ...obj, owner:"670fe28a88f22d3ad44c5474"}));
await Listing.insertMany(initData.data);
console.log("data was initialized");
}

initDB();
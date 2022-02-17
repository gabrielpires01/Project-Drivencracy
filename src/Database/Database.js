import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
	db = mongoClient.db("drivencracy")
})

export {db}
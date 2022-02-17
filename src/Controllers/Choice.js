import { ObjectId } from "mongodb";
import { db } from "../Database/Database.js";

const PostChoice = async (req,res) => {
	const {title,poolId} = req.body;
	let pool;
	let choices;
	try {
		pool = await db.collection('pools').findOne({_id:new ObjectId(poolId)})
		choices = await db.collection('choices').find({poolId}).toArray()

	} catch(err) {
		console.error(err)
		return 
	}

	const today= new Date();
	const todayFormat = `${today.toISOString().split('T')[0]} ${today.toTimeString().split(' ')[0].slice(0,5)}`
	
	if (!pool) return res.sendStatus(404);
	if (todayFormat > pool.expireAt) return res.sendStatus(403)
	if (!title) return res.sendStatus(422);

	const exist = choices.find(choice => choice.title === title)
	if(exist) return res.sendStatus(409)

	try {
		const choice = await db.collection('choices').insertOne({title,poolId})
		return res.send(choice).sendStatus(201)
	} catch (err) {
		return console.error(err)
	}
};

const GetChoices = async(req,res) => {
	const {id} = req.params;
	try {
		const pool = await db.collection('pools').findOne({_id:new ObjectId(id)})
		if (!pool) return res.sendStatus(404)
	} catch (err) {
		console.error(err)
		return 
	}
	try {
		const choices = await db.collection('choices').find({poolId: id}).toArray();
		return res.send(choices)
	}catch(err) {
		console.error(err)
		return 
	}
};

export {PostChoice, GetChoices};
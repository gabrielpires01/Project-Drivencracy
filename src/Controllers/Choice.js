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
		console.error(err)
		return res.send(err)
	}
};

const GetChoices = async(req,res) => {
	const {id} = req.params;
	try {
		const pool = await db.collection('pools').findOne({_id:new ObjectId(id)})
		if (!pool) return res.sendStatus(404)
	} catch (err) {
		console.error(err)
		return res.sendStatus(400)
	}
	try {
		const choices = await db.collection('choices').find({poolId: id}).toArray();
		return res.send(choices)
	}catch(err) {
		console.error(err)
		return res.send(err)
	}
};

const PostVote = async(req,res) => {
	const {id} = req.params;
	let choice;
	let pool;
	const today= new Date();
	const todayFormat = `${today.toISOString().split('T')[0]} ${today.toTimeString().split(' ')[0].slice(0,5)}`
	try {
		choice = await db.collection('choices').findOne({_id:new ObjectId(id)});
		if (!choice) return res.sendStatus(404);
		
		pool = await db.collection('pools').findOne({_id: new ObjectId(choice.poolId)})
		if (today > todayFormat) return res.sendStatus(403)

		await db.collection('votes').insertOne({date:todayFormat, choice_id:choice._id, pool_id:pool._id})
		return res.sendStatus(201)
	}catch(err) {
		console.error(err)
		return res.send(err)
	}
}

export {PostChoice, GetChoices, PostVote};
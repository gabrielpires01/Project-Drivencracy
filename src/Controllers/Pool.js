import { ObjectId } from "mongodb";
import { db } from "../Database/Database.js";

const PostPool = async (req,res) => {
	let {title, expireAt} = req.body;
	if (!title) return res.sendStatus(422)
	if(!expireAt)  {
		const today	= new Date();
		let newExpire = new Date().setDate(today.getDate() + 30)
		newExpire = new Date(newExpire);
		const date = newExpire.toISOString().split('T')[0];
		const time = newExpire.toTimeString().split(' ')[0].slice(0,5);
		expireAt = `${date} ${time}`
	}

	try {
		await db.collection("pools").insertOne({title,expireAt})
		return res.sendStatus(201)
	} catch(err) {
		console.error(err)
		return res.send(err)
	}

};

const GetPools = async (req,res) => {
	try {
		const pools = await db.collection('pools').find().toArray();
		return res.send(pools)
	} catch(err) {
		console.error(err)
		return res.send(err)
	}
}

const GetPoolResults = async(req,res) => {
	const {id} = req.params;
	let choices;
	try {
		choices = await db.collection('choices').find({poolId: id}).toArray();
		const mostVoted = await CountVotes(choices);
		const pool = await db.collection('pools').findOne({_id:new ObjectId(id)})
		const results = {
			...pool,
			result: mostVoted
		}
		return res.send(results)
	}catch(err) {
		console.error(err)
		return res.send(err)
	}
};

const CountVotes = async (arrChoic) => {
	const voteArr = await Promise.all(arrChoic.map(async (choice) => {
		let vote;
		try {
			vote = await db.collection('votes').find({choice_id: choice._id}).toArray();
			return {title: choice.title, votes: vote.length}
		} catch(err) {
			console.error(err)
			return res.send(err)
		}
	}))

	const max = voteArr.reduce((prev,curr) => {
		return (prev.votes > curr.votes) ? prev : curr
	})
	return max
}

export {PostPool, GetPools, GetPoolResults}
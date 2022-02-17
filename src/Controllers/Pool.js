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
		return res.sendStatus(err)
	}

};

const GetPools = async (req,res) => {
	try {
		const pools = await db.collection('pools').find().toArray();
		return res.send(pools)
	} catch(err) {
		return res.sendStatus(err)
	}
}

export {PostPool, GetPools}
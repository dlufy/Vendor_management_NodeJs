const { MongoClient, ObjectId } = require("mongodb");
const uri =
	"mongodb+srv://taskapp:ajay@5161@cluster0-b0zlr.mongodb.net/workflowDB?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const DB = async () => {
	await client.connect();
	return client;
};

const insertWorkFlowDB = async (newWorkflow) => {
	newWorkflow.cur_lvl = 0;
	//0 means currently Active
	//1 means approved
	//2 terminated
	newWorkflow.cur_status = 0;
	const result = await client
		.db("workflowDB")
		.collection("workflow")
		.insertOne(newWorkflow);

	const objID = result.ops[0]._id;
	//make the request for the first level
	if (newWorkflow.data[0].type === "sequential") {
		const request = { id: objID, lvl: 0, index: 0 };
		await insertRequest(newWorkflow.data[0].data[0][0], request);
	} else {
		await sendRequest(newWorkflow, 0, objID);
	}
	return objID;
};

const sendRequest = async (newWorkflow, lvl, objID) => {
	let i = 0;
	for (approver of newWorkflow.data[lvl].data) {
		const request = { id: objID, lvl: lvl, index: i };
		i += 1;
		await insertRequest(approver[0], request);
	}
};

const getWorkFlowByID = async (id) => {
	const result = await client
		.db("workflowDB")
		.collection("workflow")
		.findOne({ _id: ObjectId(id) });
	return result;
};

const updateWorkflow = async (id, workflow) => {
	const result = await client
		.db("workflowDB")
		.collection("workflow")
		.replaceOne({ _id: ObjectId(id) }, workflow);
	return result.ops;
};

const saveRequest = async (approver, data) => {
	if (DBG) console.log(`connect saveRequest ${approver}`);
	const reqID = data._id;
	delete data._id;
	delete data.approver;
	const result = await client
		.db("workflowDB")
		.collection(approver)
		.replaceOne({ _id: ObjectId(reqID) }, data);
	return result.ops;
};
const insertRequest = async (approver, request) => {
	const result = await client
		.db("workflowDB")
		.collection(approver)
		.insertOne(request);
	return result.id;
};

const getRequestByID = async (approver) => {
	if (DBG) console.log(`data from ${approver}`);
	const result = client.db("workflowDB").collection(approver).find({});
	const resArr = await result.toArray();

	return resArr;
};

const getRequestByIDFromApprover = async (approver, id) => {
	const result = await client
		.db("workflowDB")
		.collection(approver)
		.findOne({ _id: ObjectId(id) });
	return result;
};
const createApprover = async (name) => {};
module.exports = {
	DB,
	insertWorkFlowDB,
	insertRequest,
	createApprover,
	getWorkFlowByID,
	getRequestByID,
	updateWorkflow,
	sendRequest,
	getRequestByIDFromApprover,
	saveRequest,
};

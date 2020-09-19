//data layer API
const {
	insertWorkFlowDB,
	insertRequest,
	createApprover,
	getWorkFlowByID,
	getRequestByID,
	updateWorkflow,
	sendRequest,
	getRequestByIDFromApprover,
	saveRequest,
} = require("./../db/connect");

const { status, DBG } = require("./../helper/const");
const getMyApprovals = async (id) => {
	if (DBG) {
		console.log("getMyApprovals");
		console.log(id);
	}
	const result = await getRequestByID(id);
	if (DBG) console.log(result);
	return result;
};

const approve = async (data) => {
	if (DBG) {
		console.log("workflow approve");
		console.log(data);
	}

	//check if already processed the request or not
	const myRequest = await getRequestByIDFromApprover(data.approver, data._id);
	if (myRequest.response) {
		return { error: "already approved" };
	}
	await saveRequest(data.approver, data);

	const workflow = await getWorkFlowByID(data.id);
	if (workflow.cur_lvl > data.lvl) {
		return {};
	}
	if (workflow.cur_status === 0) {
		workflow.data[data.lvl].data[data.index][1] = data.response;

		if (data.response === status.REJECTED) {
			if (workflow.data[data.lvl].type !== "any-one") {
				//workflow terminated
				workflow.cur_status = 2;
			}
		}

		let numResponses = 0;
		let numRejected = 0;
		let numApproved = 0;
		let prev_lvl = workflow.cur_lvl;
		workflow.data[data.lvl].data.forEach((element) => {
			if (element[1] !== -1) numResponses += 1;

			if (element[1] === 0) numRejected += 1;
			if (element[1] === 1) numApproved += 1;
		});

		if (numResponses === workflow.data[data.lvl].data.length) {
			if (workflow.data[data.lvl].type === "any-one") {
				if (numApproved > 0) workflow.cur_lvl += 1;
				else workflow.cur_status = 2;
			} else {
				if (numRejected > 0) workflow.cur_status = 2;
				else workflow.cur_lvl += 1;
			}
		} else {
			if (
				workflow.data[data.lvl].type === "any-one" &&
				data.response === status.APPROVED
			) {
				workflow.cur_lvl += 1;
			}
		}
		// if all levels as sucessfully completed then mark the status as Approved
		if (
			workflow.cur_status === 0 &&
			workflow.cur_lvl === workflow.data.length
		) {
			workflow.cur_status = 1;
			await updateWorkflow(data.id, workflow);
		} else if (
			workflow.cur_status === 0 &&
			workflow.cur_lvl < workflow.data.length
		) {
			await updateWorkflow(data.id, workflow);
			// if level is not changed then process the new request
			if (prev_lvl === workflow.cur_lvl) {
				if (workflow.data[prev_lvl].type === "sequential") {
					const request = {
						id: data.id,
						lvl: data.lvl,
						index: data.index + 1,
					};
					insertRequest(
						workflow.data[data.lvl].data[data.index + 1][0],
						request,
					);
				}
			} else {
				//new next level so sending reuqest to all(except in case sequential)
				if (workflow.data[workflow.cur_lvl].type === "sequential") {
					if (DBG) console.log("workflow : sequential, next request sent");
					const request = { id: data.id, lvl: workflow.cur_lvl, index: 0 };
					await insertRequest(workflow.data[0].data[0][0], request);
				} else {
					if (DBG) console.log("workflow : move to next level");
					await sendRequest(workflow, workflow.cur_lvl, data.id);
				}
			}
		} else {
			await updateWorkflow(data.id, workflow);
		}
	} else return { msg: "no update" };
};

const insertWorkFlow = async (data) => {
	if (DBG) {
		console.log("insertWorkFlow");
		console.log(data);
	}
	const result = await insertWorkFlowDB(data);
	return result;
};

const createNewApprover = async (name) => {
	if (DBG) console.log("createApprover");
	const result = await createApprover(name);
	return result;
};
const getStatus = async (id) => {
	if (DBG) console.log("getStatus ", id);
	const result = await getWorkFlowByID(id);
	return result;
};
module.exports = {
	getMyApprovals,
	approve,
	insertWorkFlow,
	createNewApprover,
	getStatus,
};

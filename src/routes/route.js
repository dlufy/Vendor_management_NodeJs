const express = require("express");
const router = express.Router();
const { DBG } = require("./../helper/const");

//business logic
const {
	getMyApprovals,
	approve,
	insertWorkFlow,
	createNewApprover,
	getStatus,
} = require("./../model/workflow");

//routes
router.get("/", (req, res) => {
	res.send({ msg: "welcome to our workflow manager" });
});

router.post("/createWorkFlow", async (req, res) => {
	if (DBG) console.log(req.body);
	const response = await insertWorkFlow(req.body);
	res.send({ msg: "sucess", response: response });
});

router.get("/:id", async (req, res) => {
	if (DBG) console.log(req.params.id);
	const result = await getStatus(req.params.id);
	if (result.cur_status === 0) {
		result.status = "Active";
	} else if (result.cur_status === 1) {
		result.cur_status = "Approved";
	} else {
		result.cur_status = "Terminated";
	}
	res.send(result);
});

router.post("/approve", async (req, res) => {
	if (DBG) console.log(req.body);
	const response = await approve(req.body);
	res.send({ msg: "sucess", res: response });
});

router.post("/createApprover", async (req, res) => {
	if (req.body.name) {
		const id = await createNewApprover(req.body.name);
		res.send({ name: req.body.name, id: id });
	} else res.send({ msg: "please provide a property name 'name'" });
});

router.get("/getMyApprovalRequest/:id", async (req, res) => {
	const request = await getMyApprovals(req.params.id);
	res.send(request);
});

module.exports = router;

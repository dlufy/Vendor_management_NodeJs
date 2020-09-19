const status = {
	NO_ACTION: -1,
	REJECTED: 0,
	APPROVED: 1,
	REJECTED_AND_APPROVED: 2,
};
Object.freeze(status);
const DBG = 1;
module.exports = { status, DBG };

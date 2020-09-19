const express = require("express");
const router = require("./routes/route");
const logger = require("morgan");
const { DB } = require("./db/connect");

const bodyParser = require("body-parser");
const isServerRunning = true;
const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
	if (isServerRunning) next();
	else res.send({ msg: "server is dead" });
});

//router paths
app.use(router);

//start the server at port : 3444
app.listen(3444, async () => {
	const client = await DB();
	if (client) {
		console.log("server is running and DB is connect");
	} else {
		isServerRunning = false;
		console.log("shutting Down the server, DB is not connected");
	}
});

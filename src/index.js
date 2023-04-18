require('dotenv').config();
var fileupload = require("express-fileupload");
const path = require("path");
const cors = require("cors")
const { restRouter } = require("./api");
const config = require("./config").data
const appManager = require("./app")

require("./errors")

global.appRoot = path.resolve(__dirname);

const PORT = config.app.port;
const app = appManager.setup(config);

/*cors handling*/
app.use(
  cors({
    origin: true,
    credentials: true,
    optionSuccessStatus: 200,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
  })
);

app.use(fileupload());

/* Route handling */
app.use("/api", restRouter);
// app.use('/', webRouter);

app.use((req, res, next) => {
  next(new RequestError("Invalid route", 404));
});

app.use((error, req, res, next) => {
  if (!(error instanceof RequestError)) {
    error = new RequestError("Some Error Occurred", 500, error.message);
  }
  error.status = error.status || 500;
  res.status(error.status);
  let contype = req.headers["content-type"];
  var json = !(!contype || contype.indexOf("application/json") !== 0);
  if (json) {
    return res.json({ errors: error.errorList });
  } else {
    res.render(error.status.toString(), { layout: null });
  }
});

/* Start Listening service */
app.listen(PORT, () => {

  config.db.client.connect((err) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Crafts DB connected");
    }
  });
  console.log(`Server is running at PORT http://localhost:${PORT}`);
});


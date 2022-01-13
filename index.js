let express = require("express");
let cors = require("cors");

let serverRouter = require("./routes");

const app = express();
const PORT = 8080;

let path = require("path");
let rutahtml = path.join(__dirname, "views");
app.use(express.static(rutahtml));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

serverRouter(app);

//serverRouter(app);

app.use(cors("*"));
app.listen(PORT, () => {
  console.log(`Conectado a http://localhost:${PORT}`);
});

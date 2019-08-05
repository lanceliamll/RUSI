const express = require("express");
const connectDB = require("./config/db");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
//Socket IO
//const http = require("http");
// const socketIO = require("socket.io");
// const server = http.createServer(app);
// const io = socketIO(server);

//Connect to DB
connectDB();

//Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());

//Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/motors", require("./routes/api/motors"));
app.use("/api/inquiry", require("./routes/api/inquiry"));

//Serve Static Assets (Production)
if (process.env.NODE_ENV === "production") {
  // Set the static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on Port ${PORT}`));

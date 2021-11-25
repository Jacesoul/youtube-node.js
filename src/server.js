import express from "express";

const PORT = 4000;

const app = express();

const gossipMiddleware = (req, res, next) => {
  console.log(`Someone is going to : ${req.url}`);
  return res.send("intercept! ");
  next();
};

// handleHome함수는 마지막에 호출되기 때문에 final middleware라고 할수 있다.
const handleHome = (req, res) => {
  console.log("final middleware!");
  return res.end();
};

const handleLogin = (req, res) => {
  return res.send({ message: "Login here." });
};

app.get("/", gossipMiddleware, handleHome);
app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT}/ 🚀`);

app.listen(PORT, handleListening);

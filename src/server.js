import express from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not allowed</h1>");
  }
  console.log("Allowed, you may continue");
  next();
};

// handleHome함수는 마지막에 호출되기 때문에 final middleware라고 할수 있다.
const handleHome = (req, res) => {
  console.log("I love middleware!");
  return res.end();
};

const handleLogin = (req, res) => {
  return res.send({ message: "Login here." });
};

const handleProtected = (req, res) => {
  return res.send("Welcome to the private lounge.");
};

app.use(logger);
app.use(privateMiddleware);
app.get("/", handleHome);
app.get("/protected", handleProtected);

app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT}/ 🚀`);

app.listen(PORT, handleListening);

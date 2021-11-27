import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error");

// error는 여러번 일어날수 있어 on 메소드를 사용
db.on("error", handleError);
// open은 오직 한번만 일어난다. once메소드는 한번만 일어나게함
db.once("open", handleOpen);

import "./db";
import "./models/Video";
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000; //관습, 높은숫자는 비어있을 확률 높음

const app = express();
const logger = morgan("combined");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
//use는 모든곳에서 적용
app.use(logger);
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

// //last controller에는 관습적으로 next를 쓰지않음
// const home = (req, res) => {
//   return res.send("hello"); //return을 만나면 종료
// };

// const login = (req, res) => {
//   return res.send("Welcome to the private");
// };

//get은 request를 처리함

const handleListening = () => console.log(`Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);

import express from "express";
import morgan from "morgan";

const PORT = 4000; //관습, 높은숫자는 비어있을 확률 높음

const app = express();
const logger = morgan("dev");

//last controller에는 관습적으로 next를 쓰지않음
const home = (req, res) => {
  return res.send("hello"); //return을 만나면 종료
};

const login = (req, res) => {
  return res.send("Welcome to the private");
};

//use는 모든곳에서 적용
app.use(logger);
//get은 request를 처리함
app.get("/", home);
app.get("/login", login);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);

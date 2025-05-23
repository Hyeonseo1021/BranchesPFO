// server.ts 또는 app.ts
import express from "express";
import authRoutes from "./routes/Routes";

const app = express();
app.use(express.json()); // JSON body 파싱
app.use("/auth", authRoutes); // /auth/register 등

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
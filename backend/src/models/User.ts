import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },  // 로그인용 ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // 암호화된 비밀번호
});

export default mongoose.model("User", userSchema);

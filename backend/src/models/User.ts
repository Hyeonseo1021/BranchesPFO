import mongoose from "mongoose";
import conversationSchema from "./Conversation.js";
import modelSchema from "./CustomModel.js";
import chatboxSchema from "./Chatbox.js";

// 사용자 스키마 정의
const userSchema = new mongoose.Schema({
    // 로그인에 사용할 사용자 아이디 (고유값)
    id: {
        type: String,
        required: true,
        unique: true, // 중복 불가
    },
    // 사용자 이름
    name: {
        type: String,
        required: true,
    },
    // 이메일
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // 암호화된 비밀번호
    password: {
        type: String,
        required: true,
    },
    // 대화 기록
    conversations: [conversationSchema],
    // 사용자 정의 모델
    CustomModels: [modelSchema],
    // 사용자 인터페이스 채팅박스 위치/크기 정보
    ChatBox: [chatboxSchema],
});

// User 모델로 등록 및 내보내기
export default mongoose.model("User", userSchema);

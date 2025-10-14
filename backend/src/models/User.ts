import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nickname: {       // 닉네임
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {          // 이메일
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {       // 비밀번호 (bcrypt로 해시 예정)
    type: String,
    required: true
  },
  profile: {        // Profile 문서 참조 (1:1 관계)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  bookmarks: [      // 북마크한 게시글 목록 (Post 참조)
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  resumes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    }
  ],
}, {
  timestamps: { createdAt: true, updatedAt: false } // 생성시간만 기록
});

const User = mongoose.model('User', UserSchema);
export default User;

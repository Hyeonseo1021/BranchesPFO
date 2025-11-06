import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    author: Types.ObjectId; // User 모델의 ObjectId를 저장
    views: number;
    likes: Types.ObjectId[]; // 좋아요 누른 사용자의 ObjectId 배열
}

const PostSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        views: { type: Number, default: 0 },
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

export default model<IPost>('Post', PostSchema);
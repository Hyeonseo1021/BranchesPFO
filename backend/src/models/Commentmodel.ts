import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
    postId: Types.ObjectId;
    content: string;
    author: Types.ObjectId;
}

const CommentSchema = new Schema(
    {
        postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

export default model<IComment>('Comment', CommentSchema);
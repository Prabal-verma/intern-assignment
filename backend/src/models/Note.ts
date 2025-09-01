import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
}

const noteSchema = new Schema<INote>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export const Note = mongoose.model<INote>('Note', noteSchema);

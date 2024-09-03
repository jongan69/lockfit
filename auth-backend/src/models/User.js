import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  publicKey: {
    type: String,
    required: true,
    unique: true,
  },
  nonce: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

export default User;

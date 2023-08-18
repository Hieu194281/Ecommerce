import { Schema, model } from 'mongoose'; // Erase if already required

import bcrypt from 'bcrypt';

let ObjectId = Schema.ObjectId;

// Declare the Schema of the Mongo model
var userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    cart: {
      type: Array,
      default: [],
    },
    address: [
      {
        type: ObjectId,
        ref: 'Address',
      },
    ],
    wishlist: [
      {
        type: ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const saltRounds = 5;
  const salt = await bcrypt.genSaltSync(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

//Export the model
export default model('User', userSchema);

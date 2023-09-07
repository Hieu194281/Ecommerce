import { Schema, model } from 'mongoose'; // Erase if already required
let ObjectId = Schema.ObjectId;

// Declare the Schema of the Mongo model
var productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    sold: {
      type: 'Number',
      default: 0,
      // select: false,
    },
    quantity: {
      type: Number,
      required: true,
      // select: false,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      required: true,
    },
    ratings: [
      {
        star: Number,
        postedby: {
          type: ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

//Export the model
export default model('Product', productSchema);

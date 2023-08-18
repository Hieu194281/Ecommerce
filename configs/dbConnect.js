import { default as mongoose } from 'mongoose';
const dbConnect = () => {
  try {
    const conn = mongoose.connect(process.env.MONGOD_URL);
    console.log('database connect successful');
  } catch (err) {
    console.log('database error');
  }
};
export { dbConnect };

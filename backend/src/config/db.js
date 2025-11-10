import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        //await mongoose.connect("mongodb+srv://khangnguyen:WY3SWbmDp9D7uoZg@clustertodoxprime.dbypp3i.mongodb.net/?appName=ClusterTodoXPrime");

        console.log("Liên kết CSLD thành công ^^");
    } catch (error) {
        console.log("Lỗi khi kết nối CSLD :< ", error)
        process.exit(1); // đóng cổng data khi liên kết gặp lỗi
    }
}
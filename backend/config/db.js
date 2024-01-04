const mongoose = require('mongoose')



const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.mongo_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useFindAndModify: true,
        });
        console.log(`mongoDB Connected: ${conn.connection.host}`.blue.underline)
    } catch (error) {
        console.log(error.message)
        process.exit();
    }
}
module.exports = connectDB
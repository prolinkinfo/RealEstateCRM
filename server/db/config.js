const mongoose = require('mongoose');
const User = require('../model/schema/user');
const bcrypt = require('bcrypt');

const connectDB = async (DATABASE_URL, DATABASE) => {
    try {
        const DB_OPTIONS = {
            dbName: DATABASE
        }

        mongoose.set("strictQuery", false);
        await mongoose.connect(DATABASE_URL, DB_OPTIONS);

        let adminExisting = await User.find({ role: 'admin' });
        if (adminExisting.length <= 0) {
            const phoneNumber = 7874263694
            const firstName = 'Prolink'
            const lastName = 'Infotech'
            const username = 'admin@gmail.com'
            const password = 'admin123'
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Create a new user
            const user = new User({ _id: new mongoose.Types.ObjectId('64d33173fd7ff3fa0924a109'), username, password: hashedPassword, firstName, lastName, phoneNumber, role: 'admin' });
            // Save the user to the database
            await user.save();
            console.log("Admin created successfully..");
        } else if (adminExisting[0].deleted === true) {
            await User.findByIdAndUpdate(adminExisting[0]._id, { deleted: false });
            console.log("Admin Update successfully..");
        }

        console.log("Database Connected Successfully..");
    } catch (err) {
        console.log("Database Not connected", err.message);
    }
}
module.exports = connectDB
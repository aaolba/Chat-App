const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
},
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

})

// method to compare a plain text password with the hashed one stored in our database
userSchema.methods.matchPassword = async function (newPassword) {
    return await bcrypt.compare(newPassword, this.password)
}
const user = mongoose.model('User', userSchema)
module.exports = user;
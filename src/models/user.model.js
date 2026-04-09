import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required for creating User.'],
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address.'],
        unique: [true, 'Email already exists. Please use a different email address.']
    }, 
    name: {
        type: String,
        required: [true, "Name is required for creating User."],
    },
    password: {
        type: String,
        required: [true, "Password is required for creating User."],
        minlength: [6, "Password must be at least 6 characters long."],
        match: [/(?=.*[A-Z])(?=.*\d).+/, "Password must contain at least one uppercase letter and one number."],
        select: false // Exclude password from query results by default
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
},{
    timestamps: true // Automatically add createdAt and updatedAt fields
})  

//pre means before saving the user document to the database, this function will be executed.
userSchema.pre('save', async function() { 
    if(!this.isModified("password")){
        return
    };

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("user", userSchema);

export default userModel;
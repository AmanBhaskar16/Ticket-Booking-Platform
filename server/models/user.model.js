import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { USER_ROLE, USER_STATUS} from '../utils/constants.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim : true,
        unique : true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email'],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false
    },
    userRole: {
        type: String,
        required: true,
        enum: {
            values: [USER_ROLE.customer, USER_ROLE.admin, USER_ROLE.client],
            message: "Invalid user role given"
        },
        default: USER_ROLE.customer
    },
    userStatus: {
        type: String,
        required: true,
        enum: {
            values: [USER_STATUS.approved, USER_STATUS.pending, USER_STATUS.rejected],
            message: "Invalid status for user given"
        },
        default: USER_STATUS.approved
    }
}, {timestamps: true});

userSchema.pre('save', async function () {

    if(!this.isModified("password")){
        return;
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
});

/**
 * This is going to be an instance method for user, to compare a password
 * with the stored encrypted password
 * @param plainPassword -> input password given by user in sign in request
 * @returns boolean denoting whether passwords are same or not ?
 */
userSchema.methods.isValidPassword = async function (plainPassword) {
    const currentUser = this;
    const compare = await bcrypt.compare(plainPassword, currentUser.password);
    return compare;
}

const User = mongoose.model('User', userSchema);
export default User;
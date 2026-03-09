import User from "../models/user.model.js";
import { USER_ROLE, USER_STATUS, STATUS_CODES} from '../utils/constants.js';

export const createUser = async (data) => {
    try {
        if(!data.userRole || data.userRole == USER_ROLE.customer) {
            if(data.userStatus && data.userStatus != USER_STATUS.approved) {
                throw {
                    err: "We cannot set any other status for customer", 
                    code: 400
                };
            }
        }

        const adminCount = await User.countDocuments({ userRole: "ADMIN" });

        if(adminCount === 0 && data.userRole === "ADMIN"){
            data.userStatus = "APPROVED";
        }

        if(data.userRole && data.userRole != USER_ROLE.customer && adminCount) {
            data.userStatus = USER_STATUS.pending;
        }
        
        const response = await User.create(data);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            throw {err: err, code: 422};
        }
        throw error;
    }
}

export const getUserByEmail = async (email) => {
    try {
        const response = User.findOne({email}).select("+password");
        if(!response) {
            throw {err: "No user found for the given email", code: 404};
        }
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getUserById = async (id) => {
    try {
        const user = await User.findById(id).select("+password");
        if(!user) {
            throw {err: "No user found for the given id", code: 404};
        }
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const updateUserRoleOrStatus = async (data, userId) => {
    try {
        let updateQuery = {};
        if(data.userRole) updateQuery.userRole = data.userRole;
        if(data.userStatus) updateQuery.userStatus = data.userStatus;
        
        let response = await User.findByIdAndUpdate(userId, updateQuery, {new: true, runValidators: true});
        
        if(!response) throw {err: 'No user found for the given id', code: STATUS_CODES.NOT_FOUND};

        return response;
    } catch (error) {
        console.log(error, error.name);
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach(key => {
                err[key] = error.errors[key].message;
            });
            throw {err: err, code: STATUS_CODES.BAD_REQUEST};
        }
        throw error;
    }
}

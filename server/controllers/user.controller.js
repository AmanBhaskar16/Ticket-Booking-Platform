
import { errorResponseBody, successResponseBody } from '../utils/response.utils.js';
import {STATUS_CODES} from '../utils/constants.js';
import { updateUserRoleOrStatus } from '../services/user.service.js';

export const update = async (req, res) => {
    try {
        const response = await updateUserRoleOrStatus(req.body, req.params.id);

        successResponseBody.data = response;
        successResponseBody.message = 'Successfully updated the user';
        return res.status(STATUS_CODES.OK).json(successResponseBody);
    } catch (error) {
        if(error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(errorResponseBody);
    }
}

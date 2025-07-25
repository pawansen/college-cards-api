const bcrypt = require('bcrypt'),
    saltRounds = 10,
    { getOffset } = require('../utils/utility'),
    { logger } = require('../lib/logger'),
    { env } = require('../../infrastructure/env'),
    OAuth2Server = require('oauth2-server'),
    requestIp = require('request-ip'),
    oauth = new OAuth2Server({
        model: require('./oauth2Services'),
        allowBearerTokensInQueryString: true,
        accessTokenLifetime: env.OAUTH_TOKEN_EXPIRE,
    }),
    getCurrentLine = require('get-current-line'),
    userSchema = require('../domain/schema/mongoose/user.schema'),
    OAuthTokenSchema = require('../domain/schema/mongoose/oauthTokens.schema'),
    stateSchema = require('../domain/schema/mongoose/state.schema'),
    citiesSchema = require('../domain/schema/mongoose/cities.schema'),
    userCitiesSchema = require('../domain/schema/mongoose/userCities.schema'),
    couponSchema = require('../domain/schema/mongoose/coupon.schema'),
    FeedbackSchema = require('../domain/schema/mongoose/feedback.schema'),
    Request = OAuth2Server.Request,
    Response = OAuth2Server.Response;

/**
 * login.
 *
 * @returns {Object}
 */
exports.loginServices = async (req, res) => {
    try {
        req.body.client_id = env.OAUTH_CLIENT_ID
        req.body.client_secret = env.OAUTH_CLIENT_SECRET
        req.body.username = req.body.email
        let request = new Request(req)
        let response = new Response(res)
        return oauth
            .token(request, response)
            .then(async function (token) {
                if (token.user.isActive) {
                    let data = {
                        id: token.user.id,
                        user_id: token.user.id,
                        firstName: token.user.firstName,
                        lastName: token.user.lastName,
                        email: token.user.email,
                        mobile: token.user.mobile,
                        role: token.user.role,
                        token: token.accessToken,
                        refreshToken: token.refresh_token,
                        referralCode: token.user.referralCode,
                        profileImage: env.UPLOAD_URL + token.user.profileImage,
                        deviceId: token.user.deviceId,
                    }
                    await userSchema.updateOne(
                        { _id: token.user.id },
                        {
                            lastLoginAt: new Date(),
                            lastLoginIp: requestIp.getClientIp(req),
                            deviceType: req.body.deviceType || 'android',
                            deviceToken: req.body.deviceToken || null,
                            loginType: 'app',
                        }
                    )
                    return {
                        status: 1,
                        message: 'User successfully logged in.',
                        data,
                    }
                } else {
                    return { status: 0, message: 'Your Account is inActive, Please contact to administrator!' }
                }
            })
            .catch(function (err) {
                return { status: 0, message: 'User credentials are invalid.' }
            })
    } catch (err) {
        console.log(err)
        return { status: 0, message: err }
    }
}

/**
 * add user.
 *
 * @returns {Object}
 */
exports.registerServices = async (req) => {
    try {
        let { body, file } = req;
        let salt = bcrypt.genSaltSync(saltRounds)
        let hash = bcrypt.hashSync(body.password, salt)
        // Get the text before '@' in body.email
        const referralCode = body.email.split('@')[0];
        let payload = {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hash,
            auth_password: salt,
            grant: body.password,
            mobile: body.mobile,
            deviceId: body.deviceId,
            deviceType: body.deviceType,
            deviceToken: body.deviceToken,
            referralCode: referralCode.replace(/\s+/g, ''),
            profileImage: file ? "/uploads/users/" + file.filename : null,
        }
        // Check if user with email or mobile already exists
        const existingUser = await userSchema.findOne({
            $or: [{ email: body.email }, { mobile: body.mobile }]
        });

        if (!existingUser) {
            // Create new user
            const newUser = new userSchema(payload);
            const savedUser = await newUser.save();
            return { status: 1, message: 'Successfully added', data: { ...savedUser.toObject(), user_id: savedUser._id, profileImage: env.UPLOAD_URL + savedUser.profileImage } };
        } else {
            return { status: 0, message: 'Email or Mobile is already exists' };
        }
    } catch (err) {
        return err
    }
}

/**
 * login.
 *
 * @returns {Object}
 */
exports.stateServices = async (req, res) => {
    try {
        // Fetch all states from the database
        const country_id = 101;
        const data = await stateSchema.find({ country_id: country_id });
        if (data.length > 0) {
            return {
                status: 1,
                message: 'Successfully listed.',
                data,
            }
        } else {
            return { status: 0, message: 'Records not found' }
        }
    } catch (err) {
        console.log(err)
        return { status: 0, message: err }
    }
}

/**
 * login.
 *
 * @returns {Object}
 */
exports.citiesServices = async (req, res) => {
    try {
        const { state_id } = req.query;
        // Fetch all cities from the database
        let state = 4039;
        const data = await citiesSchema.find({ state_id: state });
        if (data.length > 0) {
            return {
                status: 1,
                message: 'Successfully listed.',
                data,
            }
        } else {
            return { status: 0, message: 'Records not found' }
        }
    } catch (err) {
        console.log(err)
        return { status: 0, message: err }
    }
}


/**
 * login.
 *
 * @returns {Object}
 */
exports.getProfileServices = async (req, res) => {
    try {
        const { _id } = req.User;
        const user = await userSchema.findOne(
            { _id: _id, isActive: true },
            {
                _id: 1,
                user_id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                mobile: 1,
                role: 1,
                token: 1,
                refreshToken: 1,
                referralCode: 1,
                profileImage: 1,
                deviceId: 1,
                createDate: 1,
                lastLoginAt: 1,
                deviceToken: 1,
                password: 1, deviceType: 1, loginType: 1, isActive: 1, isEmailVerified: 1, isMobileVerified: 1
            }
        ).lean();
        if (user) {
            const data = {
                id: user._id,
                user_id: user.user_id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                token: user.token,
                refreshToken: user.refreshToken,
                referralCode: user.referralCode,
                profileImage: env.UPLOAD_URL + user.profileImage,
                deviceId: user.deviceId,
            }
            return {
                status: 1,
                message: 'User successfully listed.',
                data,
            }
        } else {
            return { status: 0, message: 'User not found or inactive.' }
        }

    } catch (err) {
        console.log(err)
        return { status: 0, message: err }
    }
}

/**
 * login.
 *
 * @returns {Object}
 */
exports.updateUserServices = async (req, res) => {
    try {
        const { _id } = req.User;
        let { file } = req;
        const { firstName, lastName, mobile, email, profileImage } = req.body;
        // Check if email or mobile exists for another user
        const exists = await userSchema.findOne({
            $and: [
                { _id: { $ne: _id } },
                { $or: [{ email }, { mobile }] }
            ]
        });
        if (exists) {
            return { status: 0, message: 'Email or Mobile already exists for another user.' };
        }

        // Update user
        const updatePayload = {
            firstName,
            lastName,
            mobile,
            email,
        };
        if (file) {
            updatePayload.profileImage = "/uploads/users/" + file.filename;
        }
        await userSchema.updateOne({ _id }, updatePayload);

        // Return updated user
        const user = await userSchema.findOne({ _id, isActive: true }).lean();
        if (user) {
            const data = {
                id: user._id,
                user_id: user.user_id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                token: user.token,
                refreshToken: user.refreshToken,
                referralCode: user.referralCode,
                profileImage: env.UPLOAD_URL + user.profileImage,
                deviceId: user.deviceId,
            };
            return {
                status: 1,
                message: 'User profile updated successfully.',
                data,
            };
        } else {
            return { status: 0, message: 'User not found or inactive.' };
        }

    } catch (err) {
        console.log(err)
        return { status: 0, message: err }
    }
}

/**
 * login.
 *
 * @returns {Object}
 */
exports.updateCityServices = async (req, res) => {
    try {
        const { _id } = req.User;
        let { city_id } = req.body;
        // Insert or update userCities schema
        await userCitiesSchema.updateOne(
            { user_id: _id },
            { city_id },
            { upsert: true }
        );
        return { status: 1, message: 'User city updated successfully.' };
    } catch (err) {
        console.log(err)
        return { status: 0, message: err }
    }
}

/**
 * add user.
 *
 * @returns {Object}
 */
exports.addCouponServices = async (req) => {
    try {
        let { body, file } = req;
        const address = body.address ? JSON.parse(body.address) : [];
        let payload = {
            title: body.title,
            code: body.code,
            amount: body.amount,
            amountType: body.amountType,
            description: body.description,
            city_id: body.city_id,
            address: Array.isArray(address) && address.length > 0
                ? address.map(item => ({
                    address: item.address || ''
                }))
                : [],
            logo: file ? "/uploads/coupons/" + file.filename : null,
        }
        // Check if user with email or mobile already exists
        const existingUser = await couponSchema.findOne({
            $and: [{ code: body.code }, { city_id: body.city_id }]
        });

        if (!existingUser) {
            // Create new user
            const newUser = new couponSchema(payload);
            const savedUser = await newUser.save();
            return { status: 1, message: 'Successfully added', data: { ...savedUser.toObject(), id: savedUser._id, logo: env.UPLOAD_URL + savedUser.logo } };
        } else {
            return { status: 0, message: 'Coupon code already exists' };
        }
    } catch (err) {
        return err
    }
}

/**
 * login.
 *
 * @returns {Object}
 */
exports.getCouponServices = async (req, res) => {
    try {
        const { _id } = req.User;
        const { city_id, limit, pageNo } = req.query;
        const limits = limit ? parseInt(limit) : 10
        const offset = pageNo ? getOffset(parseInt(pageNo), limit) : 0
        // Fetch all cities from the database
        const userCities = await userCitiesSchema.find({ user_id: _id });
        // If userCities found, extract city_id into a new array
        let userCityIds = [];
        if (userCities && userCities.length > 0) {
            userCityIds = userCities.map(item => item.city_id);
        }
        // Find coupons where city_id is in userCityIds (if available), otherwise use provided city_id
        let query = {};
        if (userCityIds && userCityIds.length > 0) {
            query.city_id = { $in: userCityIds };
        } else if (city_id) {
            query.city_id = city_id;
        }
        let data = [];
        if (city_id) {
            data = await couponSchema.find({ city_id: city_id }).skip(offset).limit(limits);
        } else {
            data = await couponSchema.find(query).skip(offset).limit(limits);
        }
        if (data.length > 0) {
            return {
                status: 1,
                message: 'Successfully listed.',
                data,
            }
        } else {
            return { status: 0, message: 'Records not found' }
        }
    } catch (err) {
        console.log(err)
        return { status: 0, message: err }
    }
}

/**
 * add user.
 *
 * @returns {Object}
 */
exports.changePasswordServices = async (req) => {
    try {
        const { _id } = req.User;
        let { old_password, new_password } = req.body
        // Check if user with email or mobile already exists
        const User = await userSchema.findOne({
            $and: [{ _id: _id }]
        });
        if (!User) {
            return { status: 0, message: 'User not found' };
        }
        if (!bcrypt.compareSync(old_password, User.password)) {
            return { status: 0, message: 'Old password is incorrect' };
        } else {
            let salt = bcrypt.genSaltSync(saltRounds)
            let hash = bcrypt.hashSync(new_password, salt)
            let payload = {
                password: hash,
                auth_password: salt,
                grant: new_password,
            }
            const updateResult = await userSchema.updateOne(
                { _id: _id },
                { $set: payload }
            );
            if (updateResult.modifiedCount > 0) {
                // Delete all OAuth tokens for the current user after password change
                await OAuthTokenSchema.deleteMany({ user_id: _id });
                return { status: 1, message: 'Password changed successfully.' };
            } else {
                return { status: 0, message: 'Password not changed.' };
            }
        }
    } catch (err) {
        return err
    }
}

/**
 * add user.
 *
 * @returns {Object}
 */
exports.logoutServices = async (req) => {
    try {
        const { _id } = req.User;
        // Invalidate all OAuth tokens for the current user
        await OAuthTokenSchema.deleteMany({ user_id: _id });
        return { status: 1, message: 'Logged out successfully.' };
    } catch (err) {
        return err
    }
}

/**
 * add user.
 *
 * @returns {Object}
 */
exports.feedbackServices = async (req) => {
    try {
        const { _id } = req.User;
        let { description } = req.body
        // Save feedback to the database
        const feedbackEntry = new FeedbackSchema({
            user_id: _id,
            description: description
        });
        await feedbackEntry.save();
        return { status: 1, message: 'Feedback submitted successfully.' };
    } catch (err) {
        return err
    }
}

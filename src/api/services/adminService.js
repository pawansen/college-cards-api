const bcrypt = require('bcrypt'),
    saltRounds = 10,
    { getOffset } = require('../utils/utility'),
    { env } = require('../../infrastructure/env'),
    OAuth2Server = require('oauth2-server'),
    requestIp = require('request-ip'),
    oauth = new OAuth2Server({
        model: require('./oauth2Services'),
        allowBearerTokensInQueryString: true,
        // accessTokenLifetime: env.OAUTH_TOKEN_EXPIRE,
        accessTokenLifetime: 60 * 5, // 5 mins
        refreshTokenLifetime: 60 * 60 * 24 * 30, // 30 days
    }),
    userSchema = require('../domain/schema/mongoose/user.schema'),
    OAuthTokenSchema = require('../domain/schema/mongoose/oauthTokens.schema'),
    countriesSchema = require('../domain/schema/mongoose/country.schema'),
    stateSchema = require('../domain/schema/mongoose/state.schema'),
    citiesSchema = require('../domain/schema/mongoose/cities.schema'),
    userCitiesSchema = require('../domain/schema/mongoose/userCities.schema'),
    couponSchema = require('../domain/schema/mongoose/coupon.schema'),
    FeedbackSchema = require('../domain/schema/mongoose/feedback.schema'),
    packageSchema = require('../domain/schema/mongoose/package.schema'),
    UserSubscribeSchema = require('../domain/schema/mongoose/userSubscribe.schema'),
    UserPaymentsSchema = require('../domain/schema/mongoose/payment.schema'),
    VersionSchema = require('../domain/schema/mongoose/version.schema'),
    notificationSchema = require('../domain/schema/mongoose/notification.schema'),
    PromoCodeSchema = require('../domain/schema/mongoose/promoCode.schema'),
    contentSchema = require('../domain/schema/mongoose/content.schema'),
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
        const TokenOptions = {
            accessTokenLifetime: env.OAUTH_TOKEN_EXPIRE,
            refreshTokenLifetime: env.OAUTH_TOKEN_EXPIRE,
        }
        return oauth
            .token(request, response, TokenOptions)
            .then(async function (token) {
                if (token.user.isActive) {
                    if (token.user.role === 'admin') {
                        let data = {
                            user_id: token.user._id,
                            firstName: token.user.firstName,
                            lastName: token.user.lastName,
                            email: token.user.email,
                            role: token.user.role,
                            token: token.accessToken,
                            refreshToken: token.refresh_token,
                            profileImage: env.UPLOAD_URL + token.user.profileImage,
                        }
                        await userSchema.updateOne(
                            { _id: token.user._id },
                            {
                                lastLoginAt: new Date(),
                                lastLoginIp: requestIp.getClientIp(req),
                                deviceType: req.body.deviceType || 'web',
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
                        return { status: 0, message: 'Your Account is not authorized to access this resource.' }
                    }

                } else {
                    return { status: 0, message: 'Your Account is inActive, Please contact to administrator!' }
                }
            })
            .catch(function (err) {
                console.log(err)
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
exports.registerServices = async (req, res) => {
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
            // Remove sensitive fields before returning user object
            delete savedUser.password;
            delete savedUser.grant;
            delete savedUser.auth_password;
            delete savedUser.isActive;
            delete savedUser.isDelete;
            delete savedUser.isEmailVerified;
            delete savedUser.isMobileVerified;

            req.body.client_id = env.OAUTH_CLIENT_ID
            req.body.client_secret = env.OAUTH_CLIENT_SECRET
            req.body.username = body.email
            req.body.email = body.email
            req.body.password = body.password
            req.body.grant_type = 'password'
            req.headers['content-type'] = 'application/x-www-form-urlencoded';
            let request = new Request(req)
            let response = new Response(res)

            return oauth
                .token(request, response)
                .then(async function (token) {
                    const data = {
                        id: savedUser._id,
                        user_id: savedUser._id,
                        firstName: savedUser.firstName,
                        lastName: savedUser.lastName,
                        email: savedUser.email,
                        mobile: savedUser.mobile,
                        role: savedUser.role,
                        token: token.accessToken,
                        refreshToken: token.refresh_token,
                        referralCode: savedUser.referralCode,
                        profileImage: savedUser.profileImage ? env.UPLOAD_URL + savedUser.profileImage : null,
                        deviceId: savedUser.deviceId,
                        isCityUpdated: false,
                        isSubscribed: false,
                        city_ids: [],
                        subscription: null
                    };
                    return {
                        status: 1, message: 'Successfully added', data: data
                    };
                })
                .catch(function (err) {
                    return { status: 0, message: 'User credentials are invalid.' }
                })
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
        /*const exists = await userSchema.findOne({
            $and: [
                { _id: { $ne: _id } },
                { $or: [{ email }, { mobile }] }
            ]
        });
        if (exists) {
            return { status: 0, message: 'Email or Mobile already exists for another user.' };
        }*/

        // Update user
        const updatePayload = {
            firstName,
            lastName,
            mobile,
            // email,
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
        // Check if the city already exists for the user
        const exists = await userCitiesSchema.findOne({ user_id: _id, city_id });
        if (!exists) {
            // Insert new record if not found
            await userCitiesSchema.create({ user_id: _id, city_id });
        }
        // If exists, do nothing (no update)
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
        // Generate a random code: 3 letters + 3 digits
        function generateRandomCode() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const letters = Array.from({ length: 3 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
            const numbers = Math.floor(100 + Math.random() * 900); // 3 digits
            return letters + numbers;
        }

        let payload = {
            title: body.title,
            code: body.code || generateRandomCode(),
            amount: body.amount,
            amountType: "percentage",
            // description: body.description,
            city_id: body.city_id,
            address: Array.isArray(address) && address.length > 0
                ? address.map(item => ({
                    address: item.address || ''
                }))
                : [],
            logo: file ? "/uploads/coupon/" + file.filename : null,
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
        const { city_id, keyword, limit, pageNo } = req.query;
        const limits = limit ? parseInt(limit) : 10
        const offset = pageNo ? getOffset(parseInt(pageNo), limit) : 0
        // Find coupons where city_id is in userCityIds (if available), otherwise use provided city_id
        let query = {};
        if (city_id) {
            query.city_id = city_id;
        }
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { amount: { $regex: keyword, $options: 'i' } }
            ];
        }
        let data = await couponSchema.find(
            query,
            {
                _id: 0,
                "coupon_id": "$_id",
                title: 1,
                code: 1,
                amount: 1,
                amountType: 1,
                description: 1,
                city_id: 1,
                address: 1,
                logo: 1,
                create_at: 1
            }
        ).skip(offset).limit(limits);
        // Add base path to logo
        // Add base path to logo and get city info
        data = await Promise.all(data.map(async item => {
            const obj = item.toObject();
            obj.logo = obj.logo ? env.UPLOAD_URL + obj.logo : null;
            // Attach city info if city_id exists
            if (obj.city_id) {
                const city = await citiesSchema.findOne({ id: obj.city_id }, { id: 1, name: 1 });
                obj.city = city ? { id: city.id, name: city.name } : null;
            } else {
                obj.city = null;
            }
            return obj;
        }));
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
exports.getCouponInfoServices = async (req, res) => {
    try {
        const { coupon_id } = req.query;
        let query = {};
        if (!coupon_id) {
            return { status: 0, message: 'Coupon ID is required' };
        }
        if (coupon_id) {
            query._id = coupon_id;
        }
        let data = await couponSchema.find(
            query,
            {
                _id: 0,
                "coupon_id": "$_id",
                title: 1,
                code: 1,
                amount: 1,
                amountType: 1,
                description: 1,
                city_id: 1,
                address: 1,
                logo: 1,
                create_at: 1
            }
        );
        // Add base path to logo
        // Add base path to logo and get city info
        data = await Promise.all(data.map(async item => {
            const obj = item.toObject();
            obj.logo = obj.logo ? env.UPLOAD_URL + obj.logo : null;
            // Attach city info if city_id exists
            if (obj.city_id) {
                const city = await citiesSchema.findOne({ id: obj.city_id }, { id: 1, name: 1 });
                obj.city = city ? { id: city.id, name: city.name } : null;
            } else {
                obj.city = null;
            }
            return obj;
        }));
        if (data.length > 0) {
            return {
                status: 1,
                message: 'Successfully listed.',
                data: data[0],
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
exports.deleteCouponServices = async (req) => {
    try {
        let { body } = req;
        // Delete coupon by code and city_id
        let deletedCoupon;
        let couponIds = [];
        if (typeof body.coupon_id === 'string') {
            couponIds = body.coupon_id.split(',').map(id => id.trim()).filter(Boolean);
        } else if (Array.isArray(body.coupon_id)) {
            couponIds = body.coupon_id;
        } else if (body.coupon_id) {
            couponIds = [body.coupon_id];
        }

        if (couponIds.length > 1) {
            deletedCoupon = await couponSchema.deleteMany({
                _id: { $in: couponIds },
            });
        } else if (couponIds.length === 1) {
            deletedCoupon = await couponSchema.findOneAndDelete({
                _id: couponIds[0],
            });
        } else {
            deletedCoupon = null;
        }

        if (deletedCoupon) {
            return { status: 1, message: 'Coupon deleted successfully.' };
        } else {
            return { status: 0, message: 'Coupon not found.' };
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.addPackageServices = async (req) => {
    try {
        let { body } = req;
        let payload = {
            cityCount: body.cityCount,
            amount: body.amount,
            title: body.title || 'College Cards Subscription',
            packageType: body.packageType,
            isActive: body?.status === 'inactive' ? false : true,
        }
        console.log(payload);
        // Create a new package
        const newPackage = new packageSchema(payload);
        await newPackage.save();
        return { status: 1, message: 'Package added successfully.', data: newPackage };
        // // Check if a package with the same title already exists
        // const existingPackage = await packageSchema.findOne({ isActive: true, packageType: body.packageType });
        // if (existingPackage) {
        //     // Update the existing package
        //     await packageSchema.updateOne(
        //         { _id: existingPackage._id },
        //         { $set: payload }
        //     );
        //     return { status: 1, message: 'Package updated successfully.' };
        // } else {
        //     // Create a new package
        //     const newPackage = new packageSchema(payload);
        //     return { status: 1, message: 'Package added successfully.' };
        // }
    } catch (err) {
        return err
    }
}

/**
 * add user.
 *
 * @returns {Object}
 */
exports.updatePackageServices = async (req) => {
    try {
        let { body } = req;
        let payload = {
            amount: body.amount,
            title: body.title || 'College Cards Subscription',
            packageType: body.packageType,
            isActive: body?.status === 'inactive' ? false : true,
        }
        // Check if a package with the same cityCount already exists
        await packageSchema.updateOne(
            { _id: body.package_id },
            { $set: payload }
        );
        return { status: 1, message: 'Package updated successfully.' };
    } catch (err) {
        return err
    }
}

/**
 * login.
 *
 * @returns {Object}
 */
exports.getPackagesService = async (req, res) => {
    try {
        const { user_id, keyward, limit, pageNo } = req.query;
        const limits = limit ? parseInt(limit) : 10
        const offset = pageNo ? getOffset(parseInt(pageNo), limit) : 0

        // Find all subscriptions for the user and join with package info
        const packages = await packageSchema.find(
            {},
            {},
            { skip: offset, limit: limits }
        );

        if (packages) {
            return { status: 1, message: 'Packages retrieved successfully.', data: packages };
        } else {
            return { status: 0, message: 'No packages found.' };
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
exports.getPackageInfoService = async (req, res) => {
    try {
        const { package_id } = req.query;

        // Find all subscriptions for the user and join with package info
        const packages = await packageSchema.findOne(
            { _id: package_id },
            {},
        );
        if (packages) {
            return { status: 1, message: 'Packages retrieved successfully.', data: packages };
        } else {
            return { status: 0, message: 'No packages found.' };
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
exports.deletePackageService = async (req, res) => {
    try {
        const { package_id } = req.body;

        // Delete the package by ID
        const deleteResult = await packageSchema.deleteOne(
            { _id: package_id }
        );
        if (deleteResult && deleteResult.deletedCount > 0) {
            return { status: 1, message: 'Package deleted successfully.', data: deleteResult };
        } else {
            return { status: 0, message: 'No package found.' };
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
exports.getPackageServices = async (req, res) => {
    try {
        const { _id } = req.User;
        const existingPackage = await packageSchema.findOne(
            { isActive: true },
            { _id: 0, "package_id": "$_id", title: 1, cityCount: 1, amount: 1, packageType: 1, isActive: 1 }
        );
        if (existingPackage) {
            const existingUserCities = await userCitiesSchema.countDocuments({ user_id: _id });
            return {
                status: 1,
                message: 'Successfully listed.',
                data: {
                    package: existingPackage,
                    totalCities: existingUserCities,
                    billingAmount: existingPackage.amount * existingUserCities
                },
            }
        } else {
            return { status: 0, message: 'No active package found.' }
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
exports.userSubscribeServices = async (req, res) => {
    try {
        const { _id } = req.User;
        const { package_id } = req.body;
        const existingPackage = await packageSchema.findOne(
            { _id: package_id },
            { _id: 0, "package_id": "$_id", title: 1, cityCount: 1, amount: 1, packageType: 1, isActive: 1 }
        );
        if (existingPackage) {

            // Check if user already has an active subscription
            const activeSubscription = await UserSubscribeSchema.findOne({
                user_id: _id,
                status: 'active',
                endDate: { $gte: new Date() }
            });
            if (activeSubscription) {
                return {
                    status: 0,
                    message: 'You already have an active subscription.',
                    data: activeSubscription
                };
            }
            const existingUserCities = await userCitiesSchema.countDocuments({ user_id: _id });
            const billingAmount = existingPackage.amount * existingUserCities;
            // Calculate endDate based on packageType
            let endDate = new Date();
            if (existingPackage.packageType === 'yearly') {
                endDate.setFullYear(endDate.getFullYear() + 1);
            } else if (existingPackage.packageType === 'monthly') {
                endDate.setMonth(endDate.getMonth() + 1);
            }
            const subscribeInfo = await UserSubscribeSchema.create({
                user_id: _id,
                package_id: package_id,
                cityCount: existingUserCities,
                amount: billingAmount,
                packageType: existingPackage.packageType,
                startDate: new Date(),
                endDate: endDate,
                status: 'active'
            });
            if (subscribeInfo) {
                // Create a payment record for the subscription
                await UserPaymentsSchema.create({
                    user_id: _id,
                    package_id: package_id,
                    subscription_id: subscribeInfo._id, // This can be updated later if needed
                    amount: billingAmount,
                    currency: 'USD', // Assuming USD, can be changed based on requirements
                    paymentMethod: 'manual', // Assuming manual payment, can be changed based on requirements
                    transactionId: null, // This can be updated later if needed
                    gateway: 'manual', // Assuming manual gateway, can be changed based on requirements
                    receiptUrl: null, // This can be updated later if needed
                    refundedAmount: 0,
                    notes: 'Subscription for package ' + existingPackage.title,
                    paymentDate: new Date(),
                    status: 'completed', // Assuming completed, can be changed based on requirements
                });
            }

            return {
                status: 1,
                message: 'Successfully subscribed.',
                data: existingPackage
            }
        } else {
            return { status: 0, message: 'Invalid package ID.' }
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
exports.getUserSubscribeServices = async (req, res) => {
    try {
        const { _id } = req.User;
        // Fetch the user's active subscription
        // Check if user already has an active subscription
        const activeSubscription = await UserSubscribeSchema.findOne({
            user_id: _id,
            status: 'active',
        });
        if (activeSubscription) {
            const cityInfo = {};
            let userCity = await userCitiesSchema.find({ user_id: _id })
            if (userCity.length > 0) {
                cityInfo.city_ids = userCity.map(item => item.city_id);
                const cities = await citiesSchema.find({ id: { $in: cityInfo.city_ids } });
                cityInfo.cityList = cities.map(item => ({
                    id: item.id,
                    name: item.name,
                }));
            }

            return {
                status: 1,
                message: 'Successfully listed.',
                data: { ...activeSubscription.toObject(), id: activeSubscription._id, ...cityInfo }
            }
        } else {
            return { status: 0, message: 'You do not have an active subscription.' }
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
exports.getPaymentHistoryServices = async (req, res) => {
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
        let query = { user_id: _id };
        let data = await UserPaymentsSchema.find(
            query,
            {
                _id: 0,
                "payment_id": "$_id",
                user_id: 1,
                package_id: 1,
                subscription_id: 1,
                amount: 1,
                currency: 1,
                paymentMethod: 1,
                transactionId: 1,
                gateway: 1,
                receiptUrl: 1,
                refundedAmount: 1,
                notes: 1,
                paymentDate: 1,
                status: 1
            }
        ).skip(offset).limit(limits);

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
exports.getRefreshTokenServices = async (req, res) => {
    try {
        req.body.client_id = env.OAUTH_CLIENT_ID;
        req.body.client_secret = env.OAUTH_CLIENT_SECRET;
        req.body.grant_type = 'refresh_token';
        // The refresh token should be sent in req.body.refresh_token
        let request = new Request(req);
        let response = new Response(res);

        return oauth
            .token(request, response)
            .then(function (token) {
                return {
                    status: 1,
                    message: 'Token refreshed successfully.',
                    data: {
                        accessToken: token.accessToken,
                        refreshToken: token.refresh_token,
                        expiresIn: token.accessTokenExpiresAt,
                        ...token.user
                    }
                };
            })
            .catch(function (err) {
                console.log(err);
                return { status: 0, message: 'Invalid refresh token.' };
            });
    } catch (err) {
        console.log(err);
        return { status: 0, message: err.message || 'Refresh token failed.' };
    }
}

/**
 * login.
 *
 * @returns {Object}
 */
exports.getUserServices = async (req, res) => {
    try {
        const { limit, pageNo } = req.query;
        const limits = limit ? parseInt(limit) : 10
        const offset = pageNo ? getOffset(parseInt(pageNo), limit) : 0
        const data = await userSchema.find(
            { role: { $ne: 'admin' }, isDelete: false }
        ).sort({ createDate: -1 }).skip(offset).limit(limits);

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
exports.getUserInfoServices = async (req, res) => {
    try {
        const { user_id } = req.query;
        const user = await userSchema.findOne(
            { _id: user_id },
        ).lean();
        if (user) {
            const data = {
                ...user,
                isCityUpdated: false,
                isSubscribed: false,
                city_ids: [],
                subscription: null,
                cityList: [],
                profileImage: user.profileImage ? env.UPLOAD_URL + user.profileImage : null,
            }
            let userCity = await userCitiesSchema.find({ user_id: user._id })
            if (userCity.length > 0) {
                data.isCityUpdated = true;
                data.city_ids = userCity.map(item => item.city_id);
                const cities = await citiesSchema.find({ id: { $in: data.city_ids } });
                data.cityList = cities.map(item => ({
                    id: item.id,
                    name: item.name,
                }));
            }
            // Check if user already has an active subscription
            // Find all subscriptions for the user and join with package info
            // Find all subscriptions for the user and join with package info
            const activeSubscription = await UserSubscribeSchema.find(
                { user_id: user._id }
            ).lean();

            // For each subscription, join cities info based on city_ids
            for (let sub of activeSubscription) {
                if (sub.cityCount && sub.cityCount > 0) {
                    // Find user's cities for this subscription
                    const userCities = await userCitiesSchema.find({ user_id: user._id }).lean();
                    const cityIds = userCities.map(item => item.city_id);
                    const cities = await citiesSchema.find({ id: { $in: cityIds } }).lean();
                    sub.cityList = cities.map(item => ({
                        id: item.id,
                        name: item.name,
                    }));
                } else {
                    sub.cityList = [];
                }
            }
            if (activeSubscription.length > 0) {
                data.isSubscribed = true;
                data.subscription = activeSubscription;
            }

            // Add feedback with profileImage including host path
            data.feedback = await FeedbackSchema.find(
                { user_id: user._id }
            )
                .populate({ path: 'user_id', model: 'users', select: 'firstName lastName email profileImage' })
                .lean();

            // Add host path to profileImage in feedback
            if (data.feedback && data.feedback.length > 0) {
                data.feedback = data.feedback.map(fb => {
                    if (fb.user_id && fb.user_id.profileImage) {
                        // Only add env.UPLOAD_URL if not already present
                        if (!fb.user_id.profileImage.startsWith(env.UPLOAD_URL)) {
                            fb.user_id.profileImage = env.UPLOAD_URL + fb.user_id.profileImage;
                        }
                    }
                    return fb;
                });
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
exports.getUserActiveSubscribeServices = async (req, res) => {
    try {
        const { user_id } = req.query;
        // Find all subscriptions for the user and join with package info
        const activeSubscription = await UserSubscribeSchema.find(
            { user_id: user_id }
        ).lean();

        // For each subscription, join cities info based on city_ids
        for (let sub of activeSubscription) {
            if (sub.cityCount && sub.cityCount > 0) {
                // Find user's cities for this subscription
                const userCities = await userCitiesSchema.find({ user_id: user_id }).lean();
                const cityIds = userCities.map(item => item.city_id);
                const cities = await citiesSchema.find({ id: { $in: cityIds } }).lean();
                sub.cityList = cities.map(item => ({
                    id: item.id,
                    name: item.name,
                }));
            } else {
                sub.cityList = [];
            }
        }
        if (activeSubscription.length > 0) {
            return {
                status: 1,
                message: 'Successfully listed.',
                data: activeSubscription,
            }
        } else {
            return { status: 0, message: 'No active subscriptions found.' }
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
exports.getUserFeedbackServices = async (req, res) => {
    try {
        const { user_id } = req.query;
        // Find all subscriptions for the user and join with package info
        // Get all feedback entries for the user and join with user info

        const activeSubscription = await FeedbackSchema.find({ user_id: user_id, feedback_type: 'direct' })
            .populate({ path: 'user_id', model: 'users', select: 'firstName lastName email profileImage' })
            .lean();

        // For each feedback, get its replies (self-join where feedback_id === _id)
        for (let feedback of activeSubscription) {
            feedback.replies = await FeedbackSchema.find({ feedback_id: feedback._id, feedback_type: 'reply' })
                .populate({ path: 'user_id', model: 'users', select: 'firstName lastName email profileImage' })
                .lean();
        }
        if (activeSubscription.length > 0) {
            return {
                status: 1,
                message: 'Successfully listed.',
                data: activeSubscription,
            }
        } else {
            return { status: 0, message: 'No feedback found.' }
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
exports.addFeedbackReplayServices = async (req) => {
    try {
        const { _id } = req.User;
        let { description, feedback_id } = req.body
        // Save feedback to the database
        const feedbackEntry = new FeedbackSchema({
            user_id: _id,
            description: description,
            feedback_type: 'reply', // Assuming replay feedback type
            feedback_id: feedback_id
        });
        await feedbackEntry.save();
        return { status: 1, message: 'Feedback submitted successfully.' };
    } catch (err) {
        return err
    }
}

/**
 * login.
 *
 * @returns {Object}
 */
exports.getFeedbackServices = async (req, res) => {
    try {
        const { limit, pageNo } = req.query;
        const limits = limit ? parseInt(limit) : 10
        const offset = pageNo ? getOffset(parseInt(pageNo), limit) : 0
        // Find all subscriptions for the user and join with package info
        // Get all feedback entries for the user and join with user info

        const activeSubscription = await FeedbackSchema.find({ feedback_type: 'direct' })
            .populate({ path: 'user_id', model: 'users', select: 'firstName lastName email profileImage' })

            .lean();

        // For each feedback, get its replies (self-join where feedback_id === _id)
        for (let feedback of activeSubscription) {
            feedback.replies = await FeedbackSchema.find({ feedback_id: feedback._id, feedback_type: 'reply' })
                .populate({ path: 'user_id', model: 'users', select: 'firstName lastName email profileImage' })
                .lean();
        }
        if (activeSubscription.length > 0) {
            return {
                status: 1,
                message: 'Successfully listed.',
                data: activeSubscription,
            }
        } else {
            return { status: 0, message: 'No feedback found.' }
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
exports.getFeedbackInfoServices = async (req, res) => {
    try {
        const { feedback_id } = req.query;
        // Find all subscriptions for the user and join with package info
        // Get all feedback entries for the user and join with user info

        const activeSubscription = await FeedbackSchema.find({ _id: feedback_id, feedback_type: 'direct' })
            .populate({ path: 'user_id', model: 'users', select: 'firstName lastName email profileImage' })
            .lean();

        // For each feedback, get its replies (self-join where feedback_id === _id)
        for (let feedback of activeSubscription) {
            feedback.replies = await FeedbackSchema.find({ feedback_id: feedback._id, feedback_type: 'reply' })
                .populate({ path: 'user_id', model: 'users', select: 'firstName lastName email profileImage' })
                .lean();
        }
        if (activeSubscription.length > 0) {
            return {
                status: 1,
                message: 'Successfully listed.',
                data: activeSubscription[0],
            }
        } else {
            return { status: 0, message: 'No feedback found.' }
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
exports.updateVersionServices = async (req) => {
    try {
        let { androidVersion, isCompulsoryUpdate, iosVersion } = req.body
        // Save feedback to the database
        // Always update the single version record (assume only one document exists)
        await VersionSchema.updateOne(
            {}, // empty filter to match any document
            { $set: { androidVersion, iosVersion, isCompulsoryUpdate } },
            { upsert: true } // insert if not exists
        );
        return { status: 1, message: 'Version updated successfully.' };
    } catch (err) {
        return err
    }
}


/**
 * add user.
 *
 * @returns {Object}
 */
exports.addUpdateCityServices = async (req) => {
    try {
        let { city, action } = req.body
        // Save feedback to the database
        // Always update the single version record (assume only one document exists)
        await citiesSchema.updateOne(
            { id: city }, // empty filter to match any document
            { $set: { isDisplay: action === 'add' ? 'yes' : 'no' } }
        );
        return { status: 1, message: 'City updated successfully.' };
    } catch (err) {
        return err
    }
}


/**
 * login.
 *
 * @returns {Object}
 */
exports.getCountriesServices = async (req, res) => {
    try {
        const data = await countriesSchema.find();
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
exports.getStatesServices = async (req, res) => {
    try {
        const { country_id } = req.query;
        // Fetch all cities from the database
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
exports.getCitiesServices = async (req, res) => {
    try {
        const { state_id } = req.query;
        const data = await citiesSchema.find({ state_id: state_id });
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
exports.getUpdateCityServices = async (req, res) => {
    try {

        const { limit, pageNo, keyword } = req.query;
        let data = [];
        if (limit && pageNo) {
            const limits = limit ? parseInt(limit) : 10
            const offset = pageNo ? getOffset(parseInt(pageNo), limit) : 0;
            if (keyword) {
                data = await citiesSchema.find({ isDisplay: "yes", name: { $regex: keyword, $options: "i" } }).skip(offset).limit(limits);
            } else {
                data = await citiesSchema.find({ isDisplay: "yes" }).skip(offset).limit(limits);
            }
        } else {
            data = await citiesSchema.find({ isDisplay: "yes" });
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
 * login.
 *
 * @returns {Object}
 */
exports.getNotificationServices = async (req, res) => {
    try {
        const { limit, pageNo } = req.query;
        const limits = limit ? parseInt(limit) : 10
        const offset = pageNo ? getOffset(parseInt(pageNo), limit) : 0
        const data = await notificationSchema.find(
            {},
            {
                _id: 0,
                "notification_id": "$_id",
                title: 1,
                message: 1,
                type: 1,
                entity_id: 1,
                is_read: 1,
                create_at: 1
            }
        ).sort({ create_at: -1 }).skip(offset).limit(limits);

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
exports.addPromoCodeServices = async (req) => {
    try {
        let { body } = req;
        // Only use the specified fields for insert/update
        let payload = {
            title: body.title,
            code: body.code,
            amount: body.amount,
            maxUsagePerUser: body.maxUsagePerUser,
            totalUsageLimit: body.totalUsageLimit,
            status: body.status,
            validFrom: body.validFrom,
            validTo: body.validTo
        };
        // Check if promo code with code and city_id already exists
        const existingPromo = await PromoCodeSchema.findOne({
            code: body.code
        });

        if (!existingPromo) {
            // Create new promo code
            const newPromo = new PromoCodeSchema(payload);
            const savedPromo = await newPromo.save();
            return { status: 1, message: 'Successfully added', data: { ...savedPromo.toObject(), id: savedPromo._id } };
        } else {
            // Update existing promo code
            await PromoCodeSchema.updateOne({ _id: existingPromo._id }, { $set: payload });
            return { status: 1, message: 'Successfully updated', data: { ...existingPromo.toObject(), ...payload, id: existingPromo._id } };
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
exports.getPromoCodeServices = async (req, res) => {
    try {
        const { _id } = req.User;
        const { city_id, keyward, limit, pageNo } = req.query;
        const limits = limit ? parseInt(limit) : 10
        const offset = pageNo ? getOffset(parseInt(pageNo), limit) : 0
        // Find coupons where city_id is in userCityIds (if available), otherwise use provided city_id
        let query = {};
        if (city_id) {
            query.city_id = city_id;
        }
        if (keyward) {
            query.$or = [
                { title: { $regex: keyward, $options: 'i' } },
                { code: { $regex: keyward, $options: 'i' } }
            ];
        }
        let data = await PromoCodeSchema.find(
            query,
            {
                _id: 0,
                "promo_id": "$_id",
                title: 1,
                code: 1,
                amount: 1,
                amountType: 1,
                maxUsagePerUser: 1,
                totalUsageLimit: 1,
                status: 1,
                validFrom: 1,
                validTo: 1,
                create_at: 1
            }
        ).skip(offset).limit(limits);
        // Add base path to logo
        data = data.map(item => ({
            ...item.toObject(),
            logo: item.logo ? env.UPLOAD_URL + item.logo : null
        }));
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
exports.deletePromoCodeServices = async (req) => {
    try {
        let { body } = req;
        // Delete promo code by code and city_id
        const deletedPromo = await PromoCodeSchema.findOneAndDelete({
            _id: body.promo_id,
        });

        if (deletedPromo) {
            return { status: 1, message: 'Promo code deleted successfully.' };
        } else {
            return { status: 0, message: 'Promo code not found.' };
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
exports.addContentServices = async (req) => {
    try {
        let { type, content } = req.body;
        // Only use the specified fields for insert/update
        let payload = {
            content: content,
            type: type,
        };
        // Check if content with type already exists
        const contentResponse = await contentSchema.findOne({
            type: type
        });
        if (!contentResponse) {
            // Create new content
            const newContent = new contentSchema(payload);
            const savedContent = await newContent.save();
            return { status: 1, message: 'Successfully added', data: { ...savedContent.toObject(), id: savedContent._id } };
        } else {
            // Update existing content
            await contentSchema.updateOne({ _id: contentResponse._id }, { $set: payload });
            return { status: 1, message: 'Successfully updated', data: { ...contentResponse.toObject(), ...payload, id: contentResponse._id } };
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
exports.getContentServices = async (req) => {
    try {
        let { type } = req.query;
        // Check if content with type already exists
        const contentResponse = await contentSchema.findOne({
            type: type
        });
        if (contentResponse) {
            return { status: 1, message: 'Successfully added', data: contentResponse };
        } else {
            return { status: 0, message: 'Content not found' };
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
exports.getDashboardServices = async (req) => {
    try {
        let { type, content } = req.body;
        // Only use the specified fields for insert/update
        let payload = {
            content: content,
            type: type,
        };
        let data = {};
        // Get total users (excluding admin)
        const totalUsers = await userSchema.countDocuments({ role: { $ne: 'admin' } });
        // Get total coupons
        const totalCoupons = await couponSchema.countDocuments({});
        // Get total packages
        const totalPackages = await packageSchema.countDocuments({});
        // Get total subscriptions
        const totalSubscriptions = await UserSubscribeSchema.countDocuments({});
        // Calculate the sum of all payment amounts
        const totalAmountResult = await UserPaymentsSchema.aggregate([
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]);
        const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].totalAmount : 0;
        // Get total promo codes
        const totalPromoCodes = await PromoCodeSchema.countDocuments({});
        // Get total cities
        const totalCities = await citiesSchema.countDocuments({ isDisplay: "yes" });

        const totalFeedbacks = await FeedbackSchema.countDocuments({});

        data = {
            totalUsers,
            totalCoupons,
            totalPackages,
            totalSubscriptions,
            totalAmount,
            totalPromoCodes,
            totalCities,
            totalFeedbacks
        };

        return { status: 1, message: 'Successfully updated', data: data };

    } catch (err) {
        return err
    }
}


/**
 * add user.
 *
 * @returns {Object}
 */
exports.updateCouponServices = async (req) => {
    try {
        let { body, file } = req;
        const address = body.address ? JSON.parse(body.address) : [];
        // Generate a random code: 3 letters + 3 digits
        function generateRandomCode() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const letters = Array.from({ length: 3 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
            const numbers = Math.floor(100 + Math.random() * 900); // 3 digits
            return letters + numbers;
        }

        let payload = {
            title: body.title,
            amount: body.amount,
            amountType: "percentage",
            city_id: body.city_id,
            address: Array.isArray(address) && address.length > 0
                ? address.map(item => ({
                    address: item.address || ''
                }))
                : [],
        }
        if (file) {
            // If a new file is uploaded, set the logo path
            payload.logo = "/uploads/coupon/" + file.filename;
        }
        // Check if user with email or mobile already exists
        // Update the coupon by _id
        await couponSchema.updateOne(
            { _id: body.coupon_id },
            { $set: payload }
        );
        return { status: 1, message: 'Coupon updated successfully.' };
    } catch (err) {
        return err
    }
}


/**
 * add user.
 *
 * @returns {Object}
 */
exports.userStatusUpdateService = async (req) => {
    try {
        let { body } = req;
        let payload = {}

        if (body.status) {
            payload.isActive = body.status === 'yes' ? true : false
        }
        if (body.delete) {
            payload.isDelete = body.delete === 'yes' ? true : false
        }
        // Update the existing package
        await userSchema.updateOne(
            { _id: body.user_id },
            { $set: payload }
        );
        return { status: 1, message: 'User updated successfully.' };

    } catch (err) {
        return err
    }
}

/**
 * login.
 *
 * @returns {Object}
 */
exports.getAllActiveSubscribeService = async (req, res) => {
    try {

        const { user_id, keyward, limit, pageNo } = req.query;
        const limits = limit ? parseInt(limit) : 10
        const offset = pageNo ? getOffset(parseInt(pageNo), limit) : 0

        // Find all subscriptions for the user and join with package info
        const activeSubscription = await UserSubscribeSchema.find(
            {},
            null,
            { skip: offset, limit: limits }
        )
            .populate({ path: 'user_id', model: 'users', select: 'firstName lastName email' })
            .lean();

        // For each subscription, join cities info based on city_ids
        for (let sub of activeSubscription) {
            if (sub.cityCount && sub.cityCount > 0) {
                const cities = await citiesSchema.find({ id: { $in: sub?.city_ids } }).lean();
                sub.cityList = cities.map(item => ({
                    id: item.id,
                    name: item.name,
                }));
            } else {
                sub.cityList = [];
            }
        }
        if (activeSubscription.length > 0) {
            return {
                status: 1,
                message: 'Successfully listed.',
                data: activeSubscription,
            }
        } else {
            return { status: 0, message: 'No active subscriptions found.' }
        }

    } catch (err) {
        console.log(err)
        return { status: 0, message: err }
    }
}
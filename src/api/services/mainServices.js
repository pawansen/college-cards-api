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
    stateSchema = require('../domain/schema/mongoose/state.schema'),
    citiesSchema = require('../domain/schema/mongoose/cities.schema'),
    userCitiesSchema = require('../domain/schema/mongoose/userCities.schema'),
    couponSchema = require('../domain/schema/mongoose/coupon.schema'),
    FeedbackSchema = require('../domain/schema/mongoose/feedback.schema'),
    packageSchema = require('../domain/schema/mongoose/package.schema'),
    UserSubscribeSchema = require('../domain/schema/mongoose/userSubscribe.schema'),
    UserPaymentsSchema = require('../domain/schema/mongoose/payment.schema'),
    notificationSchema = require('../domain/schema/mongoose/notification.schema'),
    VersionSchema = require('../domain/schema/mongoose/version.schema'),
    // Notification = require('../utils/notification'),
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
                if (!token.user.isDelete) {
                    if (!token.user.isActive) {
                        return { status: 0, message: 'Your Account is inActive, Please contact to administrator!' }
                    }
                    // return Notification.sendFCMNotification(
                    //     token.user.deviceToken,
                    //     "Subscribe",
                    //     "YYour subscription has been activated",
                    //     {
                    //         event_id: null,
                    //         user_id: null,
                    //         event_type: "subscribe"
                    //     }
                    // );
                    let data = {
                        id: token.user._id,
                        user_id: token.user._id,
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
                        isCityUpdated: false,
                        isSubscribed: false,
                        city_ids: [],
                        subscription: null,
                        cityList: [],
                    }
                    let userCity = await userCitiesSchema.find({ user_id: token.user._id })
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
                    const activeSubscription = await UserSubscribeSchema.findOne({
                        user_id: token.user._id,
                        status: 'active',
                        endDate: { $gte: new Date() }
                    });
                    if (activeSubscription) {
                        data.isSubscribed = true;
                        data.subscription = {
                            package_id: activeSubscription.package_id,
                            cityCount: activeSubscription.cityCount,
                            amount: activeSubscription.amount,
                            packageType: activeSubscription.packageType,
                            startDate: activeSubscription.startDate,
                            endDate: activeSubscription.endDate,
                            status: activeSubscription.status
                        };
                    }
                    await userSchema.updateOne(
                        { _id: token.user._id },
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
                    return { status: 0, message: 'Your Account is deleted!' }
                }
            })
            .catch(function (err) {
                console.log(err.message)
                return { status: 0, message: err.message }
            })
    } catch (err) {
        console.log(err)
        return { status: 0, message: err.message }
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
            profileImage: file ? "/uploads/users/" + file.filename : null
        }
        let referrer;
        if (body.referralCode) {
            // Check if the referral code exists
            referrer = await userSchema.findOne({ referralCode: body.referralCode });
            if (!referrer) {
                return { status: 0, message: 'Referral code is invalid.' }
            }
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
                    if (body.referralCode) {
                        if (referrer) {
                            const updateResult = await userSchema.updateOne(
                                { _id: savedUser._id },
                                { $set: { referredBy: referrer._id } }
                            );
                            if (updateResult.modifiedCount === 0) {
                                return { status: 0, message: 'Failed to update referrer.' };
                            }
                        }
                    }
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
                    return { status: 0, message: err.message };
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
            data = await couponSchema.find(
                { city_id: city_id },
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
            data = data.map(async item => {
                const cityInfo = await citiesSchema.findOne({ id: item.city_id });
                return {
                    ...item.toObject(),
                    logo: item.logo ? env.UPLOAD_URL + item.logo : null,
                    city: cityInfo ? { id: cityInfo.id, name: cityInfo.name } : null
                };
            });
            data = await Promise.all(data);
        } else {
            data = await couponSchema.find(
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
            // Add base path to logo
            data = data.map(async item => {
                const cityInfo = await citiesSchema.findOne({ id: item.city_id });
                return {
                    ...item.toObject(),
                    logo: item.logo ? env.UPLOAD_URL + item.logo : null,
                    city: cityInfo ? { id: cityInfo.id, name: cityInfo.name } : null
                };
            });
            data = await Promise.all(data);
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
            description: description,
            feedback_type: 'direct', // Assuming direct feedback type
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
        }
        // Check if a package with the same cityCount already exists
        const existingPackage = await packageSchema.findOne({ isActive: true });
        if (existingPackage) {
            // Update the existing package
            await packageSchema.updateOne(
                { _id: existingPackage._id },
                { $set: payload }
            );
            return { status: 1, message: 'Package updated successfully.' };
        } else {
            // Create a new package
            const newPackage = new packageSchema(payload);
            return { status: 1, message: 'Package added successfully.' };
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
            const existingUserCities = await userCitiesSchema.find({ user_id: _id });
            const cityCount = existingUserCities.length;
            const userCityIds = existingUserCities.map(item => item.city_id);

            const billingAmount = existingPackage.amount * cityCount;
            // Calculate endDate based on packageType
            let endDate = new Date();
            if (existingPackage.packageType === 'yearly') {
                endDate.setFullYear(endDate.getFullYear() + 1);
            } else if (existingPackage.packageType === 'monthly') {
                endDate.setMonth(endDate.getMonth() + 1);
            }
            console.log('End Date:', {
                user_id: _id,
                package_id: package_id,
                cityCount: cityCount,
                city_ids: userCityIds,
                amount: billingAmount,
                packageType: existingPackage.packageType,
                startDate: new Date(),
                endDate: endDate,
                status: 'active'
            });
            const subscribeInfo = await UserSubscribeSchema.create({
                user_id: _id,
                package_id: package_id,
                cityCount: cityCount,
                city_ids: userCityIds,
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

                await notificationSchema.create({
                    user_id: _id,
                    title: 'Subscription Successful',
                    message: `You have successfully subscribed to the ${ existingPackage.title } package.`,
                    type: 'subscription',
                    entity_id: subscribeInfo._id,
                    is_read: false,
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
exports.getReferralServices = async (req, res) => {
    try {
        const { _id } = req.User;
        const { limit, pageNo } = req.query;
        const limits = limit ? parseInt(limit) : 10
        const offset = pageNo ? getOffset(parseInt(pageNo), limit) : 0
        const data = await userSchema.find(
            { referredBy: _id },
            {
                _id: 0,
                "user_id": "$_id",
                name: 1,
                email: 1,
                phone: 1,
                city_id: 1,
                address: 1,
                profileImage: 1,
                referredBy: 1,
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
 * login.
 *
 * @returns {Object}
 */
exports.getNotificationServices = async (req, res) => {
    try {
        const { _id } = req.User;
        const { limit, pageNo } = req.query;
        const limits = limit ? parseInt(limit) : 10
        const offset = pageNo ? getOffset(parseInt(pageNo), limit) : 0
        const data = await notificationSchema.find(
            { user_id: _id },
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
 * get.
 *
 * @returns {Object}
 */

exports.getUserFeedbackServices = async (req, res) => {
    try {
        const { _id } = req.User;
        // Find all subscriptions for the user and join with package info
        // Get all feedback entries for the user and join with user info

        const activeSubscription = await FeedbackSchema.find({ user_id: _id, feedback_type: 'direct' })
            .populate({ path: 'user_id', model: 'users', select: 'firstName lastName email profileImage' })
            .lean();

        // For each feedback, get its replies (self-join where feedback_id === _id)
        for (let feedback of activeSubscription) {
            feedback.replies = await FeedbackSchema.find({ feedback_id: feedback._id })
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
 * get.
 *
 * @returns {Object}
 */

exports.getVersionServices = async (req, res) => {
    try {
        // Find all subscriptions for the user and join with package info
        // Get all feedback entries for the user and join with user info
        const version = await VersionSchema.find();
        if (version.length) {
            return {
                status: 1,
                message: 'Successfully listed.',
                data: version[0],
            }
        } else {
            return { status: 0, message: 'No version found.' }
        }

    } catch (err) {
        console.log(err)
        return { status: 0, message: err }
    }
}

/**
 * get.
 *
 * @returns {Object}
 */

exports.forgotPasswordServices = async (req, res) => {
    try {
        const { email } = req.body;
        // Check if user exists by email
        const user = await userSchema.findOne({ email });
        if (user) {
            // Generate a 4-digit random OTP
            //const otp = Math.floor(1000 + Math.random() * 9000);
            const otp = 1234; // For testing purposes, use a fixed OTP
            // Update the user document with the OTP
            await userSchema.updateOne({ email }, { $set: { otp, otpExpireTime: Date.now() + 15 * 60 * 1000 } });
            return {
                status: 1,
                message: 'OTP sent successfully.',
                data: { email }
            };
        } else {
            return { status: 0, message: 'User not found.' };
        }

    } catch (err) {
        console.log(err)
        return { status: 0, message: err }
    }
}

/**
 * get.
 *
 * @returns {Object}
 */

exports.verifyOtpServices = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        // Check if user exists by email
        const user = await userSchema.findOne({ email, otp, otpExpireTime: { $gt: Date.now() } });
        if (user) {
            let salt = bcrypt.genSaltSync(saltRounds)
            let hash = bcrypt.hashSync(password, salt)
            let payload = {
                password: hash,
                auth_password: salt,
                grant: password,
                otp: null, // Clear OTP after successful verification
                otpExpireTime: null // Clear OTP expiration time
            }
            const updateResult = await userSchema.updateOne(
                { _id: user._id },
                { $set: payload }
            );
            if (updateResult.modifiedCount > 0) {
                // Delete all OAuth tokens for the current user after password change
                await OAuthTokenSchema.deleteMany({ user_id: user._id });
                return { status: 1, message: 'Password changed successfully.', data: { email } };
            } else {
                return { status: 0, message: 'Password not changed.' };
            }
        } else {
            return { status: 0, message: 'User not found or OTP expired.' };
        }

    } catch (err) {
        console.log(err)
        return { status: 0, message: err }
    }
}

/**
 * get.
 *
 * @returns {Object}
 */

exports.deleteAccountServices = async (req, res) => {
    try {
        const { _id } = req.User;
        // Check if user exists by email
        const user = await userSchema.findOne({ _id });
        if (user) {
            const updateResult = await userSchema.updateOne(
                { _id: user._id },
                { $set: { isActive: false, isDelete: true, updatedDate: new Date() } } // Set isActive to false and add updatedDate timestamp
            );
            if (updateResult.modifiedCount > 0) {
                // Delete all OAuth tokens for the current user after account deletion
                await OAuthTokenSchema.deleteMany({ user_id: _id });
                return { status: 1, message: 'Account deleted successfully.', data: { _id } };
            } else {
                return { status: 0, message: 'Account not deleted.' };
            }
        } else {
            return { status: 0, message: 'User not found.' };
        }

    } catch (err) {
        console.log(err)
        return { status: 0, message: err }
    }
}
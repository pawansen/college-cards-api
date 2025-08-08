const admin = require("firebase-admin");
const serviceAccount = require('../../../fcmServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

/**
 * 
 * sent push notification
 */
const sendFCMNotification = async (
    tokens,
    title,
    body,
    data = {},
    priority = "high"
) => {
    sendPushNotification(tokens, title, body, data);
};

const sendPushNotification = async (deviceToken, title, body, data = {}) => {
    // Ensure all data values are strings
    const stringifiedData = {};
    Object.keys(data).forEach(key => {
        stringifiedData[key] = String(data[key]);
    });

    const message = {
        token: deviceToken,
        notification: {
            title: title,
            body: body,
        },
        data: stringifiedData, // All values are now strings
        android: {
            priority: "high",
            notification: {
                sound: "default",
                channelId: "default", // must match the Android channel in your app
            },
        },
        apns: {
            payload: {
                aps: {
                    sound: "default",
                },
            },
            headers: {
                "apns-priority": "10",
            },
        },
    };
    try {
        const response = await admin.messaging().send(message);
        console.log("Successfully sent message:", response);
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

/**
 * 
 * Android Notification send
 */
const androidNotificationSend = (options) => {
    const message = {
        token: options.token,
        notification: {
            title: options.title,
            body: options.body
        },
        android: {
            notification: {
                // icon: 'stock_ticker_update',
                // color: '#7e55c3'
            }
        },
        data: { ...options.data },
    };
    console.log("message", message);
    // registration token.
    admin.messaging().send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}

/**
 * 
 * Apple notification send
 */
const appleNotificationSend = (options) => {
    const message = {
        token: options.token,
        notification: {
            title: options.title
        },
        apns: {
            payload: {
                aps: {
                    'mutable-content': 1
                }
            },
            fcm_options: {
                //image: 'https://foo.bar.pizza-monster.png'
            }
        },
        data: {}
    };
    // registration token.
    admin.messaging().send(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}


/**
 * 
 * @param req
 * @param res
 * @param next
 */
// export const sendFCMPush = async (
//     tokens,
//     title,
//     body,
//     data = {},
//     priority = "high",
//     notificationOptions = {
//         click_action: "FCM_PLUGIN_ACTIVITY",
//         icon: "ic_stat_icon",
//         sound: "default",
//         vibrate: true,
//     }) => {
//     tokens = !Array.isArray(tokens) ? [tokens] : tokens;
//     const fcmMessage = {
//         registration_ids: tokens,
//         collapse_key: "",
//         priority,
//         content_available: true,
//         notification: {
//             title,
//             body,
//             ...notificationOptions,
//         },
//         data: {
//             PATH: data,
//         },
//     };
//     fcm.send(fcmMessage, function (err, response) {
//         console.log("FCM Error", err);
//         console.log("FCM response", response);
//     });
// };

module.exports.sendFCMNotification = sendFCMNotification;
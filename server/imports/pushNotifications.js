const admin = require("firebase-admin");

const initFirebase = () => {
  const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
  // const serviceAccount = require(`${__dirname  }/keys/ojo-paritario-firebase-adminsdk-icj06-707e486c90.json`);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
};

initFirebase();

const sendPushToOneUser = async payload => {
  const message = {
    token: payload.token,
    notification: payload.notification
  };
  await sendMessage(message);
};

const sendPushToTopic = async payload => {
  const testNotification = !!payload?.testNotification;
  const environment = testNotification ? 'development' : process.env.ENVIRONMENT_TYPE;
  const appName = process.env.APP_NAME;
  const message = {
    topic: `${environment === "production" ? "" : `development-`}${appName}-${payload.topic}`,
    notification: payload.notification
  };
  await sendMessage(message);
};

module.exports = { sendPushToOneUser, sendPushToTopic };

const sendMessage = async message => {
  console.log("Sending push with payload:\n", message);
  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.log("Error sending message:", error);
  }
};

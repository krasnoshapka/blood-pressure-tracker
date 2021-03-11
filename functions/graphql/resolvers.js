const { db } = require('../util/admin');

async function user(parent, args, context, info) {
  const uid = parent ? parent.uid : args.uid;
  try {
    const doc = await db.doc(`/users/${uid}`).get();
    if (doc.exists) {
      const user = doc.data();
      user.id = doc.id;
      return user;
    }
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
}

async function notifications(parent, args, context, info) {
  try {
    const doc = await db.doc(`/users/${parent.id}`).get();
    if (doc.exists) {
      const user = doc.data();
      return user.notifications;
    }
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
}

async function records(parent, args, context, info) {
  try {
    let queryRef = db.collection('records').where('user', '==', args.uid);
    if (args.start) {
      queryRef = queryRef.where('datetime', '>=', new Date(args.start));
    }
    if (args.end) {
      queryRef = queryRef.where('datetime', '<=', new Date (args.end));
    }
    const data = await queryRef.orderBy('datetime', 'desc').get();
    const records = [];
    data.forEach((doc) => {
      records.push({
        id: doc.id,
        uid: args.uid,
        datetime: doc.data().datetime.toDate(),
        sys: doc.data().sys,
        dia: doc.data().dia,
        pul: doc.data().pul
      });
    });
    return records;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
}

const resolvers = {
  Query: {
    user,
    records
  },
  User: {
    notifications
  },
  Record: {
    user
  }
};

module.exports = resolvers;

const {ValidationError, AuthenticationError} = require('apollo-server-express');
const { db, firebase } = require('../util/firebase');
const { GraphQLScalarType, Kind } = require('graphql');

/* SCALARS */

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

/* USERS */

const { validateLoginData, validateSignUpData } = require('../util/validators');

async function loginUser(parent, args, context, info) {
  const { valid, errors } = validateLoginData(args);
  if (!valid) throw new ValidationError(JSON.stringify(errors));

  try {
    const res = await firebase.auth().signInWithEmailAndPassword(args.email, args.password);
    if (res.user) {
      return res.user.getIdToken();
    }
  } catch (e) {
    console.error(e);
    throw new ValidationError(e.message);
  }
}

async function signUpUser(parent, args, context, info) {
  const { valid, errors } = validateSignUpData(args);
  if (!valid) throw new ValidationError(JSON.stringify(errors));


  try {
    // Check that user already exist
    const check = await db.collection('users').where('email', '==', args.email).get();
    if (check._size > 0) {
      throw new ValidationError('this email is already registered');
    } else {
      const res = await firebase.auth().createUserWithEmailAndPassword(args.email, args.password);
      if (res.user) {
        // Create user in database
        await db.doc(`/users/${res.user.uid}`).set({
          email: args.email
        });

        return res.user.getIdToken();
      }
    }
  } catch(e) {
    console.error(e);
    throw new ValidationError(e.message);
  }
}

async function user(parent, args, context, info) {
  const uid = parent ? parent.uid : context.uid;
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

/* RECORDS */

async function records(parent, args, context, info) {
  try {
    let queryRef = db.collection('records').where('user', '==', context.uid);
    if (args.start) {
      queryRef = queryRef.where('datetime', '>=', args.start);
    }
    if (args.end) {
      queryRef = queryRef.where('datetime', '<=', args.end);
    }
    const data = await queryRef.orderBy('datetime', 'desc').get();
    const records = [];
    data.forEach((doc) => {
      records.push({
        id: doc.id,
        uid: context.uid,
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

async function addRecord(parent, args, context, info) {
  // Todo: implement better validation of args.
  if (args.sys <= 0) {
    throw new ValidationError('Sys pressure must not be negative');
  }

  if (args.dia <= 0) {
    throw new ValidationError('Dia pressure must not be negative');
  }

  if (args.pul <= 0) {
    throw new ValidationError('Pulse must not be negative');
  }

  const newRecord = {
    user: context.uid,
    sys: args.sys,
    dia: args.dia,
    pul: args.pul,
    datetime: new Date()
  }
  try {
    const doc = await db.collection('records').add(newRecord);
    if (doc.id) {
      newRecord.id = doc.id;
      return newRecord;
    }
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
}

async function deleteRecord(parent, args, context, info) {
  try {
    const doc = await db.doc(`/records/${args.id}`).get();

    if (!doc.exists) {
      throw new ValidationError('Record not found');
    }
    if (doc.data().user !== context.uid) {
      throw new AuthenticationError('UnAuthorized');
    }

    const res = await db.doc(`/records/${args.id}`).delete();
    return true;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
}

const resolvers = {
  Date: dateScalar,
  Mutation: {
    addRecord,
    deleteRecord,
    loginUser,
    signUpUser
  },
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

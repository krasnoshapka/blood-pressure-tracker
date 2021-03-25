const {UserInputError, AuthenticationError} = require('apollo-server-express');
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

async function signInUser(parent, args, context, info) {
  const { valid, errors } = validateLoginData(args);
  if (!valid) {
    for (let key in errors) {
      throw new UserInputError(errors[key], {
        argumentName: key
      });
    }
  }

  const res = await firebase.auth().signInWithEmailAndPassword(args.email, args.password);
  if (res.user) {
    return res.user.getIdToken();
  }
}

async function signUpUser(parent, args, context, info) {
  const { valid, errors } = validateSignUpData(args);
  if (!valid) {
    for (let key in errors) {
      throw new UserInputError(errors[key], {
        argumentName: key
      });
    }
  }

  // Check that user already exist
  const check = await db.collection('users').where('email', '==', args.email).get();
  if (check._size > 0) {
    throw new UserInputError('this email is already registered', {argumentName: 'email'});
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
      // Return all records for the whole end day
      const end = new Date(args.end.setHours(23, 59, 59));
      queryRef = queryRef.where('datetime', '<=', end);
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
    throw new UserInputError('Sys pressure must not be negative', {argumentName: 'sys'});
  }

  if (args.dia <= 0) {
    throw new UserInputError('Dia pressure must not be negative', {argumentName: 'dia'});
  }

  if (args.pul <= 0) {
    throw new UserInputError('Pulse must not be negative', {argumentName: 'pul'});
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
      throw new UserInputError('Record not found');
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
    signInUser,
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

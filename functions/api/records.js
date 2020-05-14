const { db } = require('../util/admin');

exports.getAllRecords = (request, response) => {
  db
    .collection('records')
    .orderBy('datetime', 'desc')
    .get()
    .then((data) => {
      let records = [];
      data.forEach((doc) => {
        records.push({
          id: doc.id,
          user: doc.data().user,
          datetime: doc.data().datetime,
          sys: doc.data().sys,
          dia: doc.data().dia,
          pul: doc.data().pul
        });
      });
      return response.json(records);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code});
    });
};

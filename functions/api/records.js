const { db } = require('../util/admin');

exports.getAllRecords = (request, response) => {
  const user = request.params.user;
  db
    .collection('records')
    .where('user', '=', user)
    .orderBy('datetime', 'desc')
    .get()
    .then((data) => {
      let records = [];
      data.forEach((doc) => {
        records.push({
          id: doc.id,
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

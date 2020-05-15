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

exports.postAddRecord = (request, response) => {
  if (request.body.sys.trim() === '') {
    return response.status(400).json({ body: 'Sys pressure not be empty' });
  }

  if (request.body.dia.trim() === '') {
    return response.status(400).json({ body: 'Dia pressure not be empty' });
  }

  if (request.body.pul.trim() === '') {
    return response.status(400).json({ body: 'Pulse not be empty' });
  }

  const newRecord = {
    // TODO: Identify user here and get user id
    user: "1",
    sys: request.body.sys,
    dia: request.body.dia,
    pul: request.body.pul,
    datetime: new Date().toISOString()
  }
  db
    .collection('records')
    .add(newRecord)
    .then((doc)=>{
      const responseRecord = newRecord;
      responseRecord.id = doc.id;
      return response.json(responseRecord);
    })
    .catch((err) => {
      response.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
}

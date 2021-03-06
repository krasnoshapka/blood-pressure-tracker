const { db } = require('../util/firebase');

exports.getAllRecords = (request, response) => {
  const user = request.user.uid;
  const start = new Date(request.query.start);
  const end = new Date (request.query.end);

  db
    .collection('records')
    .where('user', '==', user)
    .where('datetime', '>=', start)
    .where('datetime', '<=', end)
    .orderBy('datetime', 'desc')
    .get()
    .then((data) => {
      let records = [];
      data.forEach((doc) => {
        records.push({
          id: doc.id,
          datetime: doc.data().datetime.toDate(),
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

exports.postRecord = (request, response) => {
  if (request.body.sys.trim() === '') {
    return response.status(400).json({ sys: 'Sys pressure must not be empty' });
  }

  if (request.body.dia.trim() === '') {
    return response.status(400).json({ dia: 'Dia pressure must not be empty' });
  }

  if (request.body.pul.trim() === '') {
    return response.status(400).json({ pul: 'Pulse must not be empty' });
  }

  const newRecord = {
    user: request.user.uid,
    sys: request.body.sys,
    dia: request.body.dia,
    pul: request.body.pul,
    datetime: new Date()
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

exports.deleteRecord = (request, response) => {
  const document = db.doc(`/records/${request.params.record}`);
  document
    .get()
    .then((doc) => {
      if(doc.data().user !== request.user.uid){
        return response.status(403).json({error:"UnAuthorized"})
      }
      if (!doc.exists) {
        return response.status(404).json({ error: 'Record not found' })
      }
      return document.delete();
    })
    .then(() => {
      response.json({ message: 'Delete successfull' });
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code });
    });
};

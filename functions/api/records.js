const { db } = require('../util/admin');

exports.getAllRecords = (request, response) => {
  const user = request.user.uid;
  db
    .collection('records')
    .where('user', '==', user)
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

exports.postRecord = (request, response) => {
  if (request.body.sys.trim() === '') {
    return response.status(400).json({ body: 'Sys pressure must not be empty' });
  }

  if (request.body.dia.trim() === '') {
    return response.status(400).json({ body: 'Dia pressure must not be empty' });
  }

  if (request.body.pul.trim() === '') {
    return response.status(400).json({ body: 'Pulse must not be empty' });
  }

  const newRecord = {
    user: request.user.uid,
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

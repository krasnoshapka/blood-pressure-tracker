exports.getAllRecords = (request, response) => {
  records = [
    {
      'id': 1,
      'user': 1,
      'datetime': new Date().toJSON(),
      'sys': 150,
      'dia': 100,
      'pul': 80
    },
    {
      'id': 2,
      'user': 1,
      'datetime': new Date().toJSON(),
      'sys': 130,
      'dia': 90,
      'pul': 75
    }
  ]
  return response.json(records);
}

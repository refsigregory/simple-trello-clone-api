db.createUser({
  user  : "root",
  pwd   : "Y3SQSvDrDA6Q23BW",
  roles : [
    {
      role  : "readWrite",
      db    : "trello_clone_db",
    }
  ]
})
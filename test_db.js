const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://wwwmdataur7250570798:Ataur20102002@cluster0.ofnwl7a.mongodb.net/NextMyTrip").then(() => {
  return mongoose.connection.db.collection('hotels').find().toArray();
}).then(res => {
  console.log("Found " + res.length + " hotels");
  console.log(res.map(h => h.hotelName));
  process.exit(0);
}).catch(console.error);

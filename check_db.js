const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://wwwmdataur7250570798:Ataur20102002@cluster0.ofnwl7a.mongodb.net/NextMyTrip";

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');
    const hotels = await mongoose.connection.db.collection('hotels').find({}).toArray();
    console.log('Total hotels in "hotels" collection:', hotels.length);
    if (hotels.length > 0) {
      console.log('Sample hotel name:', hotels[0].hotelName);
    }
    const listings = await mongoose.connection.db.collection('hotellistings').find({}).toArray();
    console.log('Total hotel listings in "hotellistings" collection:', listings.length);
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();

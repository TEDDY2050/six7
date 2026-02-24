const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models (Ensure these paths match your actual backend folder structure)
const User = require('./models/User');
const Game = require('./models/Game');
const Station = require('./models/Station');

dotenv.config();

const seedData = async () => {
  try {
    // 1. Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for Seeding...");

    // 2. Clear existing data
    await User.deleteMany({});
    await Game.deleteMany({});
    await Station.deleteMany({});
    console.log("🗑️  Existing Data Cleared...");

    // 3. Hash Passwords (Important for login to work)
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const staffPassword = await bcrypt.hash('staff123', salt);
    const customerPassword = await bcrypt.hash('customer123', salt);

    // 4. Create Default Users
    await User.create([
      { name: 'Admin User', email: 'admin@gamearena.com', password: adminPassword, role: 'admin' },
      { name: 'Staff User', email: 'staff@gamearena.com', password: staffPassword, role: 'staff' },
      { name: 'Customer User', email: 'customer@gamearena.com', password: customerPassword, role: 'customer' }
    ]);
    console.log("📥 Default Users Imported...");

    // 5. Create Default Games
    await Game.create([
      {
        title: 'Valorant', genre: 'FPS', platform: 'PC',
        image: 'https://cdn2.steamgriddb.com/grid/c5e1219e6e9dac38de5daf7dcbdfc4c0.jpg',
      },
      {
        title: 'League of Legends', genre: 'MOBA', platform: 'PC',
        image: 'https://cdn2.steamgriddb.com/grid/fb59fd77793bad745ffb8db3d75abe29.jpg',
      },
      {
        title: 'CS2', genre: 'FPS', platform: 'PC',
        image: 'https://cdn2.steamgriddb.com/grid/f38960b6a8870ba19a622e60eda88498.jpg',
      },
      {
        title: 'GTA V', genre: 'Action', platform: 'PC',
        image: 'https://cdn2.steamgriddb.com/grid/97ac43f00a2776ba97386dcbf0af8225.jpg',
      },
      {
        title: 'Spider-Man 2', genre: 'Action', platform: 'PS5',
        image: 'https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/1c7b75d8ob3vna6vhb4a87ki5.png',
      },
      {
        title: 'God of War Ragnarök', genre: 'Action', platform: 'PS5',
        image: 'https://image.api.playstation.com/vulcan/ap/rnd/202109/1321/8O9NN6eNBJsGR3ZoMGnMOhlI.png',
      },
      {
        title: 'FC 25', genre: 'Sports', platform: 'PS5',
        image: 'https://image.api.playstation.com/vulcan/ap/rnd/202408/1423/3fbda3b5dee41bf4ea74e33ea63e9d8c0f9a3e52f6e5b61a.png',
      },
      {
        title: 'Forza Horizon 5', genre: 'Racing', platform: 'Simulator',
        image: 'https://cdn2.steamgriddb.com/grid/9b47dd6a70dee2da22d7d17a3a49e2da.jpg',
      },
      {
        title: 'Assetto Corsa', genre: 'Racing', platform: 'Simulator',
        image: 'https://cdn2.steamgriddb.com/grid/8a4769eda8a4c66a394d6b63027d2c2c.jpg',
      },
    ]);
    console.log("📥 Default Games Imported...");

    // 6. Create Stations (10 PCs, 4 PS5s, 2 Simulators)
    const stations = [];
    for (let i = 1; i <= 10; i++) stations.push({ name: `PC-${i}`, type: 'PC', pricePerHour: 99, status: 'Available' });
    for (let i = 1; i <= 4; i++) stations.push({ name: `PS5-${i}`, type: 'PS5', pricePerHour: 200, status: 'Available' });
    for (let i = 1; i <= 2; i++) stations.push({ name: `Sim-${i}`, type: 'Simulator', pricePerHour: 250, status: 'Available' });

    await Station.insertMany(stations);
    console.log("📥 Default Stations Imported...");

    console.log("✔️  Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
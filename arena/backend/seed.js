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
      { title: 'Valorant', genre: 'FPS', platform: 'PC' },
      { title: 'League of Legends', genre: 'MOBA', platform: 'PC' },
      { title: 'CS:GO', genre: 'FPS', platform: 'PC' },
      { title: 'GTA V', genre: 'Action', platform: 'PC' },
      { title: 'Spider-Man 2', genre: 'Action', platform: 'PS5' },
      { title: 'God of War Ragnarök', genre: 'Action', platform: 'PS5' },
      { title: 'FC 25', genre: 'Sports', platform: 'PS5' },
      { title: 'Forza Horizon 5', genre: 'Racing', platform: 'Simulator' },
      { title: 'Assetto Corsa', genre: 'Racing', platform: 'Simulator' },
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
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
      { title: 'Valorant', genre: 'FPS', pricePerHour: 50, platform: 'PC' },
      { title: 'League of Legends', genre: 'MOBA', pricePerHour: 40, platform: 'PC' },
      { title: 'CS:GO', genre: 'FPS', pricePerHour: 50, platform: 'PC' },
      { title: 'Spider-Man 2', genre: 'Action', pricePerHour: 60, platform: 'PS5' }
    ]);
    console.log("📥 Default Games Imported...");

    // 6. Create Stations (10 PCs, 4 PS5s, 2 Simulators)
    const stations = [];
    for (let i = 1; i <= 10; i++) stations.push({ name: `PC-${i}`, type: 'PC', status: 'Available' });
    for (let i = 1; i <= 4; i++) stations.push({ name: `PS5-${i}`, type: 'PS5', status: 'Available' });
    for (let i = 1; i <= 2; i++) stations.push({ name: `Sim-${i}`, type: 'Simulator', status: 'Available' });
    
    await Station.insertMany(stations);
    console.log("📥 Default Stations Imported...");

    console.log("✔️  Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
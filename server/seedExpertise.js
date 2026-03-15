const mongoose = require('mongoose');
require('dotenv').config();

const Expertise = require('./models/Expertise');

const expertiseData = [
  {
    title: 'Living Room Design',
    description: 'Conceptualizing and executing stunning living spaces that reflect your personality.',
    icon: '🛋️',
    order: 1
  },
  {
    title: 'Office Interiors',
    description: 'Creating productive and ergonomic workspaces that inspire innovation.',
    icon: '🏢',
    order: 2
  },
  {
    title: 'Bedroom Sanctuaries',
    description: 'Designing peaceful and luxurious retreats for ultimate relaxation.',
    icon: '🛏️',
    order: 3
  },
  {
    title: 'Architectural Planning',
    description: 'Comprehensive architectural solutions bringing classic structures to life.',
    icon: '📐',
    order: 4
  },
  {
    title: 'Commercial Spaces',
    description: 'Designing waiting rooms and lobbies that leave a lasting first impression.',
    icon: '🪑',
    order: 5
  },
  {
    title: 'Custom Furniture',
    description: 'Bespoke furniture pieces tailored to your specific style and space requirements.',
    icon: '🤝',
    order: 6
  }
];

const seedExpertise = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing expertise
    await Expertise.deleteMany({});
    console.log('Cleared existing expertise data');

    // Insert new expertise data
    const inserted = await Expertise.insertMany(expertiseData);
    console.log(`✅ Successfully seeded ${inserted.length} expertise items!`);

    // Display inserted data
    inserted.forEach((item) => {
      console.log(`   - ${item.title} (Order: ${item.order})`);
    });

    await mongoose.connection.close();
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding expertise:', error);
    process.exit(1);
  }
};

seedExpertise();

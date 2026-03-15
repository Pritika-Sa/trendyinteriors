const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./models/Category');
const connectDB = require('./config/db');

const seedCategories = async () => {
    try {
        await connectDB();

        // Clear existing categories
        await Category.deleteMany({});

        const defaultCategories = [
            {
                name: 'residential',
                displayName: 'Residential',
                description: 'Residential interior design projects',
                order: 1,
                isActive: true
            },
            {
                name: 'commercial',
                displayName: 'Commercial',
                description: 'Commercial and office interior projects',
                order: 2,
                isActive: true
            },
            {
                name: 'art-craft',
                displayName: 'Art & Craft',
                description: 'Art and craft projects',
                order: 3,
                isActive: true
            }
        ];

        await Category.insertMany(defaultCategories);
        console.log('✓ Default categories seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error.message);
        process.exit(1);
    }
};

seedCategories();

const mongoose = require('mongoose');
const Service = require('./models/Service');

const seedServices = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trendyinteriors', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Clear existing services
        await Service.deleteMany({});
        console.log('Cleared existing services');

        // Services data with icons and descriptions
        const servicesData = [
            {
                title: 'Interior Design',
                description: 'Transform your space with our expert interior design services. We create personalized environments that reflect your style and enhance your lifestyle with meticulous attention to detail.',
                icon: '🏛️',
                order: 1,
            },
            {
                title: 'Modern Design',
                description: 'Experience contemporary aesthetics with our modern design solutions. We blend functionality with cutting-edge style to create spaces that are both beautiful and practical.',
                icon: '✨',
                order: 2,
            },
            {
                title: 'Planning & Consultation',
                description: 'Comprehensive planning services from concept to completion. Our expert consultants guide you through every step, ensuring your vision becomes reality with precision and care.',
                icon: '📐',
                order: 3,
            },
        ];

        // Insert services
        const insertedServices = await Service.insertMany(servicesData);
        console.log(`✅ Successfully inserted ${insertedServices.length} services`);

        // Display inserted services
        insertedServices.forEach((service, index) => {
            console.log(`${index + 1}. ${service.icon} ${service.title}`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding services:', error);
        process.exit(1);
    }
};

seedServices();

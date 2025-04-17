const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed database...');
  
  // Create farmers
  const farmers = [
    {
      email: 'farmer1@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'John Doe',
      userType: 'FARMER',
      farmerProfile: {
        create: {
          farmName: 'Green Acres',
          location: 'Midwest, USA',
          farmSize: 150.5,
          cropTypes: ['Corn', 'Wheat', 'Soybeans']
        }
      }
    },
    {
      email: 'farmer2@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Sarah Miller',
      userType: 'FARMER',
      farmerProfile: {
        create: {
          farmName: 'Sunrise Farms',
          location: 'California, USA',
          farmSize: 75.2,
          cropTypes: ['Lettuce', 'Strawberries', 'Tomatoes']
        }
      }
    },
    {
      email: 'farmer3@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Miguel Rodriguez',
      userType: 'FARMER',
      farmerProfile: {
        create: {
          farmName: 'Rodriguez Family Farm',
          location: 'Texas, USA',
          farmSize: 200.0,
          cropTypes: ['Cotton', 'Peanuts', 'Sorghum']
        }
      }
    }
  ];

  // Create researchers/policymakers
  const researchers = [
    {
      email: 'researcher1@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Dr. Emily Chen',
      userType: 'RESEARCHER',
      researcherProfile: {
        create: {
          institution: 'Agricultural Research Institute',
          specialization: 'Soil Science',
          researchFocus: ['Soil Health', 'Sustainable Farming'],
          isPolicymaker: false
        }
      }
    },
    {
      email: 'policymaker1@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Robert Wilson',
      userType: 'RESEARCHER',
      researcherProfile: {
        create: {
          institution: 'Department of Agriculture',
          specialization: 'Agricultural Policy',
          researchFocus: ['Food Security', 'Rural Development'],
          isPolicymaker: true
        }
      }
    }
  ];

  // Insert users into database
  for (const farmer of farmers) {
    await prisma.user.create({
      data: farmer
    });
  }
  
  for (const researcher of researchers) {
    await prisma.user.create({
      data: researcher
    });
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
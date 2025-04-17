const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed database...');
  
  // Create regions
  const regions = [
    { name: 'Alberta', code: 'AB', type: 'province', country: 'Canada', area: 661848, agriculturalArea: 26500000 },
    { name: 'British Columbia', code: 'BC', type: 'province', country: 'Canada', area: 944735, agriculturalArea: 12800000 },
    { name: 'Manitoba', code: 'MB', type: 'province', country: 'Canada', area: 647797, agriculturalArea: 19400000 },
    { name: 'New Brunswick', code: 'NB', type: 'province', country: 'Canada', area: 72908, agriculturalArea: 3100000 },
    { name: 'Newfoundland and Labrador', code: 'NL', type: 'province', country: 'Canada', area: 405212, agriculturalArea: 1800000 },
    { name: 'Northwest Territories', code: 'NT', type: 'territory', country: 'Canada', area: 1346106, agriculturalArea: 500000 },
    { name: 'Nova Scotia', code: 'NS', type: 'province', country: 'Canada', area: 55284, agriculturalArea: 2900000 },
    { name: 'Nunavut', code: 'NU', type: 'territory', country: 'Canada', area: 2093190, agriculturalArea: 100000 },
    { name: 'Ontario', code: 'ON', type: 'province', country: 'Canada', area: 1076395, agriculturalArea: 22300000 },
    { name: 'Prince Edward Island', code: 'PE', type: 'province', country: 'Canada', area: 5660, agriculturalArea: 2400000 },
    { name: 'Quebec', code: 'QC', type: 'province', country: 'Canada', area: 1542056, agriculturalArea: 17100000 },
    { name: 'Saskatchewan', code: 'SK', type: 'province', country: 'Canada', area: 651036, agriculturalArea: 31200000 },
    { name: 'Yukon', code: 'YT', type: 'territory', country: 'Canada', area: 482443, agriculturalArea: 300000 }
  ];
  
  for (const region of regions) {
    await prisma.region.upsert({
      where: { name: region.name },
      update: region,
      create: region
    });
  }
  
  console.log('Regions seeded successfully.');
  
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
          location: 'Alberta, Canada',
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
          location: 'Ontario, Canada',
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
          location: 'Saskatchewan, Canada',
          farmSize: 200.0,
          cropTypes: ['Wheat', 'Canola', 'Barley']
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
    await prisma.user.upsert({
      where: { email: farmer.email },
      update: {},
      create: farmer
    });
  }
  
  for (const researcher of researchers) {
    await prisma.user.upsert({
      where: { email: researcher.email },
      update: {},
      create: researcher
    });
  }

  console.log('Users seeded successfully.');

  // Seed emissions data for each region
  const albertaRegion = await prisma.region.findUnique({ where: { code: 'AB' } });
  const skRegion = await prisma.region.findUnique({ where: { code: 'SK' } });
  const onRegion = await prisma.region.findUnique({ where: { code: 'ON' } });

  // Sample emissions data for 3 regions
  if (albertaRegion) {
    await prisma.emissionsData.upsert({
      where: { 
        regionId_year_quarter: {
          regionId: albertaRegion.id,
          year: 2023,
          quarter: 1
        } 
      },
      update: {},
      create: {
        regionId: albertaRegion.id,
        year: 2023,
        quarter: 1,
        totalEmissions: 18.3,
        methane: 6.8,
        nitrousOxide: 5.2,
        co2: 6.3,
        agriculture: 14.9,
        cropProduction: 5.6,
        livestock: 6.9,
        soilManagement: 1.8,
        energyUse: 3.1,
        landConversion: 0.9,
        source: 'Canadian Greenhouse Gas Monitoring Program'
      }
    });
  }

  if (skRegion) {
    await prisma.emissionsData.upsert({
      where: { 
        regionId_year_quarter: {
          regionId: skRegion.id,
          year: 2023,
          quarter: 1
        } 
      },
      update: {},
      create: {
        regionId: skRegion.id,
        year: 2023,
        quarter: 1,
        totalEmissions: 19.8,
        methane: 5.9,
        nitrousOxide: 7.6,
        co2: 6.3,
        agriculture: 16.2,
        cropProduction: 8.1,
        livestock: 4.8,
        soilManagement: 2.5,
        energyUse: 2.9,
        landConversion: 1.5,
        source: 'Canadian Greenhouse Gas Monitoring Program'
      }
    });
  }

  if (onRegion) {
    await prisma.emissionsData.upsert({
      where: { 
        regionId_year_quarter: {
          regionId: onRegion.id,
          year: 2023,
          quarter: 1
        } 
      },
      update: {},
      create: {
        regionId: onRegion.id,
        year: 2023,
        quarter: 1,
        totalEmissions: 15.6,
        methane: 4.2,
        nitrousOxide: 5.1,
        co2: 6.3,
        agriculture: 11.8,
        cropProduction: 4.6,
        livestock: 4.1,
        soilManagement: 2.2,
        energyUse: 3.5,
        landConversion: 1.2,
        source: 'Canadian Greenhouse Gas Monitoring Program'
      }
    });
  }

  console.log('Emissions data seeded successfully.');

  // Sample drought data
  if (albertaRegion) {
    await prisma.droughtData.upsert({
      where: { 
        regionId_year_month_category: {
          regionId: albertaRegion.id,
          year: 2023,
          month: 7,
          category: 'Crop Loss'
        } 
      },
      update: {},
      create: {
        regionId: albertaRegion.id,
        year: 2023,
        month: 7,
        severity: 7.2,
        category: 'Crop Loss',
        impactScore: 8.1,
        affectedArea: 1200000,
        source: 'Canadian Drought Outlook'
      }
    });
  }

  if (skRegion) {
    await prisma.droughtData.upsert({
      where: { 
        regionId_year_month_category: {
          regionId: skRegion.id,
          year: 2023,
          month: 7,
          category: 'Crop Loss'
        } 
      },
      update: {},
      create: {
        regionId: skRegion.id,
        year: 2023,
        month: 7,
        severity: 8.1,
        category: 'Crop Loss',
        impactScore: 8.7,
        affectedArea: 1800000,
        source: 'Canadian Drought Outlook'
      }
    });
  }

  console.log('Drought data seeded successfully.');

  // Sample agricultural data
  if (albertaRegion) {
    await prisma.agriculturalData.upsert({
      where: { 
        regionId_year: {
          regionId: albertaRegion.id,
          year: 2023
        } 
      },
      update: {},
      create: {
        regionId: albertaRegion.id,
        year: 2023,
        cropDiversity: 5.8,
        livestockDensity: 8.2,
        irrigation: 6.1,
        fertilizerUse: 8.4,
        landConversion: 7.2,
        sustainablePractices: 5.6,
        totalFarmland: 26500000,
        cropProduction: 31250000,
        livestockProduction: 5200000,
        source: 'Census of Agriculture Profile'
      }
    });
  }

  if (skRegion) {
    await prisma.agriculturalData.upsert({
      where: { 
        regionId_year: {
          regionId: skRegion.id,
          year: 2023
        } 
      },
      update: {},
      create: {
        regionId: skRegion.id,
        year: 2023,
        cropDiversity: 6.5,
        livestockDensity: 7.3,
        irrigation: 4.8,
        fertilizerUse: 7.9,
        landConversion: 6.8,
        sustainablePractices: 6.1,
        totalFarmland: 31200000,
        cropProduction: 38600000,
        livestockProduction: 3800000,
        source: 'Census of Agriculture Profile'
      }
    });
  }

  console.log('Agricultural data seeded successfully.');

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
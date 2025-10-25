import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Provinces
  console.log('📍 Seeding provinces...');
  const metroManila = await prisma.province.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Metro Manila',
      code: 'NCR',
    },
  });

  const cavite = await prisma.province.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Cavite',
      code: 'CAV',
    },
  });

  // Seed Cities
  console.log('🏙️  Seeding cities...');
  const quezonCity = await prisma.city.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Quezon City',
      provinceId: metroManila.id,
      code: 'QC',
    },
  });

  const manila = await prisma.city.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Manila',
      provinceId: metroManila.id,
      code: 'MNL',
    },
  });

  const pasig = await prisma.city.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Pasig',
      provinceId: metroManila.id,
      code: 'PAS',
    },
  });

  // Seed Barangays
  console.log('🏘️  Seeding barangays...');
  await prisma.barangay.createMany({
    skipDuplicates: true,
    data: [
      { id: 1, name: 'Barangay Commonwealth', cityId: quezonCity.id, zipCode: '1121' },
      { id: 2, name: 'Barangay Batasan Hills', cityId: quezonCity.id, zipCode: '1126' },
      { id: 3, name: 'Barangay Cubao', cityId: quezonCity.id, zipCode: '1109' },
      { id: 4, name: 'Barangay Ermita', cityId: manila.id, zipCode: '1000' },
      { id: 5, name: 'Barangay Malate', cityId: manila.id, zipCode: '1004' },
      { id: 6, name: 'Barangay Ugong', cityId: pasig.id, zipCode: '1604' },
    ],
  });

  // Seed Stores
  console.log('🏪 Seeding stores...');
  const mainStore = await prisma.store.upsert({
    where: { id: 'store-main-qc' },
    update: {},
    create: {
      id: 'store-main-qc',
      name: 'Main Store - Quezon City',
      cityId: quezonCity.id,
      address: 'Commonwealth Avenue, Quezon City, Metro Manila',
    },
  });

  await prisma.store.upsert({
    where: { id: 'store-manila' },
    update: {},
    create: {
      id: 'store-manila',
      name: 'Manila Store',
      cityId: manila.id,
      address: 'Ermita, Manila, Metro Manila',
    },
  });

  // Seed Agents
  console.log('👤 Seeding agents...');
  const hashedPassword = await bcrypt.hash('admin123', 12);

  await prisma.agent.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      id: 'agent-admin',
      username: 'admin',
      email: 'admin@smartify.com',
      passwordHash: hashedPassword,
      fullName: 'Admin User',
      storeId: mainStore.id,
      role: 'admin',
    },
  });

  await prisma.agent.upsert({
    where: { username: 'agent1' },
    update: {},
    create: {
      id: 'agent-001',
      username: 'agent1',
      email: 'agent1@smartify.com',
      passwordHash: hashedPassword,
      fullName: 'Agent One',
      storeId: mainStore.id,
      role: 'agent',
    },
  });

  // Seed Plans
  console.log('📱 Seeding plans...');
  await prisma.plan.upsert({
    where: { id: 'plan-1299' },
    update: {},
    create: {
      id: 'plan-1299',
      name: 'PLAN 1299',
      price: 1299,
      durationMonths: 12,
      features: {
        data: '25GB DATA',
        calls: 'Unli All-Net Mobile Calls & Texts',
        landline: 'Unli Landline Calls',
        streaming: 'Netflix Mobile',
      },
    },
  });

  await prisma.plan.upsert({
    where: { id: 'plan-2999' },
    update: {},
    create: {
      id: 'plan-2999',
      name: 'PLAN 2999',
      price: 2999,
      durationMonths: 24,
      features: {
        data: 'UNLI DATA',
        calls: 'Unli All-Net Mobile Calls & Texts',
        landline: 'Unli Landline Calls',
        streaming: 'Netflix Premium',
      },
    },
  });

  // Seed Devices
  console.log('📱 Seeding devices...');
  const iphone17ProMax = await prisma.device.upsert({
    where: { id: 'device-iphone-17-pro-max' },
    update: {},
    create: {
      id: 'device-iphone-17-pro-max',
      name: 'iPhone 17 Pro Max',
      brand: 'Apple',
      model: 'iPhone 17 Pro Max',
      basePrice: 89990,
      description: 'The ultimate iPhone with the most advanced technology, stunning display, and professional-grade camera system.',
      images: ['/images/iphone-17-pro-max-blue.jpg'],
    },
  });

  const iphone17Pro = await prisma.device.upsert({
    where: { id: 'device-iphone-17-pro' },
    update: {},
    create: {
      id: 'device-iphone-17-pro',
      name: 'iPhone 17 Pro',
      brand: 'Apple',
      model: 'iPhone 17 Pro',
      basePrice: 79990,
      description: 'Pro performance meets pro cameras in a stunning titanium design.',
      images: ['/images/iphone-17-pro.jpg'],
    },
  });

  const iphone17 = await prisma.device.upsert({
    where: { id: 'device-iphone-17' },
    update: {},
    create: {
      id: 'device-iphone-17',
      name: 'iPhone 17',
      brand: 'Apple',
      model: 'iPhone 17',
      basePrice: 59990,
      description: 'A beautiful design with powerful performance for everyday tasks.',
      images: ['/images/iphone-17.jpg'],
    },
  });

  const iphoneAir = await prisma.device.upsert({
    where: { id: 'device-iphone-air' },
    update: {},
    create: {
      id: 'device-iphone-air',
      name: 'iPhone Air',
      brand: 'Apple',
      model: 'iPhone Air',
      basePrice: 69990,
      description: 'Incredibly thin and light, yet powerful enough for everything you love.',
      images: ['/images/iphone-air.jpg'],
    },
  });

  // Seed Device Configurations
  console.log('🎨 Seeding device configurations...');
  await prisma.deviceConfiguration.createMany({
    skipDuplicates: true,
    data: [
      // iPhone 17 Pro Max
      { deviceId: iphone17ProMax.id, color: 'Deep Blue', storage: '128GB', priceAdjustment: 0, stockQuantity: 10 },
      { deviceId: iphone17ProMax.id, color: 'Deep Blue', storage: '256GB', priceAdjustment: 6000, stockQuantity: 8 },
      { deviceId: iphone17ProMax.id, color: 'Deep Blue', storage: '512GB', priceAdjustment: 12000, stockQuantity: 5 },
      { deviceId: iphone17ProMax.id, color: 'Deep Blue', storage: '1TB', priceAdjustment: 18000, stockQuantity: 3 },
      { deviceId: iphone17ProMax.id, color: 'Orange', storage: '128GB', priceAdjustment: 0, stockQuantity: 12 },
      { deviceId: iphone17ProMax.id, color: 'Orange', storage: '256GB', priceAdjustment: 6000, stockQuantity: 10 },

      // iPhone 17 Pro
      { deviceId: iphone17Pro.id, color: 'Silver', storage: '128GB', priceAdjustment: 0, stockQuantity: 15 },
      { deviceId: iphone17Pro.id, color: 'Silver', storage: '256GB', priceAdjustment: 5000, stockQuantity: 12 },
      { deviceId: iphone17Pro.id, color: 'Deep Blue', storage: '128GB', priceAdjustment: 0, stockQuantity: 10 },

      // iPhone 17
      { deviceId: iphone17.id, color: 'Purple', storage: '128GB', priceAdjustment: 0, stockQuantity: 20 },
      { deviceId: iphone17.id, color: 'Purple', storage: '256GB', priceAdjustment: 4000, stockQuantity: 15 },
      { deviceId: iphone17.id, color: 'Black', storage: '128GB', priceAdjustment: 0, stockQuantity: 18 },

      // iPhone Air
      { deviceId: iphoneAir.id, color: 'Sky Blue', storage: '128GB', priceAdjustment: 0, stockQuantity: 15 },
      { deviceId: iphoneAir.id, color: 'Sky Blue', storage: '256GB', priceAdjustment: 4500, stockQuantity: 12 },
      { deviceId: iphoneAir.id, color: 'Gold', storage: '128GB', priceAdjustment: 0, stockQuantity: 10 },
    ],
  });

  console.log('✅ Database seed completed successfully!');
  console.log('');
  console.log('🔑 Default Credentials:');
  console.log('  Username: admin');
  console.log('  Password: admin123');
  console.log('  Email: admin@smartify.com');
  console.log('');
  console.log('  Username: agent1');
  console.log('  Password: admin123');
  console.log('  Email: agent1@smartify.com');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

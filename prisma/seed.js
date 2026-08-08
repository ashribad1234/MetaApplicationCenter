const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Meta Accounts Center database...');

  // Delete existing records
  await prisma.activityLog.deleteMany();
  await prisma.privacySetting.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.connectedAccount.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // 1. Create Demo User
  const demoUser = await prisma.user.create({
    data: {
      name: 'Alex Morgan',
      email: 'demo@redsoftware.in',
      passwordHash: hashedPassword,
      phone: '+1 (555) 234-5678',
      dateOfBirth: '1995-06-15',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      is2FAEnabled: true,
    },
  });

  // 2. Create Privacy Settings
  await prisma.privacySetting.create({
    data: {
      userId: demoUser.id,
      profileVisibility: 'EVERYONE',
      emailVisibility: 'ONLY_ME',
      phoneVisibility: 'ONLY_ME',
      personalizedAds: true,
      dataSharing: false,
    },
  });

  // 3. Create Connected Accounts
  await prisma.connectedAccount.createMany({
    data: [
      {
        userId: demoUser.id,
        provider: 'INSTAGRAM',
        providerAccountId: 'ig_987654',
        providerUsername: 'alex.morgan_official',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      },
      {
        userId: demoUser.id,
        provider: 'FACEBOOK',
        providerAccountId: 'fb_123456',
        providerUsername: 'Alex Morgan',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      },
    ],
  });

  // 4. Create User Sessions
  await prisma.userSession.createMany({
    data: [
      {
        userId: demoUser.id,
        token: 'mock-session-token-desktop-1',
        deviceName: 'Windows PC (Chrome)',
        deviceType: 'Desktop',
        browser: 'Chrome 122.0',
        os: 'Windows 11',
        ipAddress: '192.168.1.105',
      },
      {
        userId: demoUser.id,
        token: 'mock-session-token-mobile-2',
        deviceName: 'iPhone 15 Pro (Safari)',
        deviceType: 'Mobile',
        browser: 'Safari Mobile',
        os: 'iOS 17.3',
        ipAddress: '172.56.21.89',
      },
    ],
  });

  // 5. Create Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: demoUser.id,
        actionType: 'LOGIN',
        description: 'Successful login from Windows PC (Chrome)',
        ipAddress: '192.168.1.105',
        deviceName: 'Windows PC',
        browser: 'Chrome 122.0',
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      },
      {
        userId: demoUser.id,
        actionType: 'ACCOUNT_CONNECTED',
        description: 'Connected Instagram account @alex.morgan_official',
        ipAddress: '192.168.1.105',
        deviceName: 'Windows PC',
        browser: 'Chrome 122.0',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        userId: demoUser.id,
        actionType: 'PRIVACY_UPDATE',
        description: 'Updated phone visibility to ONLY_ME',
        ipAddress: '172.56.21.89',
        deviceName: 'iPhone 15 Pro',
        browser: 'Safari Mobile',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
    ],
  });

  console.log('Database seeded successfully!');
  console.log('Demo Credentials: demo@redsoftware.in / Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

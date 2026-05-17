import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with test data...')

  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin1@test.com' },
    update: {},
    create: {
      email: 'admin1@test.com',
      clerkId: 'seed_admin_1',
      name: 'Sarah Admin',
      role: 'ADMIN',
      department: 'HR'
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager1@test.com' },
    update: {},
    create: {
      email: 'manager1@test.com',
      clerkId: 'seed_manager_1',
      name: 'Michael Manager',
      role: 'MANAGER',
      department: 'Engineering',
      managerId: admin.id
    },
  })

  const employee = await prisma.user.upsert({
    where: { email: 'employee1@test.com' },
    update: {},
    create: {
      email: 'employee1@test.com',
      clerkId: 'seed_employee_1',
      name: 'Alex Employee',
      role: 'EMPLOYEE',
      department: 'Frontend Dev',
      managerId: manager.id
    },
  })

  // 2. Create Goal Sheets
  const sheet1 = await prisma.goalSheet.create({
    data: {
      userId: employee.id,
      year: 2026,
      status: 'APPROVED',
      lockedAt: new Date(),
      goals: {
        create: [
          {
            title: 'Improve Core Web Vitals',
            description: 'Achieve a Lighthouse performance score of 95+ across all core pages.',
            thrustArea: 'Engineering Excellence',
            uomType: 'MIN_NUMERIC',
            target: 95,
            weightage: 50,
          },
          {
            title: 'Zero Severity 1 Bugs',
            description: 'Ensure no major production outages occur due to frontend bugs.',
            thrustArea: 'Quality',
            uomType: 'ZERO',
            target: 0,
            weightage: 30,
          },
          {
            title: 'Migrate to Tailwind v4',
            description: 'Complete the migration within 30 days.',
            thrustArea: 'Tech Debt',
            uomType: 'TIMELINE',
            target: 30,
            weightage: 20,
          }
        ]
      }
    }
  })

  // 3. Create Check-Ins
  const goals = await prisma.goal.findMany({ where: { goalSheetId: sheet1.id } })
  
  for (const goal of goals) {
    if (goal.uomType === 'MIN_NUMERIC') {
      await prisma.checkIn.create({
        data: {
          goalId: goal.id,
          quarter: 'Q1',
          actualAchievement: 88,
          status: 'ON_TRACK',
          systemScore: 88 / 95, // ~0.92
          managerComment: 'Great progress so far, but let us focus on CLS in Q2.',
        }
      })
    } else if (goal.uomType === 'ZERO') {
      await prisma.checkIn.create({
        data: {
          goalId: goal.id,
          quarter: 'Q1',
          actualAchievement: 0,
          status: 'COMPLETED',
          systemScore: 1.0,
          managerComment: 'Perfect execution on quality control.',
        }
      })
    }
  }

  // 4. Create Audit Logs
  await prisma.auditLog.create({
    data: {
      entity: 'GoalSheet',
      entityId: sheet1.id,
      action: 'APPROVED',
      changedBy: manager.id,
      timestamp: new Date()
    }
  })

  console.log('Seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

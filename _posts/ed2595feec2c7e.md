---
title: "Prisma ORM กับ SQLite"
emoji: "🤖"
type: "tutorial" 
topics: []
published: false
---

บทเรียนเริ่มต้นใช้งาน Prisma ORM กับ SQLite กัน โดยอิงจากเอกสารประกอบ Prisma Quickstart

**บทเรียน: เริ่มต้นใช้งาน Prisma ORM กับ SQLite**

**เป้าหมาย:**
* เข้าใจหลักการทำงานเบื้องต้นของ Prisma ORM
* สามารถตั้งค่าโปรเจกต์ TypeScript เพื่อใช้งาน Prisma กับ SQLite ได้
* สามารถกำหนด Data Model ใน Prisma Schema ได้
* สามารถทำการ Migrate ฐานข้อมูลได้
* สามารถใช้ Prisma Client เพื่อจัดการข้อมูลเบื้องต้น (CRUD) ได้

**สิ่งที่ต้องมี:**
* Node.js เวอร์ชั่น 14.17.0 หรือใหม่กว่า
* ความเข้าใจพื้นฐานเกี่ยวกับ TypeScript

**ขั้นตอน:**

**1. สร้างโปรเจกต์ TypeScript และติดตั้ง Prisma**

* **สร้างโฟลเดอร์โปรเจกต์:**
  ```bash
  mkdir my-prisma-project
  cd my-prisma-project
  ```
* **เริ่มต้นโปรเจกต์ Node.js และติดตั้ง TypeScript:**
  ```bash
  npm init -y
  npm install typescript ts-node @types/node --save-dev
  npx tsc --init
  ```
* **ติดตั้ง Prisma CLI:**
  ```bash
  npm install prisma --save-dev
  ```
* **เริ่มต้น Prisma และกำหนดค่าให้ใช้ SQLite:**
  ```bash
  npx prisma init --datasource-provider sqlite
  ```
  คำสั่งนี้จะสร้าง:
    * โฟลเดอร์ `prisma` พร้อมไฟล์ `schema.prisma` สำหรับกำหนดโครงสร้างฐานข้อมูล
    * ไฟล์ `.env` สำหรับเก็บ Environment Variables เช่น connection string ของฐานข้อมูล

**2. กำหนด Data Model ใน Prisma Schema**

* เปิดไฟล์ `prisma/schema.prisma`
* ไฟล์นี้จะมีการกำหนดค่าเริ่มต้นสำหรับ `datasource` (แหล่งข้อมูล) และ `generator` (ตัวสร้าง Client)
  ```prisma
  // prisma/schema.prisma

  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "sqlite" // ระบุว่าใช้ SQLite
    url      = env("DATABASE_URL") // ดึงค่า connection string จากไฟล์ .env
  }
  ```
* **กำหนด Model:** เพิ่ม Model (ซึ่งจะกลายเป็นตารางในฐานข้อมูล) เข้าไปในไฟล์ ตัวอย่างเช่น สร้าง Model ชื่อ `User`:
  ```prisma
  // prisma/schema.prisma

  // ... (ส่วน generator และ datasource)

  model User {
    id    Int     @id @default(autoincrement()) // Primary Key, Auto-increment
    email String  @unique // ค่าใน field นี้ต้องไม่ซ้ำกัน
    name  String? // Optional field (อาจมีค่าหรือไม่มีก็ได้)
  }

  model Post {
    id        Int     @id @default(autoincrement())
    title     String
    content   String?
    published Boolean @default(false) // ค่าเริ่มต้นเป็น false
    author    User    @relation(fields: [authorId], references: [id]) // สร้างความสัมพันธ์กับ Model User
    authorId  Int     // Foreign Key
  }
  ```
  * `@id` ระบุว่าเป็น Primary Key
  * `@default(autoincrement())` กำหนดให้ค่าเพิ่มอัตโนมัติ
  * `@unique` กำหนดว่าค่าในคอลัมน์นี้ต้องไม่ซ้ำกัน
  * `?` หลังประเภทข้อมูล (เช่น `String?`) หมายถึง Field นั้นเป็น Optional
  * `@relation` ใช้สร้างความสัมพันธ์ระหว่างตาราง

**3. ทำการ Migrate ฐานข้อมูล**

* **รัน Migrate:** คำสั่งนี้จะสร้างไฟล์ฐานข้อมูล SQLite (ถ้ายังไม่มี) และสร้างตารางตาม Model ที่กำหนดใน `schema.prisma`
  ```bash
  npx prisma migrate dev --name init
  ```
  * Prisma จะสร้างไฟล์ฐานข้อมูล `dev.db` (หรือชื่ออื่นตามที่กำหนดใน `.env`) ภายในโฟลเดอร์ `prisma`
  * คำสั่งนี้จะสร้างไฟล์ SQL สำหรับการ Migration และนำไปรันกับฐานข้อมูลจริง
  * นอกจากนี้ยังเป็นการ Generate Prisma Client ไปในตัวด้วย

**4. ติดตั้งและใช้งาน Prisma Client**

* **ติดตั้ง Prisma Client:** แม้ `migrate dev` จะ generate ให้แล้ว แต่เราต้องติดตั้ง package ด้วย
  ```bash
  npm install @prisma/client
  ```
* **สร้างไฟล์สำหรับเรียกใช้งาน Prisma Client:** สร้างไฟล์ใหม่ เช่น `src/index.ts` (หรือที่อื่นตามโครงสร้างโปรเจกต์ของคุณ)
* **Import และ khởi tạo Prisma Client:**
  ```typescript
  // src/index.ts
  import { PrismaClient } from '@prisma/client';

  const prisma = new PrismaClient();

  async function main() {
    // ... เขียนโค้ดสำหรับโต้ตอบกับฐานข้อมูลที่นี่ ...

    // ตัวอย่าง: สร้าง User ใหม่
    const newUser = await prisma.user.create({
      data: {
        name: 'Alice',
        email: 'alice@example.com',
      },
    });
    console.log('Created new user: ', newUser);

    // ตัวอย่าง: ดึงข้อมูล User ทั้งหมด
    const allUsers = await prisma.user.findMany();
    console.log('All users: ');
    console.dir(allUsers, { depth: null });

    // ตัวอย่าง: สร้าง Post ใหม่ที่เชื่อมโยงกับ User
    const newPost = await prisma.post.create({
        data: {
            title: 'Hello World',
            content: 'This is my first post!',
            author: {
                connect: { email: 'alice@example.com' }, // เชื่อมกับ User ที่มี email นี้
            },
        },
    });
    console.log('Created new post:', newPost);

    // ตัวอย่าง: ดึงข้อมูล Post ทั้งหมดพร้อมข้อมูลผู้เขียน
    const allPosts = await prisma.post.findMany({
        include: { author: true }, // ดึงข้อมูล author มาด้วย
    });
    console.log('All posts with author:');
    console.dir(allPosts, { depth: null });

  }

  main()
    .catch(async (e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect(); // ปิด connection เมื่อทำงานเสร็จ
    });
  ```
  * `prisma.user.create()` ใช้สร้างข้อมูลใหม่ในตาราง `User`
  * `prisma.user.findMany()` ใช้ดึงข้อมูลทั้งหมดจากตาราง `User`
  * `prisma.post.create()` พร้อม `connect` ใช้สร้างข้อมูล `Post` และเชื่อมความสัมพันธ์กับ `User` ที่มีอยู่
  * `include` ใน `findMany()` ใช้ดึงข้อมูลจากตารางที่สัมพันธ์กันมาด้วย

* **รันโค้ด TypeScript:**
  ```bash
  npx ts-node src/index.ts
  ```

**5. (ทางเลือก) ใช้ Prisma Studio**

* Prisma Studio เป็นเครื่องมือ GUI สำหรับดูและแก้ไขข้อมูลในฐานข้อมูลของคุณ
* รันคำสั่ง:
  ```bash
  npx prisma studio
  ```
* เบราว์เซอร์จะเปิดขึ้นมา แสดงหน้าจอสำหรับจัดการข้อมูลในฐานข้อมูล SQLite ของคุณ

**สรุป:**

บทเรียนนี้ได้แนะนำขั้นตอนพื้นฐานในการเริ่มต้นใช้งาน Prisma ORM กับฐานข้อมูล SQLite ตั้งแต่การตั้งค่าโปรเจกต์, การกำหนด Schema, การ Migrate ฐานข้อมูล, ไปจนถึงการใช้ Prisma Client เพื่อจัดการข้อมูลเบื้องต้น Prisma ช่วยให้การทำงานกับฐานข้อมูลในโปรเจกต์ TypeScript/JavaScript ง่ายขึ้นและมี type-safety มากขึ้น
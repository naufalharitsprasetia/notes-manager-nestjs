# Notes Manager App

## 1. Penjelasan Project

**Notes Manager App** adalah aplikasi manajemen catatan (notes) berbasis web yang dibangun menggunakan **NestJS, TypeScript, TypeORM, MySQL, dan EJS**.  
Aplikasi ini memungkinkan pengguna untuk:

- Mendaftar (membuat akun) dan login
- Mengelola catatan pribadi / notes (CRUD)
- Mencari catatan
- Admin memiliki hak istimewa untuk mengelola semua user dan catatan

Tujuan project ini adalah menyediakan **aplikasi CRUD sederhana** dengan arsitektur yang rapi dan mudah dikembangkan.

---

## 2. Desain Database

Aplikasi menggunakan **MySQL** dengan 2 tabel utama:

### Tabel `user`

| Column   | Type    | Keterangan      |
| -------- | ------- | --------------- |
| id       | int PK  | Primary key     |
| name     | varchar | Nama user       |
| email    | varchar | Email unik      |
| password | varchar | Password hashed |
| role     | varchar | user/admin      |

### Tabel `note`

| Column  | Type    | Keterangan               |
| ------- | ------- | ------------------------ |
| id      | int PK  | Primary key              |
| title   | varchar | Judul catatan            |
| content | text    | Isi catatan              |
| userId  | int FK  | Foreign key ke `user.id` |

**Relasi**:

- **User → Notes** : one-to-many
- **Notes → User** : many-to-one

**Diagram (placeholder)**:

| User | ---------- | Note |

| id | | id |
| name | | title|
| email | | content |
| password | | userId |
| role |

---

## 3. Screenshot Aplikasi

> Ganti link di bawah ini dengan screenshot asli aplikasi

![Login Page](./screenshots/login.png)  
![Dashboard](./screenshots/dashboard.png)  
![Notes Page](./screenshots/notes.png)

---

## 4. Dependency

Project ini menggunakan beberapa dependency utama:

- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` → NestJS core
- `@nestjs/typeorm` → ORM integration dengan TypeORM
- `typeorm` → Object-Relational Mapping
- `mysql2` → MySQL driver
- `bcrypt` → Password hashing
- `ejs` → Template engine untuk rendering HTML
- `jwt` → Autentikasi berbasis token

> Opsional: `class-validator`, `class-transformer`, `rxjs` (bisa dihapus jika tidak digunakan)

---

## 5. Setup dan Install

1. Clone repository:

```bash
git clone https://github.com/naufalharitsprasetia/notes-manager-nestjs.git
cd notes-manager-nestjs
```

Install dependencies:

```bash
npm install
```

Sesuaikan koneksi database di app.module.ts:

```bash
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'notes_manager',
  autoLoadEntities: true,
  synchronize: true,
})
```

Jalankan aplikasi:

```bash
npm run start:dev
```

Akses aplikasi di:

```arduino
http://localhost:3000
```

## 6. Informasi Tambahan

Seeder Admin:
Secara otomatis akan membuat user admin saat aplikasi pertama kali dijalankan:

```makefile
Email: admin@gmail.com
Password: admin123
```

Folder Structure:

```bash
src/
├── users/        # User module, service, controller
├── notes/        # Notes module, service, controller
├── common/       # Global helpers, guards, decorators
├── main.ts       # Entry point aplikasi
```

## 7. Pola Arsitektur (MVC)

Project ini menerapkan pattern Model-View-Controller (MVC):

### Model

Menggunakan Entity dari TypeORM untuk merepresentasikan tabel database

### View

Menggunakan EJS, berada di folder /views, bertanggung jawab pada tampilan/UI

### Controller

Mengatur alur request dan response, berada di masing-masing module

## 8. Author

Naufal Harits Prasetia

---

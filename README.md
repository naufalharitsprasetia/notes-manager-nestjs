# Notes Manager

## 1. Penjelasan Project

**Notes Manager** adalah aplikasi manajemen catatan (notes) berbasis web yang dibangun menggunakan **NestJS, TypeScript, TypeORM, MySQL, dan EJS**.  
Aplikasi ini memungkinkan pengguna untuk:

- Mendaftar dan login
- Mengelola catatan pribadi (CRUD)
- Melihat catatan berdasarkan user yang login
- Admin memiliki hak istimewa untuk mengelola semua user dan catatan

Tujuan project ini adalah menyediakan **aplikasi CRUD sederhana** dengan arsitektur yang rapi dan mudah dikembangkan.

---

## 2. Desain Database

Aplikasi menggunakan **MySQL** dengan tabel utama:

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

# Notes Manager

## 1. Penjelasan Project

**Notes Manager** adalah aplikasi manajemen catatan (notes) berbasis web yang dibangun menggunakan **NestJS, TypeScript, TypeORM, MySQL, dan EJS**.  
Aplikasi ini memungkinkan pengguna untuk:

- Mendaftar dan login
- Mengelola catatan pribadi (CRUD)
- Melihat catatan berdasarkan user yang login
- Admin memiliki hak istimewa untuk mengelola semua user dan catatan

Tujuan project ini adalah menyediakan **aplikasi CRUD sederhana** dengan arsitektur yang rapi dan mudah dikembangkan.

---

## 2. Desain Database

Aplikasi menggunakan **MySQL** dengan tabel utama:

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

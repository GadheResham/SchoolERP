# Database Documentation

This folder contains MongoDB schema designs and ERD diagrams for SchoolERP.

## Contents

| File | Description |
|---|---|
| `erd.md` | Entity Relationship Diagram |
| `schema-guide.md` | Field-by-field schema reference for every collection |

## Collections

| Collection | Mongoose Model | Description |
|---|---|---|
| `users` | `User` | Admins, teachers, staff accounts |
| `students` | `Student` | Student records |
| `parents` | `Parent` | Parent/guardian records |
| `classes` | `Class` | Academic classes and sections |
| `attendance` | `Attendance` | Daily attendance records |
| `feestructures` | `FeeStructure` | Fee types and amounts per class |
| `feecollections` | `FeeCollection` | Collected fee records per student |
| `payments` | `Payment` | Payment receipts |
| `settings` | `Settings` | School-wide configuration |

## Relationships

```
Student  ──M:1──  Class
Student  ──M:1──  Parent
Attendance  ──M:1──  Student
Attendance  ──M:1──  Class
FeeCollection ──M:1──  Student
FeeCollection ──M:1──  FeeStructure
Payment  ──M:1──  Student
```

## Rules
- All collections use `timestamps: true` (auto `createdAt` / `updatedAt`).
- Student and parent records use soft-delete (`isActive: false`) not hard-delete.
- Sensitive fields (`passwordHash`) are excluded from all query projections.

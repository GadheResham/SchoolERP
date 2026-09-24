# API Documentation

This folder contains the SchoolERP REST API reference.

## Contents

| File | Description |
|---|---|
| `openapi.yaml` | Full OpenAPI 3.0 specification (added in Phase 2) |

## API Base URL

```
http://localhost:5000/api/v1        (development)
https://api.yourdomain.com/api/v1   (production)
```

## Authentication

All protected endpoints require:
```
Authorization: Bearer <JWT>
```

Obtain a token via `POST /api/v1/auth/login`.

## Endpoint Overview

| Domain | Prefix | Phase |
|---|---|---|
| Authentication | `/auth` | Phase 1 |
| Students | `/students` | Phase 2 |
| Parents | `/parents` | Phase 2 |
| Classes | `/classes` | Phase 2 |
| Attendance | `/attendance` | Phase 2 |
| Fees | `/fees` | Phase 2 |
| Payments | `/payments` | Phase 2 |
| Reports | `/reports` | Phase 2 |
| Settings | `/settings` | Phase 2 |

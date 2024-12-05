#### Without Docker (Manual Start)

> [!Important]
> Methods described herein are __untested__ and __unsupported__ at this time.

**Start the Backend:**

```bash
cd backend
flask db upgrade
flask run
```

**Start the Frontend:**

```bash
cd frontend
npm run dev
```

**Start the Backend Modules:**

```bash
cd backend-modules
node server.js
```
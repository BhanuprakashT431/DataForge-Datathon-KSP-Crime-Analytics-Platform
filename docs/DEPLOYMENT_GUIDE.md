# Deployment Guide (Zoho Catalyst)

This guide covers deploying the KSP Strategic Crime Intelligence Platform to Zoho Catalyst.

## Prerequisites
1. [Zoho Catalyst CLI](https://docs.catalyst.zoho.com/en/cli/v1/install/) installed (`npm install -g zcatalyst-cli`).
2. A Zoho Catalyst Account.
3. Python 3.9+ and Node.js installed locally.

## Step 1: Login & Project Initialization
```bash
# Login to your Zoho account
catalyst login

# If this is a new checkout, you can link it to an existing Catalyst project:
catalyst project:use <your-project-id>
```
*Note: The project is already configured via `catalyst.json` to map the frontend and backend.*

## Step 2: Configure Environment Variables
1. Copy the `.env.example` file to `.env` in the `backend/` directory.
2. Edit `.env` and set `CATALYST_PROJECT_ID`.
3. To enable live cloud integrations (if your Catalyst account is provisioned for them), change the `ENABLE_CATALYST_*` variables to `true`.
4. Add your `GEMINI_API_KEY`.

## Step 3: Build the Frontend
Catalyst Web Client Hosting requires static files. Build the React frontend:
```bash
cd frontend
npm install
npm run build
cd ..
```
The output will be placed in `frontend/dist/`, which is automatically detected by `catalyst.json`.

## Step 4: Deploy to Zoho Catalyst
Deploy all configured services (AppSail, Web Client, Functions) with a single command:
```bash
catalyst deploy
```

## Post-Deployment Configuration Checklist
- [ ] **Data Store**: Navigate to the Catalyst Console -> Data Store. Create the 17 tables defined in `backend/data/schema.py` (e.g., `CaseMaster`, `Unit`).
- [ ] **Cache**: Ensure the default cache segment is active.
- [ ] **Authentication**: Enable Catalyst Authentication in the console and configure authorized redirect URIs to your new AppSail URL.
- [ ] **API Gateway**: Set up rate limiting and attach the Catalyst Auth middleware to protect your AppSail endpoints.

## Local Development Mode (Fallback)
If you wish to run the app without Catalyst (e.g., for local testing or if cloud services are unavailable):
1. Leave the `ENABLE_CATALYST_*` variables as `false`.
2. Run backend: `cd backend && pip install -r requirements.txt && python main.py`
3. Run frontend: `cd frontend && npm run dev`
The system will automatically generate simulated KSP Data Store records in memory and operate normally.

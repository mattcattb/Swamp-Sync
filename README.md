# Swamp Sync

Swamp Sync is a full-stack scheduling app for finding shared meeting times across busy groups.

## Screenshots

![Swamp Sync calendar dashboard](docs/images/swamp-sync.png)

## Tech Stack

- Frontend: React, Material UI, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Auth: JWT-based login and protected routes
- Tooling: Docker Compose, npm

## Features

- Account registration, login, and JWT-backed sessions.
- Personal schedule creation and storage.
- Calendar-based event creation, editing, and deletion.
- Meeting invites through friend codes.
- Friend and invite management.
- Shared availability search for group meetings.

## Why I Built This

This was built for a University of Florida software engineering course as a practical take on the classic "when can everyone meet?" problem. The goal was to make scheduling feel more social and persistent than sending one-off availability links.

## My Role

I worked across the React frontend, Express API, MongoDB data model, authentication flow, Docker setup, and group scheduling behavior.

## Architecture

- `wtm-react` owns the browser UI, schedule editing, calendar presentation, and meeting flows.
- `wtm-express` owns authentication, user data, friend relationships, meetings, and schedule persistence.
- MongoDB stores users, schedules, events, friends, and meeting invite state.
- Docker Compose runs the frontend, backend, and MongoDB together for local development.

## Hard Parts

- Modeling schedule availability in a way that could support both personal calendars and group meeting search.
- Keeping invite, friend, and meeting state consistent across multiple users.
- Making the project runnable for a team with Docker while still supporting local frontend/backend development.

## What I Learned

- Full-stack scheduling apps need clear boundaries between calendar UI state and backend availability calculations.
- Auth and invite flows become easier to reason about when the API owns session and relationship state.
- Docker Compose is useful for class/team projects because it removes a lot of local setup drift.

## Running Locally

```bash
git clone https://github.com/mattcattb/Swamp-Sync.git
cd Swamp-Sync
```

Create `wtm-express/.env`:

```env
MONGO_INITDB_ROOT_USERNAME=rootuser
MONGO_INITDB_ROOT_PASSWORD=rootpass
MONGO_URI=mongodb://rootuser:rootpass@wtm-mongodb:27017/admin
LOCAL_MONGO_URI=mongodb://rootuser:rootpass@localhost:12345/admin
MONGO_INITDB_DATABASE=lamdb
PORT=3004
JWT_SECRET=replace-with-a-local-secret
```

Run the full stack with Docker:

```bash
docker compose up --build -d
```

Or run MongoDB through Docker and start each app manually:

```bash
docker compose up wtm-mongodb -d

cd wtm-express
npm install
npm start

cd ../wtm-react
npm install
npm start
```

## Project Notes

This repo is an older class project, so the code favors direct feature delivery over framework-level polish. The useful parts to look at are the schedule data model, meeting invite flow, and availability matching logic.

# Swamp Sync

A full-stack scheduling app for finding shared meeting times across busy groups.

![Swamp Sync calendar dashboard](docs/images/swamp-sync.png)

## About

Swamp Sync is a MERN app built for a University of Florida software engineering course. It lets users create schedules, invite friends by code, manage meeting invitations, and calculate the best overlapping time for a group to meet.

## Tech Stack

- React
- Material UI
- Tailwind CSS
- Node.js
- Express
- MongoDB
- JWT authentication
- Docker Compose

## Features

- Account registration, login, and JWT-backed sessions.
- Personal schedule creation and storage.
- Calendar-based event creation, editing, and deletion.
- Meeting invites through friend codes.
- Friend and invite management.
- Shared availability search for group meetings.

## My Role

I worked across the React frontend, Express API, MongoDB data model, authentication flow, Docker setup, and group scheduling behavior.

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

This repo is an older class project, so the code favors direct feature delivery over framework-level polish. The useful parts to look at are the schedule data model, meeting invite flow, and the availability matching logic.

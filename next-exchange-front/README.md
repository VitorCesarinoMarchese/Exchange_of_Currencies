# 💱 Frontend - Exchange_of_Currencies

This is the frontend of the Currency Exchange platform built using **Next.js**. It supports **i18n** for internationalization and **Vitest** for testing. The application is containerized with **Docker Compose** for easy deployment.

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker**
- **Docker Compose**

## 🐳 Running the Project with Docker Compose

1. Clone the repository:
```bash
   git clone https://github.com/VitorCesarinoMarchese/Exchange_of_Currencies
   cd Exchange_of_Currencies
```
2. Navigate to the frontend folder:
```bash
    cd next-exchange_front
```
3. Build and start the frontend using Docker Compose:
```bash
    docker-compose up --build
```
4. Once the build is complete, the frontend will be available at `http://localhost:3000`.

## 🧭 i18n Setup
The frontend uses next-intl for internationalization. You can manage translations in the messages folder. Each language will have a folder (e.g., messages/en-us.json).
Adding a New Language:

Add a new language file under the messages directory (e.g., messages/fr.json) and set the translation there.

## 🔧 Local Development
To run the project without Docker, follow these steps:

1. Install dependencies:
```bash
npm install
```
2. Start the development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`.

## ⚡ Testing with Vitest
The project uses Vitest for testing.

### Run tests locally:
```bash
npm run test
```
### Run tests coverage locally:
```bash
npm run coverage
```
# 💱 Exchange_of_Currencies
This project is a currency exchange platform where users can sign up, log in, and manage their wallets with USD and 
GBP. Users can view live exchange rates and perform transactions to convert between these currencies. 
The platform also provides a transaction history, allowing users to track past exchanges and their wallet balances.

## 💽 Isntalation
First install the project
```bash
git https://github.com/VitorCesarinoMarchese/Exchange_of_Currencies
cd Exchange_of_Currencies
```
## 🔑 .ENV
create a file named .env in the Exchange_Back folder and add you env keys in this format
```env
API_KEY_WEBSOCKET=Your_API_KEY_WEBSOCKET
API_KEY=Your_API_KEY
URL_WEBSOCKET=wss://marketdata.tradermade.com/feedadv
URL_REST=https://marketdata.tradermade.com/api/v1/
MONGODB=Your_MongoDB_Connection_Key
JWT_REFRESH_SECRET=Your_JWT_REFRESH_SECRET
JWT_SECRET=Your_JWT_SECRET
``` 
Note: The backend won't work if you don't change the Your_ values
## 🏃 Runing the project
Open a two terminals in the folder of the project and write

### 1. Backend
Open a terminal and navigate to the backend folder. Then, run the following command:
```bash
cd Exchange_Back
npm run dev
```
### 2. Frontend
Open another terminal, navigate to the frontend folder, and run:
```bash
cd Exchange_Front
npm run dev
```
Note: Keep both terminals open while running the project.

### 3. Accessing the Application

Once both the frontend and backend are running, you can access the application at http://localhost:5173.
Additionally, you can access the API documentation via Swagger at http://localhost:3030/api/docs.


## 📚 Database Schema
![alt text](./imgs/Exchange_Schema.png "DB Schema")
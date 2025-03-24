CREATE TABLE wallets ( 
    id SERIAL PRIMARY KEY, 
    usd DECIMAL(15, 2) DEFAULT 0, 
    gbp DECIMAL(15, 2) DEFAULT 0 
); 

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    wallet_id INTEGER,
    FOREIGN KEY(wallet_id) REFERENCES wallets(id) ON DELETE SET NULL
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    amount DECIMAL(15, 2) NOT NULL,
    "from" VARCHAR(3),
    "to" VARCHAR(3),
    rate DECIMAL(15, 6),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

SELECT email from users WHERE email = $1 RETURNING 
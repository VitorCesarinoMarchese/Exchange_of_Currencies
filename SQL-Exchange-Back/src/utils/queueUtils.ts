import Bull from 'bull';
import db from '../config/pgConfig'; 

const transactionQueue = new Bull('transaction-queue', 'redis://localhost:6379');
transactionQueue.process(1, async (job) => {
  const { wallet_id, type, user_id, amount, from, to, rate, usd, gbp } = job.data;

  try {
    await db.query("BEGIN");

    if (type === "addFunds") {
      const walletResult = await db.query(`SELECT * FROM wallets WHERE id = $1`, [wallet_id]);
      if (!walletResult.rows.length) throw new Error("Wallet not found");

      const oldWallet = walletResult.rows[0];
      await db.query(
        `UPDATE wallets SET usd = $1, gbp = $2 WHERE id = $3`,
        [Number(oldWallet.usd) + usd, Number(oldWallet.gbp) + gbp, wallet_id]
      );
    } else if (type === "exchange") {
      const walletResult = await db.query(`SELECT * FROM wallets WHERE id = $1`, [wallet_id]);
      if (!walletResult.rows.length) throw new Error("Wallet not found");

      const wallet = walletResult.rows[0];
      if (from === "usd" && Number(wallet.usd) < amount) throw new Error("Insufficient USD balance");
      if (from === "gbp" && Number(wallet.gbp) < amount) throw new Error("Insufficient GBP balance");

      const newAmount = amount * rate;
      const newUsd = from === "usd" ? Number(wallet.usd) - amount : Number(wallet.usd) + newAmount;
      const newGbp = from === "gbp" ? Number(wallet.gbp) - amount : Number(wallet.gbp) + newAmount;

      await db.query(`UPDATE wallets SET usd = $1, gbp = $2 WHERE id = $3`, [
        newUsd.toFixed(2), newGbp.toFixed(2), wallet_id
      ]);

      const queryTransaction = `INSERT INTO transactions (user_id, amount, "from", "to", rate) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
      await db.query(queryTransaction, [user_id, amount, from, to, rate]);

    }

    await db.query("COMMIT");
    console.log(`Transaction for user ${user_id} completed`);
  } catch (e) {
    await db.query("ROLLBACK");
    console.error(`Transaction for user ${user_id} failed:`, e);
    throw e;
  }
});

transactionQueue.on('completed', (job) => {
  console.log(`Job completed: ${job.id}`);
});

transactionQueue.on('failed', (job, error) => {
  console.error(`Job failed: ${job.id}, Error: ${error.message}`);
});

export default transactionQueue;

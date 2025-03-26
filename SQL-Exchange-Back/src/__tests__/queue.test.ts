import Bull from "bull";
import db from "../config/pgConfig";
import transactionQueue from "../utils/queueUtils"; // Assuming your file is named transactionQueue.js

jest.mock("../config/pgConfig"); // Mock db.query

describe("Transaction Queue Tests", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  it("should add funds correctly", async () => {
    db.query = jest
      .fn()
      .mockReturnValue({ rows: [{ id: 1, usd: 100, gbp: 50, email: "test@test.com" }] });

    const job = await transactionQueue.add({
      wallet_id: 1,
      type: "addFunds",
      user_id: 1,
      amount: 1,
      from: null,
      to: null,
      rate: null,
      usd: 50,
      gbp: 25,
    });
    await job.finished();

    expect(db.query).toHaveBeenCalledWith(
      "UPDATE wallets SET usd = $1, gbp = $2 WHERE id = $3",
      [150, 75, 1]
    );
    expect(db.query).toHaveBeenCalledTimes(5); 
  });

  it("should fail when wallet is not found", async () => {
    db.query = jest.fn().mockReturnValue({ rows: [] });

    const job = await transactionQueue.add({
      wallet_id: 999, 
      type: "addFunds",
      user_id: 123,
      amount: 50,
      from: null,
      to: null,
      rate: null,
      usd: 50,
      gbp: 25,
    });

    try {
      await transactionQueue.add(job);
      await job.finished();
    } catch (e: any) {
      expect(e.message).toBe("Wallet not found");
      expect(db.query).toHaveBeenCalledTimes(3); 
    }
  });

  it("should fail if insufficient balance", async () => {
    db.query = jest
      .fn()
      .mockReturnValue({ rows: [{ id: 1, usd: 10, gbp: 5 }] });

    const job = await transactionQueue.add({
      wallet_id: 1,
      type: "exchange",
      user_id: 17,
      amount: 200000,
      from: "usd",
      to: "gbp",
      rate: 1.2,
      usd: 0,
      gbp: 0,
    });

    try {
      await transactionQueue.add(job, { delay: 3000 });
      await job.finished();
    } catch (e: any) {
      expect(e.message).toBe("Insufficient USD balance");
      expect(db.query).toHaveBeenCalledTimes(5);
    }
  });

  it("should commit transaction on success", async () => {
    db.query = jest
      .fn()
      .mockReturnValue({ rows: [{ id: 1, usd: 100, gbp: 50, email: "test@test.com"  }] });

    const job = await transactionQueue.add({
      wallet_id: 1,
      type: "exchange",
      user_id: 1,
      amount: 1,
      from: "usd",
      to: "gbp",
      rate: 1.2,
      usd: 0,
      gbp: 0,
    }, { delay: 3000 });
    await job.finished();

    expect(db.query).toHaveBeenCalledWith("COMMIT");
  });
});

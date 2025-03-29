import db from "../config/pgConfig";
import transactionQueue from "../utils/queueUtils";

describe("Transaction Queue Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it("should add funds correctly", async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const job = await transactionQueue.add({
      wallet_id: 20,
      user_id: 20,
      amount: 0,
      usd: 50,
      gbp: 50,
      type: "addFunds",
      from: "usd",
      to: "gbp",
      rate: 0,
    });
    transactionQueue.emit('completed', job);

    await job.finished();

    expect(logSpy).toHaveBeenCalled(); 
  });

  it("should fail when wallet is not found", async () => {

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
    }
  });

  it("should fail if insufficient balance", async () => {

    const job = await transactionQueue.add({
      wallet_id: 20,
      type: "exchange",
      user_id: 20,
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
    }
  });

  it("should commit transaction on success", async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});


    const job = await transactionQueue.add({
      wallet_id: 20,
      type: "exchange",
      user_id: 20,
      amount: 1,
      from: "usd",
      to: "gbp",
      rate: 1.2,
      usd: 0,
      gbp: 0,
    });

    transactionQueue.emit('completed', job);
    await job.finished();

    expect(logSpy).toHaveBeenCalled(); 
  });
});
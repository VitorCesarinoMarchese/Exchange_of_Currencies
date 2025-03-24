import Bull from 'bull';
import db from '../config/pgConfig';
import transactionQueue from '../utils/queueUtils'; // Assuming your file is named transactionQueue.js

jest.mock('../config/pgConfig'); // Mock db.query

describe('Transaction Queue Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('should add funds correctly', async () => {
    // Mock database responses
    db.query = jest.fn().mockReturnValue({ rows: [{ id: 1, usd: 100, gbp: 50 }] })
    
    // Add a job to the queue
    const job = await transactionQueue.add({
      wallet_id: 1,
      type: 'addFunds',
      user_id: 123,
      amount: 50,
      from: null,
      to: null,
      rate: null,
      usd: 50,
      gbp: 25
    });

    const mockProcessFunction = transactionQueue.process.mock.calls[0][1]; // Get the process function
    await mockProcessFunction(job);

    // Verify database interaction
    expect(db.query).toHaveBeenCalledWith(
      'UPDATE wallets SET usd = $1, gbp = $2 WHERE id = $3',
      [150, 75, 1]
    );
    expect(db.query).toHaveBeenCalledTimes(3); // BEGIN, UPDATE, COMMIT
  });

//   it('should fail when wallet is not found', async () => {
//     db.query.mockResolvedValueOnce({ rows: [] }); // Simulate no wallet found

//     const job = await transactionQueue.add({
//       wallet_id: 999, // Non-existent wallet
//       type: 'addFunds',
//       user_id: 123,
//       amount: 50,
//       from: null,
//       to: null,
//       rate: null,
//       usd: 50,
//       gbp: 25
//     });

//     const mockProcessFunction = transactionQueue.process.mock.calls[0][1];
    
//     try {
//       await mockProcessFunction(job);
//     } catch (e) {
//       expect(e.message).toBe('Wallet not found');
//       expect(db.query).toHaveBeenCalledTimes(2); // BEGIN, SELECT
//     }
//   });

//   it('should fail if insufficient balance', async () => {
//     db.query.mockResolvedValueOnce({ rows: [{ id: 1, usd: 10, gbp: 5 }] });

//     const job = await transactionQueue.add({
//       wallet_id: 1,
//       type: 'exchange',
//       user_id: 123,
//       amount: 20,
//       from: 'usd',
//       to: 'gbp',
//       rate: 1.2,
//       usd: 0,
//       gbp: 0
//     });

//     const mockProcessFunction = transactionQueue.process.mock.calls[0][1];

//     try {
//       await mockProcessFunction(job);
//     } catch (e) {
//       expect(e.message).toBe('Insufficient USD balance');
//       expect(db.query).toHaveBeenCalledTimes(3); // BEGIN, SELECT, ROLLBACK
//     }
//   });

//   it('should commit transaction on success', async () => {
//     db.query.mockResolvedValueOnce({ rows: [{ id: 1, usd: 100, gbp: 50 }] });

//     const job = await transactionQueue.add({
//       wallet_id: 1,
//       type: 'exchange',
//       user_id: 123,
//       amount: 50,
//       from: 'usd',
//       to: 'gbp',
//       rate: 1.2,
//       usd: 0,
//       gbp: 0
//     });

//     const mockProcessFunction = transactionQueue.process.mock.calls[0][1];
//     await mockProcessFunction(job);

//     // Ensure the transaction is committed
//     expect(db.query).toHaveBeenCalledWith("COMMIT");
//   });
});

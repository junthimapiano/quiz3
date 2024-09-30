import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  // ตรวจสอบ session
  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = await clientPromise;
  const db = client.db();

  if (req.method === 'GET') {
    try {
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

      const transactions = await db
        .collection('transactions')
        .find({
          userEmail: session.user.email,  // ใช้ email แทน userId
          date: { $gte: twoMonthsAgo }
        })
        .sort({ date: 1 })
        .toArray();

      const summary = transactions.reduce((acc, transaction) => {
        const monthYear = `${transaction.date.getMonth() + 1}-${transaction.date.getFullYear()}`;
        if (!acc[monthYear]) {
          acc[monthYear] = { income: 0, expense: 0 };
        }
        if (transaction.type === 'income') {
          acc[monthYear].income += transaction.amount;
        } else {
          acc[monthYear].expense += transaction.amount;
        }
        return acc;
      }, {} as Record<string, { income: number; expense: number }>);

      res.status(200).json(summary);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

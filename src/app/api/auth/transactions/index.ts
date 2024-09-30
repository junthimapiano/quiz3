import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import clientPromise from '../../../lib/mongodb';
import { Transaction } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  
  // ตรวจสอบ session
  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = await clientPromise;
  const db = client.db();

  if (req.method === 'POST') {
    try {
      const { amount, date, type, note } = req.body;
      const transaction = await db.collection('transactions').insertOne({
        userEmail: session.user.email,  // ใช้ email แทน userId ในการแยกข้อมูลของผู้ใช้
        amount: parseFloat(amount),
        date: new Date(date),
        type,
        note,
      });
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  } else if (req.method === 'GET') {
    try {
      const transactions: Transaction[] = await db
        .collection('transactions')
        .find({ userEmail: session.user.email })  // ใช้ email แทน userId
        .sort({ date: -1 })
        .toArray();
      res.status(200).json(transactions);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

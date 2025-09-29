const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const api = axios.create({
  baseURL: process.env.API_BASE,
  headers: {
    Authorization: `Bearer ${process.env.API_TOKEN}`
  },
  timeout: 10000
});
// Lấy chỉ số dư
router.get('/balance', async (req, res) => {
  try {
    const { data } = await api.get('/transactions/list');

    const transactions = data.transactions || [];
    let balance = 0;
    transactions.forEach(tx => {
      balance += parseFloat(tx.amount_in || 0);
      balance -= parseFloat(tx.amount_out || 0);
    });

    res.json({ balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy danh sách giao dịch + tính số dư
router.get('/history', async (req, res) => {
  try {
    const { data } = await api.get('/transactions/list');

    const transactions = data.transactions || [];
    let balance = 0;

    transactions.forEach(tx => {
      balance += parseFloat(tx.amount_in || 0);
      balance -= parseFloat(tx.amount_out || 0);
    });

    res.json({ balance, count: transactions.length, transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Lấy chi tiết 1 giao dịch
router.get('/transaction/:id', async (req, res) => {
  try {
    const { data } = await api.get(`/transactions/details/${req.params.id}`);

    // Sepay trả về { status, error, messages, transaction: { ... } }
    const transaction = data.transaction || null;

    if (!transaction) {
      return res.status(404).json({ message: 'Không tìm thấy giao dịch' });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Đếm số lượng giao dịch
router.get('/count', async (req, res) => {
  try {
    const { data } = await api.get('/transactions/count');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

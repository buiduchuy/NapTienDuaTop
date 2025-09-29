// routes/auth.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Đăng nhập
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== password) {
    return res.status(400).send('Tài khoản và mật khẩu phải giống nhau');
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username=? AND password=?',
      [username, password]
    );

    if (rows.length > 0) {
      req.session.user = rows[0]; // lưu user vào session
      res.redirect('/dashboard');
    } else {
      res.status(401).send('Sai thông tin đăng nhập');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

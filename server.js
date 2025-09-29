// server.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// session để nhớ login
app.use(
  session({
    secret: 'wallet_secret',
    resave: false,
    saveUninitialized: true,
  })
);
// cấu hình view
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
// Routes API
app.use('/auth', authRoutes);
app.use('/wallet', walletRoutes);

// Trang login
app.get('/', (req, res) => {
  res.render('login');
});

// Dashboard (xem số dư)
app.get('/dashboard', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  const axios = require('axios');
  const api = axios.create({
    baseURL: process.env.API_BASE,
    headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
  });

  try {
    const { data } = await api.get('/transactions/list');
    const transactions = data.transactions || [];
    let balance = 0;
    transactions.forEach((tx) => {
      balance += parseFloat(tx.amount_in || 0);
      balance -= parseFloat(tx.amount_out || 0);
    });

    res.render('dashboard', { user: req.session.user, balance });
  } catch (err) {
    res.render('dashboard', { user: req.session.user, balance: 'Lỗi API' });
  }
});

// Trang nạp tiền
app.get('/deposit', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render('deposit');
});

app.post('/deposit', (req, res) => {
  // ở đây demo -> không có API nạp tiền thật,
  // ta giả lập nạp thành công và redirect về dashboard
  // bạn có thể tự thêm logic gọi API sepay nếu cần.
  return res.redirect('/dashboard');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const lensData = require('./data/lens.json').data;

app.use((req, res, next) => {
    const log = `[${new Date().toLocaleString()}] ${req.method} ${req.url}\n`;
    fs.appendFileSync(path.join(__dirname, 'access.log'), log);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin', (req, res) => {
    if (req.query.code === '521') {
        res.status(200).send('<h1>Welcome to Admin (歡迎進入後台)</h1>');
    } else {
        res.status(403).send('<h1>Access Denied (暗號錯誤)</h1>');
    }
});

app.get('/product/:model.html', (req, res) => {
    const model = req.params.model;
    const product = lensData.find(item => item.model === model);

    if (product) {
        res.status(200).send(`
            <h1>${product.name}</h1>
            <p>型號: ${product.model}</p>
            <a href="/">回首頁</a>
        `);
    } else {
        res.status(404).send('<h1>404 找不到型號</h1>');
    }
});

app.all(/.*$/, (req, res) => {
    res.status(404).send('<h1>404 Not Found (抱歉，路徑不存在)</h1>');
});

app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
});
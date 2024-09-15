const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// JSONデータのパースを許可
app.use(express.json());

// フォームのデータを受け取るエンドポイント
app.post('/send', (req, res) => {
    const { text, config } = req.body;

    // バック側のサーバにPOSTリクエスト
    axios.post('http://127.0.0.1:5000/process_text', {
        text: text,
        config: config
    })
    .then(response => {
        // 受け取ったデータをそのままクライアント側に返す
        res.json(response.data);
    })
    .catch(error => {
        res.status(500).send('can not sent');
    });
});

// "/"にGETでリクエストが飛んできたとき、index.htmlを返す
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// サーバー起動
app.listen(PORT, () => console.log(`Server is running: http://localhost:${PORT}`));

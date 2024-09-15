const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// JSONデータのパースを許可
app.use(express.json());

// フォームのデータを受け取るエンドポイント
app.post('/send', (req, res) => {
    const { text, config } = req.body;

    console.log('Received data:', req.body); // デバッグ用

    // バック側のサーバにPOSTリクエスト
    axios.post('http://127.0.0.1:5000/process_text', {
        text: text,
        config: config
    })
    .then(response => {
        console.log('Response from backend server:', response.data); // デバッグ用

        // サーバからのレスポンスをそのままクライアントに返す
        res.json(response.data);
    })
    .catch(error => {
        console.error('Error sending message:', error); // デバッグ用
        res.status(500).send('Failed to send message');
    });
});

// "/"にGETでリクエストが飛んできたとき、index.htmlを返す
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// サーバー起動
app.listen(PORT, () => console.log(`Server is running: http://localhost:${PORT}`));

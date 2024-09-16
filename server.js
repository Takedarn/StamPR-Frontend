const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// JSONデータのパースを許可
app.use(express.json());

// フォームのデータを受け取るエンドポイント
app.post('/send', (req, res) => {
    const { text, config } = req.body;

    console.log('バック側に送信するデータ:', req.body); // デバッグ用：　後で消す. backend側に送信するデータの表示

    // backend側のサーバにPOSTリクエスト
    // ---------- ここでbackend側にデータを投げる -----------------
    axios.post('http://127.0.0.1:5000/process_text', {
        text: text,
        config: config
    })
    // backendからデータを受けとる
    // 成功時の処理　:
    .then(response => {
        console.log('バック側からのレスポンス:', response.data); // デバッグ用：　後で消す
        // backend側からのレスポンスをそのままクライアント側に返す
        res.json(response.data);
    })
    // 失敗時の処理　:
    .catch(error => {
        console.error('Error sending message:', error); // デバッグ用：　後で消す
        res.status(500).send('Failed to send message');
    });
});

// "/"にGETでリクエストが飛んできたとき、index.htmlを返す
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// サーバー起動
app.listen(PORT, () => console.log(`Server is running: http://localhost:${PORT}`));

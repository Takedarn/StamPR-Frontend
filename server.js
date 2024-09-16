const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// JSONデータのパースを許可
app.use(express.json());

// フォームのデータを受け取るエンドポイント
app.post('/send', (req, res) => {
    const { text, config } = req.body;

    // backend側のサーバにPOSTリクエスト
    axios.post('http://127.0.0.1:5000/process_text', {
        text: text,
        config: config
    })
    .then(response => {
        // レスポンスから必要な要素を取り出す
        const sentence = response.data[0].sentence;
        const comment = response.data[0].comment;
        const range = response.data[0].range;
        
        // クエリパラメータを生成
        const query = `?sentence=${encodeURIComponent(sentence)}&comment=${encodeURIComponent(comment)}&range=${encodeURIComponent(range)}`;
        const queryUrl = `/result/${query}`;
        
        // クエリ付きURLをフロントに返す
        res.json(queryUrl);
    })
    .catch(error => {
        console.error('エラー:', error);
        res.status(500).send('Failed to send message');
    });
});

// "/"にGETでリクエストが飛んできたとき、index.htmlを返す
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// "/result"にGETでリクエストが飛んできたとき、result.htmlを返す
app.get('/result', (req, res) => {
    res.sendFile(__dirname + '/public/html/result.html');
});

// サーバー起動
app.listen(PORT, () => console.log(`Server is running: http://localhost:${PORT}`));

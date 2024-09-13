const express = require('express');   // expressモジュールを読み込む
const app = express();   // expressオブジェクトの作成
const PORT = 3000;   // ポート番号の指定


// "/"にGETでリクエストが飛んできたときに返す
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// 3000番でサーバー起動
// サーバー起動時にログを出力する
app.listen(PORT, () => console.log('saver is running'))
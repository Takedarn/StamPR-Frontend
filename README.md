# StasmPR
HackU 2024KANAZAWA出場作品のフロント部分実装です

## 環境構築
### 今現在で最低限必要なパッケージ 📦
node.js
インストーラーを公式サイトから持ってくる方がスムーズかもしれません。

https://nodejs.org/en/download/prebuilt-installer


Mac OS userの場合はhomebrewを使うと楽です

```
brew install node@20
```

node.jsをインストールするとパッケージ管理システムのnpmが利用できるようになります。


以下のコマンドを利用してpackage.jsonに記述されているパッケージを一括インストールしてください:
```
npm install
```


### ローカルサーバでの立ちあげ 🐟
プロジェクトルート下で以下のコマンドを実行


```
npm install http-server
npm run start
```
ターミナル内に、トーカルホストを示すURLが表示されるのでクリックしてアクセスしてください。
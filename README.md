# kousei-ai
HackU 2024KANAZAWA出場作品のフロント部分実装です

## 環境構築
### 今現在で最低限必要なパッケージ 📦
node.js
インストーラーを公式サイトから持ってくる方がスムーズかもしれません。
https://nodejs.org/en/download/prebuilt-installer


Mac OS userの場合はhomebrewを使うと楽です。

```
brew install node@20
```
nodejsをインストールするとnpmが使えるようになります。
リポジトリをクローンして、プロジェクトのルート以下を実行：

- expressをインストールする

```
npm install express
```
- axiosをインストールする
```
npm install axios
```
### あると便利なパッケージ 📦
node.jsベースのアプリは変更のたびにサーバを落として再起動しなければ変更は反映されていない場合があります。
そのためにnodemonというパッケージをインストールすると変更をwatchして必要に応じて自動で再起動をしてくれます。
- nodemonをインストールする
```
npm install -g nodemon
```
permissionエラーが起きる場合があります。管理者権限を与えて実行してください。

### ローカルサーバでの立ちあげ 🐟
プロジェクトルート下で以下のコマンドを実行

ポート番号3000で起動します。

```
npm run start
```

ターミナル内に直接クリックしてブラウザに遷移するリンクは生成されないので自分でブラウザにうってください。
# Node.js のインストール
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 22

# Node.jsのバージョンを確認する：
node -v # "v22.15.1"が表示される。
nvm current # "v22.15.1"が表示される。

# npmのバージョンを確認する：
npm -v # "10.9.2"が表示される。
```

# Blackhole 2chのインストール（内蔵マイクを利用する方はこの作業は不要です。）
スピーカーをマイクへループバックするアプリになります。
```
https://existential.audio/blackhole/download/?code=585236267
```
こちらにアクセスし、Blackhole 2chをインストールする。
再起動後、スピーカーとマイクをどちらもBlackhole 2chに変更し、音量を最大にする。

# プログラムの実行
```
node init
```
をターミナルに入力、全てEnterし、yesを入力。

そのまま続けて、
```
node server.js
```
をターミナルに入力・実行してサーバーを起動する。

この状態でVSCodeの「実行・デバッグ」機能を使用して、index.htmlを実行します。
これでブラウザで音声合成、音声認識、結果表示ができるようになります。

# トラブルシューティング
エラーによりserver.jsが実行できない場合は、以下のコードをターミナルに入力、実行して下さい。
```
npm install express cors kuromoji bleu-score word-error-rate
```
インストールが終わりましたら、再度server.jsを実行してください。
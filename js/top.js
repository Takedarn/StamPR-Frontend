document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("runkouseiButton"); // "校正する"ボタン
    const textInput = document.getElementById("text-input"); // 入力する文章の全取得
    const openKanjiCheckbox = document.getElementById("config-open-kanji"); // "漢字をひらく"チェックボックスがONかどうか
    const loadingPage = document.getElementById("loading"); // ローディング画面
    const resultPage = document.getElementById("result"); // 校正結果表示ページ
    const originalTextDiv = document.getElementById("text-input"); // 校正前の文章
    const topContainer = document.getElementById("topContainer"); // 文章入力画面と校正設定画面のセット
    const resultSentece = document.getElementById("resultMain"); // 文章入力画面と校正設定画面のセット

    // ”校正を送信”するボタンを押した時の処理
    submitButton.addEventListener("click", async () => {
        const text = textInput.value; // 送信する文章本体\
        const openKanji = openKanjiCheckbox.checked; // 校正の設定

        
        if (text.trim() === "") { // フォームが空かどうかのチェック
            alert("文章を入力してください");
          return;
        }

        // ローディング表示
        topContainer.style.display = "none"; // 文章入力画面と校正設定画面のセットを非表示する
        loadingPage.style.display = "block"; // ローディング画面を表示させる
        

        // バック側に送信するデータを作成
        const requestData = {   
            text: text,
            configs: {
             open_kanji: openKanji
             }
        };

        try {
            // バック側のサーバにPOSTする
            // 内容：文章, 校正の設定
            const response = await fetch("http://localhost:5050/process_text", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

        // レスポンスをJSON形式で受け取る
        const responseData = await response.json();

        // // 校正結果の表示
        displayProofreadResult(responseData);

        } catch (error) {
            console.error("エラーが発生しました:", error);
        } finally {
            // ローディング表示を非表示
            loadingPage.style.display = "none";
        }
    });


    // 校正結果を表示する関数
    function displayProofreadResult(data) {
        console.log(data)

        let receivedSentence = [];
    
        //dataの中の各インデックスに対して1つずつ取り出して処理する
        data.sentences.forEach(d => {
            let sentenceText = d.original_sentence;

            let ele = document.createElement('span');
            ele.innerHTML = sentenceText;
        

            // コメントをすべてまとめて表示するためのdivを作成
            // const commentsDiv = document.createElement("div");
            // commentsDiv.className = "comments";
            ele.setAttribute("id", "text-input");
            if (d.suggestions.length > 0) {
                // 校正すべき内容が含まれている場合、黄色のマーカーを追加
                ele.style.color = "#2E933C";
            

                // d.suggestions.forEach(suggestion => {
                //     const commentDiv = document.createElement("div");
                //     commentDiv.className = "suggestion-comment";
                //     commentDiv.textContent = suggestion.comment;

                //     commentsDiv.appendChild(commentDiv);
                // });

            //     // クリックイベントでコメントを表示/非表示
            //     sentenceDiv.addEventListener("click", () => {
            //         commentsDiv.classList.toggle("active");
            //     });

            // } else {
            //     // 提案がない場合はクリック不可に
            //     sentenceDiv.style.pointerEvents = "none"; // クリックを無効化
            // }

            // sentenceDiv.appendChild(commentsDiv);
            // originalTextDiv.appendChild(sentenceDiv);
            }
            resultSentece.appendChild(ele);
        });

        console.log(resultSentece)

        

        // 結果表示を有効に
        resultPage.style.display = "block";
    }
    
});


// トップ画面のロゴ画像をクリックするとページをリロードする
document.getElementById("appLogoImg").addEventListener("click", () => {
    location.reload(); 
});


// 校正を始めるときの処理
document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submit-button"); // "校正を始める"ボタン
    const originalFooter = document.getElementById("original-footer"); // 校正を始めるボタンのフッター
    const newFooter = document.getElementById("newFooter"); //　校正をするときのオプションをきめるフッター
    const backtoTopButton = document.getElementById("backtotop"); // オプション画面から元の画面に戻るためのキャンセルボタン

    // 校正を始めるボタンを押した時の処理
    submitButton.addEventListener("click", () => {
        // original-footer非表示
        originalFooter.style.display = "none";
        // new-footerを表示
        newFooter.style.display = "block";
    });    

    // 校正へ戻るボタン(xボタン)を押した時の処理
    backtoTopButton.addEventListener("click", () => {
        // new-footerを非表示
        newFooter.style.display = "none";
        // original-footer表示
        originalFooter.style.display = 'flex';
        originalFooter.style.justifyContent = 'center';
        originalFooter.style.alignItems = 'center'; 
    });   
});



document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("runkouseiButton"); // "校正する"ボタン
    const textInput = document.getElementById("text-input"); // 入力する文章の全取得
    const openKanjiCheckbox = document.getElementById("config-open-kanji"); // "漢字をひらく"チェックボックスがONかどうか
    const loadingPage = document.getElementById("loading"); // ローディング画面
    const resultPage = document.getElementById("result"); // 校正結果表示ページ
    const originalTextDiv = document.getElementById("text-input"); // 校f正前の文章
    const topContainer = document.getElementById("topContainer"); // 
    const resultSentece = document.getElementById("resultMain"); // 文章入力画面と校正設定画面のセット
    const footerMainTitle = document.getElementById("footerMainTitle"); // 文章入力画面と校正設定画面のセット
    const commentMain = document.getElementById("commentMain");
    const resultFooterContainer = document.getElementById("resultFooterContainer"); // 文章内の指摘箇所個数表示カード
    const commentCardContainer = document.getElementById("commentCardContainer"); // 指摘文ごとの指摘カード
    const accesError = document.getElementById("accesError"); // エラー画面


    let textElementList = [];
    let suggestionList = [];


    // ”校正を送信”するボタンを押した時の処理
    submitButton.addEventListener("click", async () => {
        const text = textInput.value; // 送信する文章本体\
        const openKanji = openKanjiCheckbox.checked; // 校正の設定

        
        if (text.trim() === "") { // フォームが空かどうかのチェック
            alert("文章を入力してください");
          return;
        }

        //topContainerを非表示にさせる
        topContainer.style.display = "none"; // 文章入力画面と校正設定画面のセットを非表示する
        // ローディング画面を表示させる
        loadingPage.style.display = "block"; // ローディング画面を表示

        
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
            const response = await fetch("http://kousei-ai-backend-env-lib.eba-gabwpxxb.ap-northeast-1.elasticbeanstalk.com/process_text", {
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
            footerMainTitle.style.display = "block";
            accesError.style.display = "block";
            setTimeout(function() {
                location.reload();  
            }, 5000); // 5秒
        } finally {
            // ローディング表示を非表示
            loadingPage.style.display = "none";
        }
    });


    // 校正結果を表示する関数
    function displayProofreadResult(data) {
        // console.log(data)

        let cnt = 0;
        let cntSuggestion = 0;

        //dataの中の各インデックスに対して1つずつ取り出して処理する
        data.sentences.forEach(d => {
            // console.log(d);

            let sentenceText = d.original_sentence;
            let suggestions = d.suggestions;
    

            let ele = document.createElement('span');
            ele.innerHTML = sentenceText;

            textId = "textId" + String(cnt);
        
            ele.className = "resultText"
            ele.setAttribute("id", textId);

            resultSentece.appendChild(ele);

            textElementList.push(ele);
            suggestionList.push(suggestions);

            if (d.suggestions.length > 0) {
                // 校正すべき内容が含まれている場合、緑色のマーカーを追加
                ele.style.color = "#2E933C";
                cntSuggestion += 1;   
            } 
            cnt += 1;
        });


        // 結果表示を有効にする
        resultPage.style.display = "block";

        if (cntSuggestion === 0) {
            footerMainTitle.innerHTML = "文章内は校正する必要はありません！";
            const footerMainSubtitle = document.getElementById("footerMainSubtitle");
            footerMainSubtitle.style.fontSize = "12px";
            footerMainSubtitle.innerHTML = "おめでとうございます 🎉";
        } else {
            footerMainTitle.innerHTML = "文章内に" + String(cntSuggestion) + "つ指摘箇所が見つかりました!";
        }


        for (let i = 0; i < textElementList.length; i++) {
            let ele1 = textElementList[i];

            // 校正すべき内容がある場合のみクリックイベントを追加
            if (suggestionList[i].length > 0) {
                ele1.addEventListener('click', function() {
                    // 指摘箇所表示カードの非表示
                    resultFooterContainer.style.display = "none";
                    // コメント詳細カードカードの表示
                    commentCardContainer.style.display = "block";

                    // ele.remove();
                    for (let j = 0; j < textElementList.length; j++) {
                        let ele2 = textElementList[j];
                        if (i === j) {
                            ele2.style.color = "#2E933C"; // primary colorにする
                        } else {
                            ele2.style.color = "#E8E9EB"; // 薄いグレー
                        }
                    }

                    commentMain.innerHTML = ``

                    for(let j = 0; j < suggestionList[i].length; j++) {
                        // クリックした文のindex, title, commnetを取得
                        let indexElement = document.createElement('div');
                        indexElement.classList.add("index");
                        indexElement.innerHTML = j + 1;

                        let titleElement = document.createElement('div');
                        titleElement.classList.add("title");
                        titleElement.innerHTML = suggestionList[i][j].title;

                        let commentElement = document.createElement('div');
                        commentElement.classList.add("comment");
                        commentElement.innerHTML = suggestionList[i][j].comment;

                        let suggestionContainer = document.createElement('div');
                        suggestionContainer.classList.add("suggestionContainer");

                        suggestionContainer.appendChild(indexElement);
                        suggestionContainer.appendChild(titleElement);
                        suggestionContainer.appendChild(commentElement);

                        commentMain.appendChild(suggestionContainer);
                    } 
                });
            }
        }
    }
});

// 詳細の指摘取消をクリックすると詳細カードを消して指摘箇所カードを表示する
document.getElementById("commnetHeaderCancel").addEventListener("click", () => {
    // 指摘詳細カードの非表示
    const commentCardContainer = document.getElementById("commentCardContainer");
    commentCardContainer.style.display = "none";
    
    // 指摘回数表示カードの表示
    const resultFooterContainer = document.getElementById("resultFooterContainer");
    resultFooterContainer.style.display = "block";
    
    // 文ごとの色をリセットする処理
    for (let i = 0; i < textElementList.length; i++) {
        let ele = textElementList[i];
        // 校正すべき内容がある文は緑色、ない文は黒色に戻す
        if (suggestionList[i].length > 0) {
            ele.style.color = "#2E933C"; // 緑色
        } else {
            ele.style.color = "#000000"; // 黒色
        }
    }
});




// トップ画面のロゴ画像をクリックするとページをリロードする
document.getElementById("appLogoImg").addEventListener("click", () => {
    location.reload(); 
});

// トップ画面のロゴ画像をクリックするとページをリロードする
document.getElementById("footerBottomTitle").addEventListener("click", () => {
    location.reload(); 
});

// 詳細の指摘取消をクリックすると詳細カードを決して指摘箇所カードを表示する
document.getElementById("commnetHeaderCancel").addEventListener("click", () => {
    // 指摘詳細カードの非表示
    const commentCardContainer = document.getElementById("commentCardContainer");
    commentCardContainer.style.display = "none";
    // 指摘回数表示カードの表示
    const resultFooterContainer = document.getElementById("resultFooterContainer");
    resultFooterContainer.style.display = "block";
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
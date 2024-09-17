document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submit-button");
    const textInput = document.getElementById("text-input");
    const openKanjiCheckbox = document.getElementById("config-open-kanji");
    const loadingDiv = document.getElementById("loading");
    const resultDiv = document.getElementById("result");
    const originalTextDiv = document.getElementById("original-text");

    // ”校正を送信”するボタンを押した時の処理
    submitButton.addEventListener("click", async () => {
        const text = textInput.value; // 送信する文章本体
        const openKanji = openKanjiCheckbox.checked; // 校正の設定

        if (text.trim() === "") { // フォームが空かどうかのチェック
            alert("文章を入力してください");
            return;
        }

        // ローディング表示
        loadingDiv.style.display = "block";
        resultDiv.style.display = "none";

        // バック側にに送信するデータ
        const requestData = {   
            text: text,
            configs: {
                open_kanji: openKanji
            }
        };

        try {
            console.log(requestData);
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
            
            console.log(responseData);

            // 校正結果の表示
            displayProofreadResult(responseData);

        } catch (error) {
            console.error("エラーが発生しました:", error);
        } finally {
            // ローディング表示を非表示
            loadingDiv.style.display = "none";
        }
    });

    // 校正結果を表示する関数
    function displayProofreadResult(data) {
        originalTextDiv.innerHTML = ""; // 前回の結果をクリア

        data.sentences.forEach(sentence => {
            const sentenceDiv = document.createElement("span"); 
            sentenceDiv.className = "sentence";
            let sentenceText = sentence.original_sentence;

            // 提案がある場合、該当部分にハイライトを付ける
            sentenceDiv.innerHTML = sentenceText;

            // コメントをすべてまとめて表示するためのdivを作成
            const commentsDiv = document.createElement("div");
            commentsDiv.className = "comments";

            if (sentence.suggestions.length > 0) {
                // 校正すべき内容が含まれている場合、黄色のマーカーを追加
                sentenceDiv.style.backgroundColor = "yellow";

                sentence.suggestions.forEach(suggestion => {
                    const commentDiv = document.createElement("div");
                    commentDiv.className = "suggestion-comment";
                    commentDiv.textContent = suggestion.comment;

                    commentsDiv.appendChild(commentDiv);
                });

                // クリックイベントでコメントを表示/非表示
                sentenceDiv.addEventListener("click", () => {
                    commentsDiv.classList.toggle("active");
                });

            } else {
                // 提案がない場合はクリック不可に
                sentenceDiv.style.pointerEvents = "none"; // クリックを無効化
            }

            sentenceDiv.appendChild(commentsDiv);
            originalTextDiv.appendChild(sentenceDiv);
        });

        // 結果表示を有効に
        resultDiv.style.display = "block";
    }
});

document.getElementById("appLogoImg").addEventListener("click", () => {
    location.reload(); // ページをリロード
});

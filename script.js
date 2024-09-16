document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submit-button");
    const textInput = document.getElementById("text-input");
    const openKanjiCheckbox = document.getElementById("config-open-kanji");
    const loadingDiv = document.getElementById("loading");
    const resultDiv = document.getElementById("result");
    const originalTextDiv = document.getElementById("original-text");

    submitButton.addEventListener("click", async () => {
        const text = textInput.value;
        const openKanji = openKanjiCheckbox.checked;

        if (text.trim() === "") {
            alert("文章を入力してください");
            return;
        }

        // ローディング表示
        loadingDiv.style.display = "block";
        resultDiv.style.display = "none";

        // APIに送信するデータ
        const requestData = {
            text: text,
            configs: {
                open_kanji: openKanji
            }
        };

        try {
            console.log(requestData)
            // ダミーのURLにPOST（実際にはバックエンドのAPI URLに置き換える）
            const response = await fetch("http://localhost:5050/process_text", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            // レスポンスをJSON形式で受け取る
            const responseData = await response.json();
            
            console.log(responseData)

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
            const sentenceDiv = document.createElement("div");
            sentenceDiv.className = "sentence";
            let sentenceText = sentence.original_sentence;

            // 提案がある場合、該当部分にハイライトを付ける
            if (sentence.suggestions.length > 0) {
                sentence.suggestions.forEach(suggestion => {
                    const range = suggestion.range; // 構成の範囲
                    const before = sentenceText.slice(0, range.start);
                    const highlighted = sentenceText.slice(range.start, range.end);
                    const after = sentenceText.slice(range.end);

                    // マーカーを付ける
                    sentenceDiv.innerHTML = `${before}<span class="highlight">${highlighted}</span>${after}`;

                    // コメント表示のイベントを設定
                    const highlightSpan = sentenceDiv.querySelector(".highlight");
                    const commentDiv = document.createElement("div");
                    commentDiv.className = "suggestion-comment";
                    commentDiv.textContent = suggestion.comment;

                    highlightSpan.addEventListener("click", () => {
                        // コメントの表示/非表示を切り替える
                        commentDiv.classList.toggle("active");
                    });

                    sentenceDiv.appendChild(commentDiv);
                });
            } else {
                sentenceDiv.textContent = sentenceText;
            }

            originalTextDiv.appendChild(sentenceDiv);
        });

        // 結果表示を有効に
        resultDiv.style.display = "block";
    }
});

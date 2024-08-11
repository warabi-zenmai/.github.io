document.addEventListener('DOMContentLoaded', function() {
    // 自動取得の日付と時間の設定
    const autoDateInput = document.getElementById('auto-date');
    const now = new Date();
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    const formattedDate = now.getFullYear() + '/' +
                          ('0' + (now.getMonth() + 1)).slice(-2) + '/' +
                          ('0' + now.getDate()).slice(-2) + '（' +
                          days[now.getDay()] + '）' +
                          ('0' + now.getHours()).slice(-2) + ':' +
                          ('0' + now.getMinutes()).slice(-2);
    autoDateInput.value = formattedDate;

    // 手動入力の日付と時間の設定
    const manualDateInput = document.getElementById('manual-date');
    const manualTimeInput = document.getElementById('manual-time');

    // カレンダーから日付が選択された後に自動取得日付をクリアする
    manualDateInput.addEventListener('change', function() {
        if (manualDateInput.value) {
            autoDateInput.value = ''; // 自動取得日付をクリア
            manualTimeInput.disabled = false; // 手動入力時間を有効にする
        }
    });

    // 手動入力日付が未入力の場合、手動入力時間を無効にする
    manualTimeInput.addEventListener('focus', function() {
        if (!manualDateInput.value) {
            manualTimeInput.disabled = true; // 手動入力日付が未入力の場合、手動入力時間を無効にする
        } else {
            manualTimeInput.disabled = false; // 手動入力日付が入力されている場合、手動入力時間を有効にする
        }
    });

    // 写真の選択スタイルを設定
    const photoSlots = document.querySelectorAll('.photo-slot');
    photoSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            photoSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // 数量と30以上の入力処理
    const quantitySelect = document.getElementById('quantity-select');
    const quantityInput = document.getElementById('quantity-input');

    quantityInput.addEventListener('input', function() {
        quantitySelect.value = '';
    });

    quantitySelect.addEventListener('change', function() {
        quantityInput.value = '';
    });

    quantityInput.addEventListener('input', function() {
        // 全角数字を半角に変換
        const halfWidthValue = this.value.replace(/[０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
        this.value = halfWidthValue;
    });

    // カテゴリと出荷店舗の選択状態を保持する
    const categoryButtons = document.querySelectorAll('.btn-category');
    const storeButtons = document.querySelectorAll('.btn-store');
    const sizeButtons = document.querySelectorAll('.btn-size'); // サイズ選択ボタン

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    storeButtons.forEach(button => {
        button.addEventListener('click', function() {
            storeButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // 「この内容で登録する」ボタンのクリック時にlocalStorageに保存
    document.getElementById('data-form').addEventListener('submit', function(e) {
        e.preventDefault(); // フォームのデフォルト送信を防ぐ

        // 選択された項目をlocalStorageに保存
        const selectedCategory = document.querySelector('.btn-category.selected').textContent;
        const selectedStore = document.querySelector('.btn-store.selected').textContent;
        const selectedSize = document.querySelector('.btn-size.selected').textContent;
        const selectedPhoto = document.querySelector('.photo-slot.selected img').alt;

        localStorage.setItem('selectedCategory', selectedCategory);
        localStorage.setItem('selectedStore', selectedStore);
        localStorage.setItem('selectedSize', selectedSize);
        localStorage.setItem('selectedPhoto', selectedPhoto);

        // 送信データのオブジェクト
        var data = {
            date: document.querySelector('#auto-date').value || document.querySelector('#manual-date').value,
            category: selectedCategory,
            store: selectedStore,
            photo: selectedPhoto,
            size: selectedSize,
            quantity: document.querySelector('#quantity-select').value || document.querySelector('#quantity-input').value,
            remarks: document.querySelector('#remarks').value
        };

        console.log('Sending data:', data);  // デバッグログ

        // データ送信処理
        fetch('https://script.google.com/macros/s/AKfycbwRw5MCYWjkl92AZWe7NaUxMwwZFFCwUGMFBKYiQ2hKElw-1-LD4lfzIUx4-tm8a8JxMw/exec', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            console.log('Response:', data);  // デバッグログ
            alert('データが保存されました');
            localStorage.clear(); // ローカルストレージをクリア
            document.getElementById('data-form').reset(); // フォームをリセット
            
            // ページ遷移を確実に行う
            window.location.href = '// サンクスページにリダイレクト
window.location.href = 'https://warabi-zenmai.github.io/hanasakabba/sent successfully.html';
';
        })
        .catch(error => {
            console.error('Error:', error);  // デバッグログ
            alert('データの保存に失敗しました');
        });
    });
});

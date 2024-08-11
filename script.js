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

    manualDateInput.addEventListener('change', function() {
        if (manualDateInput.value) {
            autoDateInput.value = ''; 
            manualTimeInput.disabled = false; 
        }
    });

    manualTimeInput.addEventListener('focus', function() {
        if (!manualDateInput.value) {
            manualTimeInput.disabled = true; 
        } else {
            manualTimeInput.disabled = false; 
        }
    });

    const photoSlots = document.querySelectorAll('.photo-slot');
    photoSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            photoSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    const quantitySelect = document.getElementById('quantity-select');
    const quantityInput = document.getElementById('quantity-input');

    quantityInput.addEventListener('input', function() {
        quantitySelect.value = '';
    });

    quantitySelect.addEventListener('change', function() {
        quantityInput.value = '';
    });

    quantityInput.addEventListener('input', function() {
        const halfWidthValue = this.value.replace(/[０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
        this.value = halfWidthValue;
    });

    const categoryButtons = document.querySelectorAll('.btn-category');
    const storeButtons = document.querySelectorAll('.btn-store');
    const sizeButtons = document.querySelectorAll('.btn-size'); 

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

    document.getElementById('data-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const selectedCategory = document.querySelector('.btn-category.selected').textContent;
        const selectedStore = document.querySelector('.btn-store.selected').textContent;
        const selectedSize = document.querySelector('.btn-size.selected').textContent;
        const selectedPhoto = document.querySelector('.photo-slot.selected img').alt;

        localStorage.setItem('selectedCategory', selectedCategory);
        localStorage.setItem('selectedStore', selectedStore);
        localStorage.setItem('selectedSize', selectedSize);
        localStorage.setItem('selectedPhoto', selectedPhoto);

        var data = {
            date: document.querySelector('#auto-date').value || document.querySelector('#manual-date').value,
            category: selectedCategory,
            store: selectedStore,
            photo: selectedPhoto,
            size: selectedSize,
            quantity: document.querySelector('#quantity-select').value || document.querySelector('#quantity-input').value,
            remarks: document.querySelector('#remarks').value
        };

        console.log('Sending data:', data);

        fetch('https://script.google.com/macros/s/AKfycbyd7clTs8Nnj8PVdZslFeICFgLejPrIazjZ4Ismpdyy3zZycHbeAdDI399d7yHoBGeP/exec', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log('Response:', data);
            alert('データが保存されました');
            localStorage.clear();
            document.getElementById('data-form').reset();
            window.location.href = 'https://warabi-zenmai.github.io/hanasakabba/sent_successfully.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('データの保存に失敗しました');
        });
    });
});

const toggleThemeButton = document.getElementById('toggleTheme');
const body = document.body;
const rollDiceButton = document.getElementById('rollDice');
const diceResult = document.getElementById('diceResult');
const d100Result = document.getElementById('d100Result');
const mutationResult = document.getElementById('mutationResult');
const historyList = document.getElementById('historyList');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');
const closePopupButton = document.getElementById('closePopup');

let history = [];

toggleThemeButton.addEventListener('click', () => {
    body.classList.toggle('dark');
});

rollDiceButton.addEventListener('click', async () => {
    const d20Result = Math.floor(Math.random() * 20) + 1;
    diceResult.textContent = `Вы бросили кубик d20 и выпало: ${d20Result}`;

    let mutationText = '';

    if (d20Result === 1) {
        mutationText = "Некроз! Мутации невозможны, ваш персонаж ослабевает.";
        d100Result.textContent = "";
    } else if (d20Result >= 2 && d20Result <= 9) {
        const d100ResultValue = Math.floor(Math.random() * 100) + 1;
        d100Result.textContent = `Вы бросили кубик d100 и выпало: ${d100ResultValue}`;
        mutationText = getBadMutation(d100ResultValue);
    } else if (d20Result >= 10 && d20Result <= 19) {
        const d100ResultValue = Math.floor(Math.random() * 100) + 1;
        d100Result.textContent = `Вы бросили кубик d100 и выпало: ${d100ResultValue}`;
        mutationText = getGoodMutation(d100ResultValue);
    } else if (d20Result === 20) {
        mutationText = "Супермутация! Вы получаете уникальные способности!";
        d100Result.textContent = "";
        showPopup("Поздравляем! Вы получили супермутацию!"); // Показать всплывающее окно
    } else {
        mutationText = "Нет доступных мутаций.";
        d100Result.textContent = "";
    }

    mutationResult.innerHTML = mutationText;

    // Добавляем в историю
    const newRoll = { d20: d20Result, mutation: mutationText };
    await saveHistory(newRoll);
    loadHistory(); // Обновляем историю после сохранения
});

function getBadMutation(d100) {
    if (d100 <= 20) return "Атрофия рук.";
    if (d100 <= 40) return "Вы не можете двигать коленями.";
    if (d100 <= 60) return "Слепое зрение в радиусе 60 футов.";
    if (d100 <= 80) return "Вы теряете мелкую моторику.";
    if (d100 <= 90) return "Можете только дышать под водой.";
    if (d100 <= 95) return "Вы становитесь жирным пузыриком.";
    return "Ваша кожа обвисает, и все, что вы берете, скользит.";
}

function getGoodMutation(d100) {
    if (d100 <= 20) return "Мутация бицепса (+2 силы и преимущество на броски).";
    if (d100 <= 40) return "Плюс 20 скорости и удвоение дистанции прыжка.";
    if (d100 <= 60) return "Размягчение тканей с превращением в резину.";
    if (d100 <= 80) return "Дополнительные руки.";
    if (d100 <= 90) return "Вы можете планировать как белка-летяга.";
    return "Крокодилья пасть (1d12 урона) и когти (1d8).";
}

async function saveHistory(roll) {
    await fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(roll)
    });
}

async function loadHistory() {
    const response = await fetch('/history');
    if (response.ok) {
        history = await response.json();
        updateHistory();
    } else {
        console.error("Ошибка загрузки истории:", response.status);
    }
}

function updateHistory() {
    historyList.innerHTML = '';
    history.forEach((entry) => {
        const li = document.createElement('li');
        li.textContent = `Бросок d20: ${entry.d20}, Результат: ${entry.mutation}`;
        historyList.appendChild(li);
    });
}

window.onload = loadHistory;

function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = 'block';
}

closePopupButton.addEventListener('click', () => {
    popup.style.display = 'none';
});
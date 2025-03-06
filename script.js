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
    if (d100 >= 1 && d100 < 5) return "Рерол.";
    if (d100 >= 5 && d100 < 10) return "Атрофия рук.";
    if (d100 >= 10 && d100 < 15) return "Потеря зрения на время мутации.";
    if (d100 >= 15 && d100 < 20) return "Невозможность двигать коленями.";
    if (d100 >= 20 && d100 < 25) return "Вдуваешься как шарик.";
    if (d100 >= 25 && d100 < 30) return "Появление галлюцинаций.";
    if (d100 >= 30 && d100 < 35) return "Сращивание пальцев в клешни и потеря мелкой моторики.";
    if (d100 >= 35 && d100 < 40) return "Способность дышать только под водой.";
    if (d100 >= 40 && d100 < 45) return "Атрофия рук.";
    if (d100 >= 45 && d100 < 50) return "Термический урон конечностям.";
    if (d100 >= 50 && d100 < 55) return "Уменьшение до еще меньших размеров и уменьшение скорости в три раза.";
    if (d100 >= 55 && d100 < 60) return "Обвисает вся кожа и все, что берешь, скользит.";
    if (d100 >= 60 && d100 < 65) return "Ослепление и до ближайшего долгого отдыха черный.";
    if (d100 >= 65 && d100 < 70) return "4к12 урона от сломанных ребер.";
    if (d100 >= 70 && d100 < 85) return "Становлюсь жирным пузыриком.";
    if (d100 >= 85 && d100 < 90) return "Появление галлюцинаций.";
    if (d100 >= 90 && d100 < 95) return "Джун пей.";
    if (d100 >= 95 && d100 <= 100) return "Рерол.";
    return "Джун пей.";
}

function getGoodMutation(d100) {
    if (d100 >= 1 && d100 < 5) return "Рерол.";
    if (d100 >= 5 && d100 < 10) return "Мутация бицепса на +2 силы и преимущество на броски.";
    if (d100 >= 10 && d100 < 15) return "Глаза с инфракрасным зрением во все стороны.";
    if (d100 >= 15 && d100 < 20) return "Плюс 20 скорость и удвоение дистанции прыжка.";
    if (d100 >= 20 && d100 < 25) return "Размягчение тканей с превращением тебя в резину.";
    if (d100 >= 25 && d100 < 30) return "Слепое зрение в радиусе 60 футов.";
    if (d100 >= 30 && d100 < 35) return "Руки клешни на к10 урона и плюс 2 кд.";
    if (d100 >= 35 && d100 < 40) return "К12 урона электричеством всем вокруг атакой.";
    if (d100 >= 40 && d100 < 45) return "Мутация бицепса (+2 силы и преимущество на броски).";
    if (d100 >= 45 && d100 < 50) return "Креветка боец.";
    if (d100 >= 50 && d100 < 55) return "Уменьшение до размеров ребенка и удвоение скорости.";
    if (d100 >= 55 && d100 < 60) return "Способность планировать как белка-летяга.";
    if (d100 >= 60 && d100 < 65) return "Способность осьминожки с присосками и ослепляющая атака чернилами.";
    if (d100 >= 65 && d100 < 70) return "Дополнительная пара рук.";
    if (d100 >= 70 && d100 < 85) return "Жировая прослойка на плюс 2 телосложения и 5 кд.";
    if (d100 >= 85 && d100 < 90) return "Слепое зрение в радиусе 60 футов.";
    if (d100 >= 90 && d100 < 95) return "Крокодилья пасть на к12 урона и когти на к8.";
    if (d100 >= 95 && d100 <= 100) return "Рерол.";
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
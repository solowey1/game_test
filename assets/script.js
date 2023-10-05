const telegramBot = '@spacegametestbot';

// Header
const header = document.getElementById('header');

// Menu button
const menu = document.getElementById('menu');
const menuBtn = header.querySelector('.menu-icons');
const menuBtnOpen = menuBtn.querySelector('.menu-open');
const menuBtnClose = menuBtn.querySelector('.menu-close');

menuBtn.addEventListener('click', (e) => {
    if (menu.classList.contains('shown')) {
        menu.classList.remove('shown');
        menuBtnOpen.classList.remove('hide');
        menuBtnClose.classList.add('hide');
    } else {
        menu.classList.add('shown');
        menuBtnOpen.classList.add('hide');
        menuBtnClose.classList.remove('hide');
    }
});

// request
const request = (urlencoded) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };
    fetch("https://n8n.solowey.ru/webhook/2639b53b-c7fa-493b-9b69-f74aad2dfb9e", requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        document.getElementById('debug-id').innerHTML = result.id;
        if (result.hasOwnProperty('code') && result.code === 0) {
            if (result.message === 'No item to return got found') {
                // отправить пользователю экран регистрации
            }
        } else {
            // отправить пользователю карту выбора уровней
        }
    })
    .catch(error => console.log('error', error));
}

// user_id
let userId;
const checkInBase = (id) => {
    const params = new URLSearchParams(id);
    if (params.get('user_id') !== null) {
        userId = params.get('user_id');
        const urlencoded = new URLSearchParams();
        urlencoded.append('id', userId);
        request(urlencoded);
    } else {
        alert(`Игра запущена не через Telegram. Чтобы играть, запустите Telegram-бота ${telegramBot}`);
    }
}
checkInBase(window.location.search);

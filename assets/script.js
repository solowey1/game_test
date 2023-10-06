const telegramBot = '@spacegametestbot';
let telegramId;

const message = [
    {
        name: 'check',
        value: [
            {
                type: 'success', text: [
                    'продолжить',
                    'С возвращением!'
                ]
            }, {
                type: 'error',
                text: [`Игра запущена не через Telegram. Чтобы играть, запустите Telegram-бота ${telegramBot}`]
            }
        ]
    }, {
        name: 'signup',
        value: [
            {
                type: 'success',
                text: ['Вы успешно зарегистрировались.<br>Добро пожаловать в&nbsp;игру!']
            }, {
                type: 'error',
                text: [
                    'Произошла ошибка. Попробуйте зарегистрироваться снова через какое-то время',
                    'Заполните обязательные поля',
                    'Введите корректный email'
                ]
            }
        ]
    }
];
const getMessage = (name, type, n = 0) => {
    const messageItem = message.find(item => item.name === name);    
    if (messageItem) {
        const valueItem = messageItem.value.find(item => item.type === type);
        if (valueItem) {
            return valueItem.text[n];
        } else {
            return 'Произошла неизвестная ошибка';
        }
    }
    return 'Произошла неизвестная ошибка';
}

const setSize = () => {
    const size = Math.round(window.innerWidth / 375 * 1000) / 1000;
    document.body.style.setProperty('--size', size);
}
setSize();

// Set variables
// Header
const header = document.getElementById('header');
// Menu
const menu = document.getElementById('menu');
const menuBtn = header.querySelector('.menu-icons');
const menuBtnOpen = menuBtn.querySelector('.menu-open');
const menuBtnClose = menuBtn.querySelector('.menu-close');
// Screens
const screenStart = document.getElementById('start');
const screenSignup = document.getElementById('signup');
const screenMap = document.getElementById('map');
const levelInfo = document.getElementById('level-info');
// Buttons
const startBtn = document.getElementById('start-button');
const signupBtn = document.getElementById('signup-button');
const levelBtns = document.querySelectorAll('.map-level-numbers');
const levelInfoBtnClose = levelInfo.querySelector('.cross');

const toast = (type, text = '') => {
    const element = document.getElementById('toast');
    element.classList.remove('shown', 'success', 'error');
    element.innerHTML = text;
    if (type !== '') element.classList.add(type);
    setTimeout(() => {element.classList.add('shown')}, 300);
    setTimeout(() => {element.classList.remove('shown')}, 2500);
}

// Request
const request = (method, urlencoded) => {
    const url = 'https://n8n.solowey.ru/webhook/2639b53b-c7fa-493b-9b69-f74aad2dfb9e';
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    urlencoded.append('method', method);
    urlencoded.append('telegram_id', telegramId);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };
    fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => {
        if (method === 'check') {
            if (result.hasOwnProperty('code') && result.code === 0) {
                startBtn.setAttribute('href', '#signup');
            } else if (result.hasOwnProperty('code') && result.code === 1) {
                document.getElementById('debug-id').innerHTML = telegramId;
                toast('', getMessage('check', 'success', 1));
                startBtn.innerHTML = getMessage('check', 'success');
            }
            startBtn.classList.add('shown');
        } else if (method === 'signup') {
            toast('success', getMessage('signup', 'success', 0));
            setTimeout(() => {
                document.getElementById('signup').classList.add('hide');
                // document.getElementById('signup').remove();
                document.getElementById('signup-button').classList.remove('disabled');
                setMap();
            }, 1000);
        } else if (method === 'map') {
            // const levels = screenMap.querySelectorAll('.map-level-number');
            // levels.forEach(level => {
            //     // result.
            // });
            screenStart.classList.add('hide');
            screenSignup.classList.add('hide');
            screenMap.classList.remove('hide');
            document.dispatchEvent(new Event('map'));
        }
    })
    .catch(error => {
        console.log('error', error);
        if (method === 'signup') {
            document.getElementById('signup-button').classList.remove('disabled');
            toast('error', getMessage('signup', 'error', 0));
        }
    });
}

// Find user by telegram user_id
const checkInBase = (urlparams) => {
    const params = new URLSearchParams(urlparams);
    if (params.get('telegram_id') !== null) {
        telegramId = parseInt(params.get('telegram_id'), 10);
        const urlencoded = new URLSearchParams();
        request('check', urlencoded);
    } else {
        alert(getMessage('check', 'error', 0));
    }
}
checkInBase(window.location.search);

// Get scores and set map
const setMap = () => {
    Math.ceil(window.innerWidth * 7.114);
    const urlencoded = new URLSearchParams();
    request('map', urlencoded);
}

// Button listeners
// Menu
const menuBtnCallback = (e) => {
    if (menu.classList.contains('shown')) {
        menu.classList.remove('shown');
        menuBtnOpen.classList.remove('hide');
        menuBtnClose.classList.add('hide');
    } else {
        menu.classList.add('shown');
        menuBtnOpen.classList.add('hide');
        menuBtnClose.classList.remove('hide');
    }
}
menuBtn.addEventListener('click', menuBtnCallback);

// Start button
const startBtnCallback = (e) => {
    if (e.target.hash === '#signup') {
        screenStart.classList.add('hide');
        screenSignup.classList.remove('hide');
    } else if (e.target.hash === '#start') {
        setMap();
        screenStart.classList.add('hide');
        screenMap.classList.remove('hide');
    }
}
startBtn.addEventListener('click', startBtnCallback);

// Signup
const signupBtnCallback = (e) => {
    e.target.classList.add('disabled');
    const form = e.target.parentNode.querySelector('form');
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('error');
        input.value === '' ? input.classList.add('error') : input.classList.remove('error');
    });
    const email = form.querySelector('[name="email"]').value;
    const fullname = form.querySelector('[name="fullname"]').value;
    const specialization = form.querySelector('[name="specialization"]').value;
    const validateEmail = (email) => {
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i.test(email);
    }
    if (email === '' || fullname === '' || specialization === '') {
        toast('error', getMessage('signup', 'error', 1));
        e.target.classList.remove('disabled');
    } else if (!validateEmail(email)) {
        inputs[0].classList.add('error');
        toast('error', getMessage('signup', 'error', 2));
        e.target.classList.remove('disabled');
    } else {
        const urlencoded = new URLSearchParams();
        urlencoded.append('email', email.toLowerCase());
        urlencoded.append('fullname', fullname);
        urlencoded.append('specialization', specialization);
        request('signup', urlencoded);
    }
}
signupBtn.addEventListener('click', signupBtnCallback);

// Level button
const levelBtnCallback = (e) => {
    const levelNumber = levelInfo.querySelector('.level-number');
    levelNumber.innerHTML = e.target.innerHTML;
    levelInfo.classList.remove('hide');
}
levelBtns.forEach(levelBtn => {
    levelBtn.addEventListener('click', levelBtnCallback);
    levelBtn.addEventListener('touchstart', levelBtnCallback);
});

// Level-info
const levelInfoBtnCloseCallback = (e) => {
    levelInfo.classList.add('hide');
}
levelInfoBtnClose.addEventListener('click', levelInfoBtnCloseCallback);

// Other listeners
// Resize
window.addEventListener('resize', (e) => {
    setSize();
})

// Map
const screenMapCallback = (e) => {
    if (e.target === screenMap || e.target.classList.contains('map-level-numbers')) {
        levelInfo.classList.add('hide');
    }
}
screenMap.addEventListener('click', screenMapCallback);

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // setMap();
});

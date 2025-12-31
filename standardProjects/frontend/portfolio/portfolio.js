const contents = document.querySelector('.contents');
const usernameInput = document.querySelector('.usernameInput');
const confirmButton = document.querySelector('.confirmButton');
const question = document.querySelector('.question');
const whiteLine = document.querySelector('.whiteLine');
const loadingIcon = document.querySelector('.loadingIcon');
const loadingScreen = document.querySelector('.loadingScreen');


const invalidSymbols = /[#!@+\-/><()*&%^$\s]/;


confirmButton.addEventListener('click', () => {
    if (!usernameInput.value || usernameInput.value.length > 15 || invalidSymbols.test(usernameInput.value)) return usernameErrorHandler('invalid username');
    animationHandler();
});

function typedHandler() {
    confirmButton.classList.add('showButton');
    confirmButton.addEventListener('animationend', () => {
        confirmButton.style.opacity = 1;
    })
}

function animationHandler() {
    whiteLine.classList.add('moveLeftAnim');
    confirmButton.classList.remove('showButton');
    confirmButton.classList.add('moveLeftAnim');
    usernameInput.classList.add('moveRightAnim');
    question.classList.add('moveRightAnim');
    console.log('classlists added')


    question.addEventListener('animationend', () => {
        loadingScreen.style.display = 'flex';
        setTimeout(() => {
            loadingScreen.classList.add('loadingScreenAnim');
            loadingIcon.classList.add('loadingIconSpin');
        }, 1000);

        setTimeout(() => {
            loadingScreen.classList.remove('loadingScreenAnim');
            loadingScreen.style.opacity = 1;
            loadingScreen.style.display = 'flex';
            setTimeout(() => {
                loadingScreen.classList.add('loadingScreenOut');
                const welcomeText = document.querySelector('.welcomeText');
                welcomeText.style.display = 'flex';
                welcomeText.textContent = `Welcome ${usernameInput.value}!`
                loadingScreen.addEventListener('animationend', () => {
                    welcomeText.classList.add('welcomeShow');
                })
            }, 10)
        }, 3000)
    });
}

function usernameErrorHandler(err) {
    usernameInput.value = '';
    usernameInput.placeholder = `error: ${err}`;
    return;
}

usernameInput.addEventListener('input', typedHandler);


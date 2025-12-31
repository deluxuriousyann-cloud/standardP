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
                    const mainContent = document.querySelector('.mainContent')
                    

                    document.querySelectorAll('.animatedBox').forEach((box) => {
                        box.classList.add('animateABox');
                    });
                    setTimeout(() => {
                        welcomeText.classList.add('moveWelcome')
                        mainContent.style.display = 'flex';
                        contents.style.display= 'none';
                        const textBox = document.querySelectorAll('.textBox')
                        
                        welcomeText.addEventListener('animationend', () => {
                            loadingScreen.style.display = 'none';
                            welcomeText.style.display = 'none';
                            mainContent.classList.add('showMainContent');

                            const observer = new IntersectionObserver(entries => {
                                entries.forEach((entry) => {
                                    if (entry.isIntersecting) {
                                        entry.target.classList.add('textBoxShow');
                                        typeContent(entry.target);
                                    } else {
                                        entry.target.classList.remove('textBoxShow');
                                    }
                                });
                            }, {threshold: 0.1});

                            textBox.forEach(el => observer.observe(el))
                        })
                    }, 3000)
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

function typeContent(totype) {
    let textsToType = totype.textContent;
    let indexToType = 0;
    console.log(totype.textContent)
    totype.textContent = '';

    const typing = setInterval(() => {
        if (indexToType < textsToType.length) {
            totype.textContent += textsToType[indexToType]
            indexToType++
        } else {
            clearInterval(typing)
            return;
        }
    }, 30)
}

//


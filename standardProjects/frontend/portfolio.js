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

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (!usernameInput.value || usernameInput.value.length > 15 || invalidSymbols.test(usernameInput.value)) return usernameErrorHandler('invalid username');
    animationHandler();
})

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
                        const username = usernameInput.value[0].toUpperCase() + usernameInput.value.slice(1, (usernameInput.value.length + 1)).toLowerCase().trim()
                        document.querySelector('.greet').textContent = `Welcome ${username}`
                        welcomeText.classList.add('moveWelcome')
                        mainContent.style.display = 'flex';
                        contents.style.display= 'none';
                        const textBox = document.querySelectorAll('.textBox');
                        const typingClass = document.querySelectorAll('.typing');
                        
                        welcomeText.addEventListener('animationend', () => {
                            loadingScreen.style.display = 'none';
                            welcomeText.style.display = 'none';
                            mainContent.classList.add('showMainContent');

                            const observer = new IntersectionObserver(entries => {
                                entries.forEach((entry) => {
                                    if (entry.isIntersecting) {
                                        entry.target.classList.add('textBoxShow');
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

const typeObserver = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            typeContent(entry.target);
        }
    })
})

const typingClass = document.querySelectorAll('.typing')
typingClass.forEach(el => typeObserver.observe(el));


//
//
//


const aiInterface = document.querySelector('.aiInterface')
const botResponse = document.querySelector('.botResponse')
const aiButton = document.querySelector('.aiButton')

aiButton.addEventListener('click', () => {
    if (!aiInterface.value) return;
    promptHandler(aiInterface.value)
})
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (!aiInterface.value) return;
    promptHandler(aiInterface.value);
})

async function promptHandler(prompt) {
    let search = prompt.trim()
    let reply = botResponse.textContent;
    botResponse.textContent = '';

    try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(search)}`
        )
        if (!res.ok) {
            reply = `i could not find what you're looking for: ${search}`
             botResponse.textContent = `Error 404 / search without using 'what is' || 'what'. Instead, search 'JavaScript' || 'HTML' and so on.`;
            return;
        }
        const data = await res.json();
        reply = data.extract || `No summary available for ${[search]}`
        
        let toType = reply;
        let typeIndex = 0;
        botResponse.textContent = ''

        const loop = setInterval(() => {
            if (typeIndex < toType.length) {
                botResponse.textContent += toType[typeIndex];
                typeIndex++
            } else {
                clearInterval(loop);
            }
        }, 10)

        return;
    } catch {
        botResponse.textContent = `Error 404 / search without using 'what is' || 'what'. Instead, search 'JavaScript' || 'HTML' and so on.`;
    }

}


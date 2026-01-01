const contents = document.querySelector('.contents');
const usernameInput = document.querySelector('.usernameInput');
const confirmButton = document.querySelector('.confirmButton');
const question = document.querySelector('.question');
const whiteLine = document.querySelector('.whiteLine');
const loadingIcon = document.querySelector('.loadingIcon');
const loadingScreen = document.querySelector('.loadingScreen');


const invalidSymbols = /[#!@+\-/><()*&%^$\s]/;

let submissionState = false;

confirmButton.addEventListener('click', () => {
    if (!usernameInput.value || usernameInput.value.length > 15 || invalidSymbols.test(usernameInput.value)) return usernameErrorHandler('invalid username');
    if (submissionState) return console.log('locked once');
    submissionState = true;
    animationHandler();
});

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (!usernameInput.value || usernameInput.value.length > 15 || invalidSymbols.test(usernameInput.value)) return usernameErrorHandler('invalid username');
    if (submissionState) return;
    submissionState = true;
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

//
// 
// 
// 
// 


const calculator = document.querySelector('.calculator')
const calcButtons = document.querySelectorAll('.calcButtons')
const calcDisplay = document.querySelector('.calcDisplay')

calcButtons.forEach((button) => {
    const value = button.dataset.value
    button.addEventListener('click', () => {
        if (!value) return;
        if (value == 'C') {
            setTimeout(() => {
                calcDisplay.textContent = '';
            }, 1)
            return;
        }
        if (value == '=') {
            getExpression(calcDisplay.textContent);
            return;
        }
        
        updateCalcDisplay(value);
        return;
    });
})

function getExpression(total) {
    totalVal = eval(total)
    calcDisplay.textContent = totalVal
    return;
}

function updateCalcDisplay(number) {
    if (!calcDisplay.textContent) {
        calcDisplay.textContent = number;
        return;
    }
    calcDisplay.textContent += number
}

// 
// GUESS THE NUMBER
// 

const gtnButton = document.querySelector('.gtnButton')
const checkBoxes = document.querySelectorAll('.gtnOptions')
const gtnRules = document.querySelector('.gtnRules')
const gtnInput = document.querySelector('.gtnInput')
const gtn = document.querySelector('.gtn')

let range = 0;
let numToGuess = 0;
let validInput = /[0-9]/
let attempts = 0;

checkBoxes.forEach((box) => {
    box.addEventListener('change', () => {
        if (box.checked) {
            checkBoxes.forEach((otherBox) => {
                if (otherBox !== box) {
                    otherBox.checked = false;
                }
            })
        }
    })   
})

gtnButton.addEventListener('click', () => {
    checkBoxes.forEach((box) => {
        if (box.checked) {
            range = box.dataset.value
            console.log(range)
            randomNumGenerator(range);
        }
    })
})

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (!gtnInput.value) return;
    if (!validInput.test(gtnInput.value)) return;

    guessHandler(gtnInput.value)
    return;
})

function randomNumGenerator(val) {
    gtnRules.style.opacity = 0; 
    gtnInput.style.opacity = 1;
    numToGuess = Math.floor(Math.random() * (val - 1) + val)
    console.log(numToGuess)
    return;
}

function guessHandler(guess) {
    if (guess == numToGuess) {
        gtn.textContent = `You won!`
        gtnInput.value = `It took you ${attempts} attemps to find the answer!`;
        attempts = 0;
        setTimeout(() => {
            gtnRules.style.opacity = 1
            gtnInput.style.opacity = 0
            numToGuess = '';
            gtn.textContent = `Guess the number!`
        }, 5000)
    } else if (guess < numToGuess) {
        gtn.textContent = `Higher`
        gtnInput.value = '';
        attempts++
    } else {
        gtn.textContent = `Lower`
        gtnInput.value = ``;
        attempts++
    }
}

// 
// 
// 
// 
// 


const API_KEY = "AIzaSyDC_0k2Pm68cwhi3-WwMoECSgGgM8afeKY"

async function searchMusic(query) {
  const url = `https://www.googleapis.com/youtube/v3/search?` +
    `part=snippet&type=video&videoCategoryId=10&maxResults=5&q=${encodeURIComponent(query)}&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();
  return data.items;
}

const resultsDiv = document.getElementById("results");
const player = document.getElementById("ytPlayer");

document.getElementById("musicBtn").addEventListener("click", async () => {
  const query = document.getElementById("musicSearch").value;
  if (!query) return;

  const results = await searchMusic(query);
  resultsDiv.innerHTML = "";

  results.forEach(video => {
    const div = document.createElement("div");
    div.textContent = video.snippet.title;
    div.className = "resultItem";

    div.addEventListener("click", () => {
      playVideo(video.id.videoId);
    });

    resultsDiv.appendChild(div);
  });
});

function playVideo(videoId) {
  player.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
}

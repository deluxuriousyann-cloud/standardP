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
    const storedUsername = localStorage.getItem("username")
    
    if (storedUsername !== usernameInput.value) {
        localStorage.setItem("username", usernameInput.value)
        console.log(`Username saved! ${localStorage.getItem("username")}`)
    } else {
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key[i]
            let value = localStorage.getItem(key)
            console.log(key, value)
        }
        console.log(`username already exists, all values: ${localStorage.username}`)

    }

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
// AI BAI
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
            searxng(search);
            return;
        }
        const data = await res.json();
        reply = data.extract || searxng(search)
        
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
        searxng(search);
    }

}

async function searxng(query) {

    try {
        const res = await fetch(
            `https://searx.be/search?q=${encodeURIComponent(query)}&format=json`
        )


        if (!res.ok) {
            botResponse.textContent = `I couldn't find what you're looking for: ${query}`
            return
        }

        const data = await res.json()
        console.log(data)

        // Example: show first result
        if (data.results && data.results.length > 0) {
            botResponse.textContent = data.results[0].content || 'No summary available.'
        } else {
            botResponse.textContent = `No results found for: ${query}`
        }

    } catch (err) {
        console.error(err)
        botResponse.textContent = `Search failed.`
    }
}


//
// 
// CALCULATOR
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
// YOUTUBE MUSIC
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


// 
// 
// WEATHER NI YANNIX
// 

const weatherInput = document.querySelector('.weather')
const weatherDisplay = document.querySelector('.weatherInfo')

let weatherInfo = '';

async function getWeather() {
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=12.879721&longitude=121.774017&daily=sunrise,sunset,daylight_duration,sunshine_duration,rain_sum,showers_sum,precipitation_sum,precipitation_probability_max,weather_code,temperature_2m_max,apparent_temperature_max,temperature_2m_min,apparent_temperature_min,uv_index_max,uv_index_clear_sky_max&minutely_15=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation,wind_gusts_10m,rain,sunshine_duration,wind_speed_80m,wind_direction_80m,is_day,visibility,weather_code&timezone=Asia/Manila&precipitation_unit=inch`
    try {
        const res = await fetch(weatherURL, {
            headers: {
                "Content-Type": "application/json"
                }
        });
        const data = await res.json();
        console.log(data);
        convertWeatherData(data)
    } catch (err) {
        console.log('erorr detected:' + err)
    }
}

getWeather()

function convertWeatherData(data) {
  // get first sunrise time
  const sunriseISO = data.daily.sunrise[0];

  const date = new Date(sunriseISO);

  const readableTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  console.log(readableTime);
  weatherInfo = `Time: ${readableTime}`

  if (weatherInfo) {
    let dateToday = data.daily.time[0]
    dateToday = dateToday.replaceAll('-', '/').trim()
    weatherInfo += `<br> Date: ${dateToday}`

    let daylightDuration = data.daily.daylight_duration[0]
    daylightDuration = Math.floor((daylightDuration / 60) / 60)
    weatherInfo += `<br> Daylight Duration: ${daylightDuration} Hours`

    const rain = data.daily.rain_sum
    const maxRain = Math.max(...rain);
    weatherInfo += `<br> Max rainfall: ${maxRain} inches`;

    const rainShowers = data.daily.showers_sum
    weatherInfo += `<br> Rain Showers: ${Math.max(...rainShowers)} inches`

    const rainPropability = data.daily.precipitation_probability_max
    weatherInfo += `<br> Rain Probability: ${Math.max(...rainPropability)}%`

    const maxTemperature = data.daily.temperature_2m_max
    const minTemperature = data.daily.temperature_2m_min
    
    console.log(minTemperature)

    weatherInfo += `<br> Average Temperature: ${Math.max(...minTemperature)} ℃`
    weatherInfo += `<br> Highest Temperature: ${Math.max(...maxTemperature)} ℃`

    const generationtime = data.generationtime_ms.toFixed(5)

    weatherInfo += `<br> `
    weatherInfo += `<br> Fetched data in ${generationtime} milliseconds`
    weatherInfo += `<br> Source: https://Open-Meteo.com`

    updateWeatherDisplay()
  }

  
  

  return;
}

function updateWeatherDisplay() {
    weatherDisplay.innerHTML = weatherInfo
    return;
}


//
// 
// WORDLE
// 
// 

const startWordle = document.querySelector('.startWordle')
const wordLine = document.querySelectorAll('.wordleLine')
const wordleGuess = document.querySelector('.wordleGuessInput')
const wordleDisplay = document.querySelector('.wordleDisplay')
const wordleRow = document.querySelectorAll('.wordleRow')

let wordleColumn = 1;
let hasStartedWordle = false;
let isWrong = false
let userGuess = ''
let wordleUserGuess = ''
let wordToGuess = ''
let allowedWordleGuess = /[a-z\s]+/i
let maxLetters = 0;

startWordle.addEventListener('click', () => {
    startWordle.style.opacity = 0
    startWordle.style.display = 'none';
    wordleGuess.style.display = 'flex';
    hasStartedWordle = true;
    wordleToGuessHandler()

    setTimeout(() => {
        wordleGuess.style.opacity = 1;
        return;
    })
})

wordleGuess.addEventListener('input', () =>  {
    userGuess = wordleGuess.value.slice((wordleGuess.value.length - 1), wordleGuess.value.length)
    
    if (!hasStartedWordle) return;
    maxLetters++

    if (maxLetters > 5) {
        deletedGuessLetter = wordleGuess.value.slice((wordleGuess.value.length - 1), wordleGuess.value.length)
        wordleGuess.value = wordleGuess.value.replace(deletedGuessLetter, '')
        console.log(`deleting ${deletedGuessLetter}, new value: ${wordleGuess.value}`)
    }

    for (const line of wordLine) {
        if (!line.textContent && maxLetters < 6) {
            line.textContent = userGuess.toUpperCase();
            console.log('updated line succesfully')
            console.log(`Max letters count: ${maxLetters}`)
            break;
        } else {
            console.log('failed to add text')
        }
    }
    
    return;
})

document.addEventListener('keydown', (e) => {
    let i = 0;
    if (!hasStartedWordle) return;
    if (e.key !== 'Enter') return;
    if (wordleGuess.value < 5) return;
    wordleRow.forEach((row) => {
        row.querySelectorAll('.wordleLine')
        
    })

    for (const line of wordLine) {  
        if (line.textContent) {
        if (line.textContent == wordToGuess[i]) {
            console.log(i)
            line.classList.add('correct');
        } else if (wordToGuess.includes(line.textContent)) {
            line.classList.add('close');
        }
        console.log(i)
        i++
        line.classList.add('filled');
        isWrong = true
        }
    }

    
    if (isWrong) maxLetters = 0;
    wordleGuess.value = ''
    isWrong = false
    const filledLines = document.querySelectorAll('.wordleLine.filled')
    filledLines.forEach((line) => {
        console.log(line)
    })

})

function wordleToGuessHandler() {
    const arrayOfWords = [
        'HELLO',
        'WORLD',
        'GREEN'
    ]

    wordToGuess = arrayOfWords[Math.floor(Math.random() * arrayOfWords.length)]
    console.log('Your word to guess is ' + wordToGuess)
}






// 
// MENU ANIMATION
// 
// 

const menuIcon = document.querySelector('.menuIcon')
const menuOptions = document.querySelector('.menuOptions')

let menuOpened = false

menuIcon.addEventListener('click', () => {
    const mainContent = document.querySelector('.mainContent')
    if (menuOpened) {
        menuIcon.classList.add('menuIconClose')
        menuIcon.classList.remove('menuIconOpen')
        menuOptions.classList.remove('showMenuOptions')
        menuOptions.classList.add('hideMenuOptions')
        menuOpened = false;
        console.log('closing menu')
    } else {
        menuIcon.classList.remove('menuIconClose')
        menuIcon.classList.add('menuIconOpen')
        menuOptions.classList.remove('hideMenuOptions')
        menuOptions.classList.add('showMenuOptions')
        menuOpened = true
        console.log('opening menu')
    }
})

// 
// 
// RANDOM PASS GENERATOR
// 
// 
const passwordOption = document.querySelectorAll('.passwordOption');
const passwordDisplay = document.querySelector('.randomPassDisplay');
const generateButton = document.querySelector('.generatePass');

// Just use strings, not arrays
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_-+=|/?><.,;:';

function randomPassGenerator(allowedChars) {
    let result = '';
    for (let i = 0; i < 30; i++) {
        result += allowedChars[Math.floor(Math.random() * allowedChars.length)];
    }
    console.log('Generated password:', result);
    passwordDisplay.textContent = result;
    navigator.clipboard.writeText(result)
        .then(() => {
            console.log(`copied text`)
        })
        .catch((err) => {
            console.error('failed to copy: ', err)
        })
    
}

// Toggle class when clicked
passwordOption.forEach(option => {
    option.addEventListener('click', () => {
        option.classList.toggle('toggledPasswordOption');
    });
});

generateButton.addEventListener('click', () => {
    // Build one big string of allowed characters
    let allowed = '';

    passwordOption.forEach(option => {
        if (option.classList.contains('toggledPasswordOption')) {
            switch (option.dataset.value) {
                case 'allowLow':
                    allowed += lowercase;
                    break;
                case 'allowUp':
                    allowed += uppercase;
                    break;
                case 'allowNum':
                    allowed += numbers;
                    break;
                case 'allowSym':
                    allowed += symbols;
                    break;
            }
        }
    });

    if (!allowed) {
        passwordDisplay.textContent = 'Please select at least one option!';
        return;
    }

    randomPassGenerator(allowed);
});


// 
// 
// RANDOM FACTS
// 
// 

const randomFactsDisplay = document.querySelector('.randomFactsDisplay')

setInterval(() => {
    getRandomFact()
    getJokes()
}, 5000)

async function getRandomFact() {
    const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en')
    const data = await res.json()
    updateRandomFactsDisplay(data.text)
    return;
}

function updateRandomFactsDisplay(data) {
    randomFactsDisplay.textContent = data;
}

// 
// 
// RANDOM JOKES
// 
// 

const randomJokesDisplay = document.querySelector('.randomJokesDisplay')

async function getJokes() {
    const res = await fetch('https://official-joke-api.appspot.com/random_joke')
    const data = await res.json()
    updateJokesDisplay(data.setup, data.punchline)
    console.log(data.setup)
}

function updateJokesDisplay(data, punchline) {
    randomJokesDisplay.textContent = data + '... ' + punchline
}
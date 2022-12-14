// Hamburger open/close (for mobile/small screen)
const hamburgerArea = document.querySelector('.hamburger-container')
const hamburgerList = document.querySelector('nav ul');
hamburgerArea.addEventListener('click', _ => {
    const hamburgerMenu = document.querySelector('.hamburger-menu')
    hamburgerMenu.classList.toggle('open');
    hamburgerList.style.display = (hamburgerMenu.classList.contains('open')) ? 'flex' : 'none';
});

window.addEventListener('resize', _ => {
    if(getComputedStyle(hamburgerArea).display === 'none') {
        hamburgerList.style.display = 'flex';
    } else {
        hamburgerList.style.display = 'none';
    }
})

const navButtons = document.querySelectorAll('nav li');
navButtons.forEach(button => {
    button.addEventListener('click', _ => {
        if(getComputedStyle(hamburgerArea).display === 'none') return;
        hamburgerArea.children[0].classList.toggle('open');
        hamburgerList.style.display = 'none';
    });
});

// Scroll effect
const welcomeScreen = document.getElementById('welcome');
welcomeScreen.classList.add('show');

const articles = document.querySelectorAll('article');
articles[0].classList.add('show'); // Prevents blank view for mobile users on about article

function isInView(element, offset = 0) {
    const {top, bottom} = element.getBoundingClientRect();
    return top <= (window.innerHeight || document.documentElement.clientHeight) - offset && bottom >= offset;
}

function handleScroll(element) {
    if(isInView(element, 100)) {
        element.classList.add('show');
    } else {
        element.classList.remove('show');
    }
}

document.addEventListener('scroll', () => {
    handleScroll(welcomeScreen);
    articles.forEach(article => {
        handleScroll(article);
    });
});

// Form submit
const form = document.getElementById('contact-form');
const submitButton = form.querySelector('button');

function toggle(button) {
    const toggleTexts = {
        'Send': 'Sending...',
        'Sending...': 'Send'
    };
    button.toggleAttribute('disabled');
    button.children[0].classList.toggle('hide');
    button.children[1].classList.toggle('hide');
    button.children[2].textContent = toggleTexts[button.children[2].textContent];
}

function showPostSubmitMessage(isSuccess) {
    const color = isSuccess ? '#00CC00' : '#FF0000';
    const message = isSuccess ? 'Message sent successfully. Thank you for the feedback!' : 'There was a problem while sending the message, please try again.';
    const className = 'fa-solid ' + (isSuccess ? 'fa-circle-check' : 'fa-circle-xmark');
    const postSubmitMessageElement = document.getElementById('post-submit-message');
    postSubmitMessageElement.style.display = 'flex';
    postSubmitMessageElement.style.backgroundColor = color;
    postSubmitMessageElement.children[0].className = className;
    postSubmitMessageElement.children[1].textContent = message;
}

form.addEventListener('submit', e => {
    e.preventDefault();
    toggle(submitButton);
    fetch('https://toku-bot-server.herokuapp.com/api/messages/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
        })
    }).then(res => {
        showPostSubmitMessage(res.status === 200);
        toggle(submitButton)
        form.reset();
    }).catch(() => {
        showPostSubmitMessage(false);
        toggle(submitButton);
    });
});
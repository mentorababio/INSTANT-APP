const signInBtnLink = document.querySelector('.signInBtn-Link');
const signUpBtnLink = document.querySelector('.signUpBtn-Link');
const wrapper = document.querySelector('.wrapper');

signUpBtnLink.addEventListener('click', () => {
  wrapper.classList.toggle('active');
});

signInBtnLink.addEventListener('click', () => {
  wrapper.classList.toggle('active');
});

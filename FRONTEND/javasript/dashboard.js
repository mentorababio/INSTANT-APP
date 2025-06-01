// Navigation logic
const screens = {
  'home-screen': document.getElementById('home-screen'),
  'fund-screen': document.getElementById('fund-screen')
};

function showScreen(screenId) {
  for (const key in screens) {
    screens[key].style.display = key === screenId ? 'block' : 'none';
  }
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === screenId);
  });
}

// Home to Fund Wallet button
document.getElementById('fund-wallet-btn').onclick = () => showScreen('fund-screen');

// Navigation bar
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.screen) showScreen(btn.dataset.screen);
  });
});

// Continue button (Fund Wallet)
document.getElementById('continue-btn').onclick = function() {
  alert('Proceeding to fund wallet with amount: ' + document.getElementById('amount-input').value);
  showScreen('home-screen');
};

// Optional: Show balance toggle
document.getElementById('show-balance-btn').onclick = function() {
  const bal = document.querySelector('.wallet-balance');
  if (bal.style.filter === 'blur(5px)') {
    bal.style.filter = '';
    this.textContent = 'Hide balance';
  } else {
    bal.style.filter = 'blur(5px)';
    this.textContent = 'Show balance';
  }
};
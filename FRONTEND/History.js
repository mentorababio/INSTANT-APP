// Placeholder for future transaction loading
const transactionList = document.getElementById('transactionList');
const searchInput = document.getElementById('searchInput');

// You could load data into the DOM dynamically later using this function
function renderTransactions(data) {
  transactionList.innerHTML = '';
  if (data.length === 0) {
    transactionList.innerHTML = '<div class="empty-message">No transactions found.</div>';
    return;
  }

  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'transaction-card';
    card.innerHTML = `
      <div class="transaction-left">
        <i>📌</i>
        <div>
          <div class="transaction-name">${item.name}</div>
          <div class="transaction-time">${item.date}</div>
        </div>
      </div>
      <div>
        <div class="transaction-amount">₦${item.amount}</div>
        <div class="transaction-status">${item.status}</div>
      </div>
    `;
    transactionList.appendChild(card);
  });
}


searchInput.addEventListener('input', function () {
  
});
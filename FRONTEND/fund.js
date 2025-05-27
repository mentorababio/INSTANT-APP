document.getElementById('fund-form').onsubmit = function(e) {
  e.preventDefault();
  const amount = document.getElementById('amount').value;
  if (amount && amount > 0) {
    alert('You are funding your wallet with ₦' + parseInt(amount).toLocaleString());
    // Here you can add logic to process the payment or redirect
    document.getElementById('amount').value = '';
  } else {
    alert('Please enter a valid amount.');
  }
};
document.getElementById('fund-form').onsubmit = async function(e) {
  e.preventDefault();
  const amount = document.getElementById('amount').value;
  if (amount && amount > 0) {
    alert('You are funding your wallet with ₦' + parseInt(amount).toLocaleString());
    // Here you can add logic to process the payment or redirect
    document.getElementById('amount').value = '';
  } else {
    alert('Please enter a valid amount.');
  } try {
    // Call your backend API
    const response = await fetch('/api/wallet/fund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // if you're using JWT
      },
      body: JSON.stringify({ amount: amount })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Wallet funded successfully!');
      // Redirect to success page
      window.location.href = '/wallet';
    } else {
      alert('Error funding wallet: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Network error occurred');
  }
};

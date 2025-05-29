// Helper to switch screens
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
  }
  
  // Amount button selection
  document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('amount').value = this.dataset.amount;
    });
  });
  
  // Handle form submission
  document.getElementById('airtimeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Get values
    const network = document.getElementById('network').value;
    const phone = document.getElementById('phone').value;
    const amount = document.getElementById('amount').value;
  
    // Fill confirmation screen
    document.getElementById('confirmNetwork').textContent = network;
    document.getElementById('confirmPhone').textContent = phone;
    document.getElementById('confirmAmount').textContent = amount;
  
    showScreen('screen2');
  });
  
  // Handle confirm payment
  document.getElementById('confirmBtn').addEventListener('click', function() {
    // Copy details to success screen
    document.getElementById('successNetwork').textContent = document.getElementById('confirmNetwork').textContent;
    document.getElementById('successPhone').textContent = document.getElementById('confirmPhone').textContent;
    document.getElementById('successAmount').textContent = document.getElementById('confirmAmount').textContent;
    document.getElementById('successDate').textContent = new Date().toLocaleString();
  
    showScreen('screen3');
  });
  
  // Done button resets to form
  document.getElementById('doneBtn').addEventListener('click', function() {
    document.getElementById('airtimeForm').reset();
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
    showScreen('screen1');
  });
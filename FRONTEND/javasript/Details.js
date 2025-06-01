function goBack() {
    window.location.href = 'transaction-history.html';
  }

  const transaction = JSON.parse(localStorage.getItem('selectedTransaction'));
  const summary = document.getElementById('summary');
  const details = document.getElementById('details');

  if (transaction) {
    summary.innerHTML = `
      <p>Purchase ${transaction.title} to ${transaction.phone || 'N/A'}</p>
      <h2>${transaction.amount}</h2>
      <p class="success">${transaction.status}</p>
    `;

    details.innerHTML = `
      <div><strong>Service Type</strong><span>${transaction.title}</span></div>
      <div><strong>Amount</strong><span>${transaction.amount}</span></div>
      <div><strong>Transaction Date</strong><span>${transaction.date}</span></div>
      <div><strong>Transaction Status</strong><span class="success">${transaction.status}</span></div>
      <div><strong>Transaction ID</strong><span>${transaction.id}</span></div>
    `;
  } else {
    summary.innerHTML = `<p>No transaction selected.</p>`;
  }

  function downloadReceipt() {
    if (!transaction) return;

    const text = `
      Transaction Receipt\n\n
      Title: ${transaction.title}\n
      Phone: ${transaction.phone || 'N/A'}\n
      Amount: ${transaction.amount}\n
      Status: ${transaction.status}\n
      Date: ${transaction.date}\n
      Transaction ID: ${transaction.id}
    `;

    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_${transaction.id}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
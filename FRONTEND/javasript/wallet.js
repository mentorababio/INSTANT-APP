const status = localStorage.getItem("paymentStatus"); // success | fail | pending
const amountFunded = localStorage.getItem("amountFunded") || 0;
const walletBalance = localStorage.getItem("walletBalance") || 0;
const transactionId = localStorage.getItem("transactionId") || "#0000000000";

const now = new Date();
const date = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
             '  ' + now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

document.getElementById("amountFunded").innerText = `₦${parseInt(amountFunded).toLocaleString()}`;
document.getElementById("walletBalance").innerText = `₦${parseInt(walletBalance).toLocaleString()}`;
document.getElementById("transactionId").innerText = transactionId;
document.getElementById("fundDate").innerText = date;

    const statusMsg = document.getElementById("statusMessage");
    const statusIcon = document.getElementById("statusIcon");
    const doneText = document.getElementById("doneText");
    const detailsBox = document.getElementById("detailsBox");

    if (status === "success") {
      statusMsg.innerText = "Wallet Funded Successfully";
      statusMsg.style.color = "green";
      statusIcon.innerText = "✔️";
      statusIcon.className = "icon checkmark";
      doneText.className = "done green";
    } else if (status === "fail") {
      statusMsg.innerText = "Transaction Failed. Please try again.";
      statusMsg.style.color = "red";
      statusIcon.innerText = "❌";
      statusIcon.className = "icon crossmark";
      doneText.className = "done red";
      detailsBox.style.display = "none";
    } else if (status === "pending") {
      statusMsg.innerText = "Transaction Pending. Awaiting Confirmation.";
      statusMsg.style.color = "orange";
      statusIcon.innerText = "⏳";
      statusIcon.className = "icon pendingmark";
      doneText.innerText = "Pending";
      doneText.className = "done orange";
    } else {
      statusMsg.innerText = "Unknown status.";
      statusIcon.innerText = "❓";
      statusIcon.className = "icon";
      doneText.innerText = "";
      detailsBox.style.display = "none";
    }

    function goToWallet() {
      window.location.href = "home.html"; 
    }
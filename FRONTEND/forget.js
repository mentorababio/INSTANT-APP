document.getElementById('resetForm').onsubmit = function(e) {
  e.preventDefault();
  const newPassword = document.getElementById('new-password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();
  const messageDiv = document.getElementById('message');

  if (newPassword.length < 6) {
    messageDiv.textContent = "Password must be at least 6 characters.";
    return;
  }
  if (newPassword !== confirmPassword) {
    messageDiv.textContent = "Passwords do not match.";
    return;
  }
  if (newPassword.toLowerCase() === "password") {
    messageDiv.textContent = "Password is too common.";
    return;
  }
  // Simulate success
  messageDiv.style.color = "#388e3c";
  messageDiv.textContent = "Password changed successfully!";
  // Optionally, reset the form
  document.getElementById('resetForm').reset();
};
function goBack() {
    window.history.back();
  }
  
function validateNumber(input) {
    input.value = input.value.replace(/[^0-9 ]/g, '');
  }

  function validateName(input) {
    input.value = input.value.replace(/[^a-zA-Z ]/g, '');
  }

  function validateCVV(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  function submitPayment() {
    let isValid = true;

    const cardNumber = document.getElementById('cardNumber').value.trim();
    const cardName = document.getElementById('cardName').value.trim();
    const expiry = document.getElementById('expiry').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    document.getElementById('cardNumberError').innerText = "";
    document.getElementById('cardNameError').innerText = "";
    document.getElementById('expiryError').innerText = "";
    document.getElementById('cvvError').innerText = "";

    if (!/^\d{16}$/.test(cardNumber.replace(/ /g, ''))) {
      document.getElementById('cardNumberError').innerText = "Enter a valid 16-digit card number.";
      isValid = false;
    }

    if (!/^[a-zA-Z ]+$/.test(cardName)) {
      document.getElementById('cardNameError').innerText = "Only alphabets are allowed.";
      isValid = false;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      document.getElementById('expiryError').innerText = "Use MM/YY format.";
      isValid = false;
    }

    if (!/^\d{3}$/.test(cvv)) {
      document.getElementById('cvvError').innerText = "CVV must be 3 digits.";
      isValid = false;
    }

    if (isValid) {
      alert("Card verified! Proceeding to wallet funding...");
      window.location.href = "wallet-success.html";
    }
  }
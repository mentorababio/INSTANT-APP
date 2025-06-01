

  


  let selectedOption = null;

  function goHome() {
    window.location.href = "Home.html"; 
  }

  function selectOption(element) {
    
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('active'));
    
    
    element.classList.add('active');
    selectedOption = element.getAttribute('data-url');
  }h

  function proceed() {
    if (selectedOption) {
      window.location.href = selectedOption;
    } else {
      alert("Please select a payment method.");
    }
  }
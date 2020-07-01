// Listen for Submit
document.getElementById('loan-form').addEventListener('submit', function(e){  
  // Hide Results
  document.getElementById('results').style.display = 'none';

  // Show loading GIF
  document.getElementById('loading').style.display = 'block';

  // Stop Gif
  setTimeout(calculateResults, 2000);

  e.preventDefault();
});

function calculateResults(){
  // UI Variables
  const amt = document.getElementById('amount');
  const inst = document.getElementById('interest');
  const years = document.getElementById('years');
  const m_payment = document.getElementById('monthly-payment');
  const t_payment = document.getElementById('total-payment');
  const t_interest = document.getElementById('total-interest');

  const principal = parseFloat(amt.value);
  const calc_interst = parseFloat(inst.value) / 120;
  const calc_payments = parseFloat(years.value * 12);

  r = Math.pow(1 + calc_interst, calc_payments);
  const monthly = (principal * r * calc_interst) / (r - 1);

  if (isFinite(monthly)){
    m_payment.value = monthly.toFixed(2);
    t_payment.value = (monthly * calc_payments).toFixed(2);
    t_interest.value = ((monthly * calc_payments) - principal).toFixed(2);

    // Update display
    document.getElementById('results').style.display = 'block';
    document.getElementById('loading').style.display = 'none';
  }
  else{
    showError("Error! Fix your inputs.");

    // Hide Results
    document.getElementById('results').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
  }
}

// Show Error
function showError(msg){
  // Create a div
  const errorDiv = document.createElement('div');

  // Get elements
  const card = document.querySelector('.card');
  const heading = document.querySelector('.heading');

  // Add class
  errorDiv.className = 'alert alert-danger';

  // Create text node and append to div
  errorDiv.appendChild(document.createTextNode(msg));

  // Insert error above heading
  card.insertBefore(errorDiv, heading);

  // Clear error after 3 seconds
  setTimeout(clearError, 1500);
}

// Clear Error
function clearError(){
  document.querySelector('.alert').remove();
}
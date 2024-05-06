function updateTotal() {
    let total = 0;
    const costInputs = document.querySelectorAll('.cost');
    costInputs.forEach(input => {
      total += parseFloat(input.value) || 0;
    });
    document.getElementById('totalInput').value = 'Rs.' + total.toFixed(2) + '/-';
    updateTotalValue(total.toFixed(2));
  }
  
  function updateTotalValue(total) {
    var availableAmount = manager.sum - total + 750000;
    document.getElementById('availableAmount').innerText = 'Rs.' + availableAmount.toFixed(2) + '/-';
    updateSpentValue('Rs.' + total.toFixed(2) + '/-');
  }
  
  function updateSpentValue(spentValue) {
    document.getElementById('spentInput').value = spentValue;
  }
  
  updateTotal();
  
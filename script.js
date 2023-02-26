let numIterations
let newInvestment
let startValues = [];

let targetAllocation = [];


function addNewRow(startValue = 0, targetAllocation = 0) {
    const table = document.getElementById('investment-table-body');
    const newRow = table.insertRow(-1);
    const id = table.rows.length;
  
    const idCell = newRow.insertCell(0);
    idCell.innerHTML = id;
  
    const startValueCell = newRow.insertCell(1);
    const startValueInput = document.createElement('input');
    startValueInput.type = 'text';
    startValueInput.className = 'input-cell';
    startValueInput.value = startValue.toFixed(2);
    startValueCell.appendChild(startValueInput);
  
    const targetAllocationCell = newRow.insertCell(2);
    const targetAllocationInput = document.createElement('input');
    targetAllocationInput.type = 'text';
    targetAllocationInput.className = 'input-cell';
    targetAllocationInput.value = targetAllocation.toFixed(5);
    targetAllocationCell.appendChild(targetAllocationInput);
  
    newRow.insertCell(3);
    newRow.insertCell(4);
}


  

function readInputs() {
    newInvestment = parseFloat(document.getElementById('new_investment').value);
    numIterations = parseInt(document.getElementById('num_iterations').value);
    startValues = [];
    targetAllocation = [];

    const table = document.getElementById('investment-table-body');
    const numRows = table.rows.length;
    for (let i = 0; i < numRows; i++) {
        const targetCell = table.rows[i].cells[2];
        const currentCell = table.rows[i].cells[1];

        const targetValue = parseFloat(targetCell.children[0].value);
        const currentValue = parseFloat(currentCell.children[0].value);

        targetAllocation.push(targetValue);
        startValues.push(currentValue);
    }

    console.log(newInvestment)
    console.log(numIterations)
    console.log(startValues)
    console.log(targetAllocation)
}

function distributeInvestment(targetAllocations, currentValues, newInvestment, numIterations) {

    const currentTotal = currentValues.reduce((a, b) => a + b, 0);
    const futureTotal = currentTotal + newInvestment;
    let adjAllocations = targetAllocations.slice();
  
    for (let i = 0; i < numIterations; i++) {
      let proposedAllocation = adjAllocations.map(target => target * newInvestment);
      let newBalances = currentValues.map((current, index) => current + proposedAllocation[index]);
      let newAllocation = newBalances.map(balances => balances / futureTotal);
      let allocationDiff = targetAllocations.map((target, index) => target - newAllocation[index]);
      adjAllocations = adjAllocations.map((adj, index) => adj + allocationDiff[index]);
    }
  
    let proposedAllocation = adjAllocations.map(target => Math.round(target * newInvestment));
  
    return proposedAllocation;
  }
  

function updateTable() {
    const proposedAllocation = distributeInvestment(targetAllocation, startValues, newInvestment, numIterations);
    const table = document.getElementById('investment-table-body');
    const numRows = table.rows.length;
    for (let i = 0; i < numRows; i++) {
      if (i <= proposedAllocation.length) {
        const toBeInvested = proposedAllocation[i];
        table.rows[i].cells[3].innerHTML = toBeInvested.toFixed(2);
        table.rows[i].cells[4].innerHTML = (startValues[i] + toBeInvested).toFixed(5);
      }
    }
  }

function calculateDistribution(){
    readInputs();
    updateTable();
}

function deleteAllEntries(){
    document.getElementById('investment-table-body').innerHTML =""
}


// START
// add new row, just to have at least one
window.onload = function() {
    //addNewRow();
};

function loadTestData(){
    document.getElementById('new_investment').value = 24000;
    document.getElementById('num_iterations').value = 100;
    addNewRow(3173.45, 0.08);
    addNewRow(3605.60, 0.08);
    addNewRow(1587.80, 0.04);
    addNewRow(3394.75, 0.08);
    addNewRow(3056.90, 0.08);
    addNewRow(1061.48, 0.04);
    addNewRow(5511.70, 0.16);
    addNewRow(1670.06, 0.096);
    addNewRow(2260.09, 0.064);
    addNewRow(1177.10, 0.04);
    addNewRow(1780.75, 0.04);
    addNewRow(6569.42, 0.2);
}
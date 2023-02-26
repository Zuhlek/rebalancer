let numIterations
let newInvestment
let startValues = [];
let targetAllocation = [];

// table column definitions
let tblColID = 0;
let tblColName = 1;
let tblColStart = 2;
let tblColTargetAllo = 3;
let tblColInvestment = 4;
let tblColEnd = 5;


function addNewRow(name = "", startValue = 0, targetAllocation = 0) {
    const table = document.getElementById('investment-table-body');
    const newRow = table.insertRow(-1);
    const id = table.rows.length;
  
    const idCell = newRow.insertCell(tblColID);
    idCell.innerHTML = id;

    const nameValueCell = newRow.insertCell(tblColName);
    const nameValueInput = document.createElement('input');
    nameValueInput.type = 'text';
    nameValueInput.className = 'input-cell';
    nameValueInput.value = name;
    nameValueCell.appendChild(nameValueInput);
  
    const startValueCell = newRow.insertCell(tblColStart);
    const startValueInput = document.createElement('input');
    startValueInput.type = 'text';
    startValueInput.className = 'input-cell';
    startValueInput.value = startValue.toFixed(2);
    startValueCell.appendChild(startValueInput);
  
    const targetAllocationCell = newRow.insertCell(tblColTargetAllo);
    const targetAllocationInput = document.createElement('input');
    targetAllocationInput.type = 'text';
    targetAllocationInput.className = 'input-cell';
    targetAllocationInput.value = targetAllocation.toFixed(5);
    targetAllocationCell.appendChild(targetAllocationInput);
  
    newRow.insertCell(tblColInvestment);
    newRow.insertCell(tblColEnd);
}


  

function readInputs() {
    newInvestment = parseFloat(document.getElementById('new_investment').value);
    numIterations = parseInt(document.getElementById('num_iterations').value);
    startValues = [];
    targetAllocation = [];

    const table = document.getElementById('investment-table-body');
    const numRows = table.rows.length;
    for (let i = 0; i < numRows; i++) {
        const targetCell = table.rows[i].cells[tblColTargetAllo];
        const currentCell = table.rows[i].cells[tblColStart];

        const targetValue = parseFloat(targetCell.children[0].value);
        const currentValue = parseFloat(currentCell.children[0].value);

        targetAllocation.push(targetValue);
        startValues.push(currentValue);
    }
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
      table.rows[i].cells[tblColInvestment].innerHTML = toBeInvested.toFixed(2);
      table.rows[i].cells[tblColEnd].innerHTML = (startValues[i] + toBeInvested).toFixed(2);
    }
  }
}

function updateTotalRow(){
  // Erhalte die Tabelle und die Zeilen
  const tableBody = document.getElementById("investment-table-body");
  const rows = tableBody.getElementsByTagName("tr");
  
  let totalColStart = 0;
  let totalColTarget = 0;
  let totalColInvestment = 0;
  let totalColEnd = 0;
  
  // Iteriere durch jede Zeile der Tabelle und addiere die Werte in den Spalten 3, 4, 5 und 6 zur entsprechenden Summe
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("td");
    
    // Spalte 3: Index 2 (wegen 0-basierter Indexierung)
    totalColStart += parseFloat(cells[tblColStart].querySelector("input").value) || 0;
    
    // Spalte 4: Index 3
    totalColTarget += parseFloat(cells[tblColTargetAllo].querySelector("input").value) || 0;
    
    // Spalte 5: Index 4
    totalColInvestment += parseFloat(cells[tblColInvestment].innerHTML) || 0;
    
    // Spalte 6: Index 5
    totalColEnd += parseFloat(cells[tblColEnd].innerHTML) || 0;
  }

  document.getElementById("investment-table-foot-start-col").textContent = totalColStart.toFixed(2);
  document.getElementById("investment-table-foot-target-col").textContent = totalColTarget.toFixed(2);
  document.getElementById("investment-table-foot-investment-col").textContent = totalColInvestment.toFixed(2);
  document.getElementById("investment-table-foot-end-col").textContent = totalColEnd.toFixed(2);

}

function calculateDistribution(){
    readInputs();
    updateTable();
    updateTotalRow();
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
    addNewRow("VNRT, IE00BKX55R35", 3173.45, 0.08);
    addNewRow("IEVL, IE00BQN1K901", 3605.60, 0.08);
    addNewRow("VAPX, IE00B9F5YL18", 1587.80, 0.04);
    addNewRow("CSUSS, IE00B3VWM098", 3394.75, 0.08);
    addNewRow("SMCX, IE00BKWQ0M75", 3056.90, 0.08);
    addNewRow("ISFE, IE00B2QWDR12", 1061.48, 0.04);
    addNewRow("EGUSAS, IE00B3Z3FS74", 5511.70, 0.16);
    addNewRow("BTC", 1670.06, 0.096);
    addNewRow("ETH", 2260.09, 0.064);
    addNewRow("EURE, IE00BSJCQV56", 1177.10, 0.04);
    addNewRow("CCUSAS, IE00B53H0131", 1780.75, 0.04);
    addNewRow("LYMAA, LU1287023342", 6569.42, 0.2);
}

function saveAsJSON(){
  // Erhalte die Tabelle und die Zeilen
  const tableBody = document.getElementById("investment-table-body");
  const rows = tableBody.getElementsByTagName("tr");
  
  // Erstelle ein Objekt, um die Tabellendaten zu speichern
  const tabellenDaten = {
    investment: 0,
    iteration: 0,
    items: {}
  };
  
  // Iteriere durch jede Zeile der Tabelle und speichere die Werte in das Objekt
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const zellen = row.getElementsByTagName("td");
    const index = parseInt(zellen[0].textContent);
    
    // Speichere die Werte in die entsprechenden Eigenschaften des Objekts
    tabellenDaten.investment = parseFloat(document.getElementById("new_investment").value);
    tabellenDaten.iteration = parseFloat(document.getElementById("num_iterations").value);
    tabellenDaten.items[index] = {
      name: zellen[tblColName].querySelector("input").value,
      start: parseFloat(zellen[tblColStart].querySelector("input").value),
      targetAllo: parseFloat(zellen[tblColTargetAllo].querySelector("input").value)
    };
  }

  return tabellenDaten;

}

function loadFromJSON(JSONData) {
  if (!JSONData) { return; }

  // Entferne zusätzliche Zeichenfolge
  JSONData = JSONData.replace(/\\"/g, '"');
  
  // Konvertiere die JSON-Zeichenfolge in ein Objekt
  const tblData = JSON.parse(JSONData);

  console.log(tblData)
  // Setze die Werte in der Tabelle
  document.getElementById("new_investment").value = tblData.investment;
  document.getElementById("num_iterations").value = tblData.iteration;
  
  // Erstelle fuer jedes Item in "items" eine neue Zeile in der Tabelle
  for (let index in tblData.items) {
    const item = tblData.items[index];
    const name = item.name;
    const start = item.start;
    const targetAllo = item.targetAllo;
    addNewRow(name, start, targetAllo);
  }
}

function donwloadCurrentData(){
    // Rufe zuerst die saveAsJSON-Methode auf, um den JSON-String zu erhalten
    const tabellenDaten = saveAsJSON();
    const jsonDaten = JSON.stringify(tabellenDaten);
    
    // Erstelle einen Blob aus den Daten
    const blob = new Blob([jsonDaten], { type: "text/plain;charset=utf-8" });
    
    // Erstelle einen Dateinamen, der das aktuelle Datum und die Uhrzeit enthält
    const timestamp = new Date().toISOString().replace(/[-T:]/g, "");
    const filename = `RebalancingTool_${timestamp}.txt`;
    
    // Erstelle einen Link zum Download der Datei
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", URL.createObjectURL(blob));
    downloadLink.setAttribute("download", filename);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    
    // Klicke auf den Link, um den Download zu starten, und entferne ihn anschließend
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function loadDataFromBackup() {
  // Erstelle ein Input-Element für den Datei-Upload
  const fileInput = document.createElement("input");
  fileInput.setAttribute("type", "file");
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  // Wenn der Benutzer eine Datei auswählt, lese die Datei und rufe die loadFromJSON-Methode auf
  fileInput.addEventListener("change", function() {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
      const jsonDaten = event.target.result;
      try {
        // Entferne zusätzliche Escape-Zeichen, falls vorhanden
        const cleanedData = jsonDaten.replace(/\\"/g, '"');
        // Lade die Daten in die Tabelle
        loadFromJSON(cleanedData);
      } catch (e) {
        alert("Fehler beim Laden der Backup-Datei: " + e.message);
      }
    };
    reader.readAsText(file);
  });

  // Klicke auf das Input-Element, um den Datei-Upload zu starten
  fileInput.click();

  // Entferne das Input-Element von der Seite, wenn der Upload abgeschlossen ist
  fileInput.addEventListener("change", function() {
    document.body.removeChild(fileInput);
  });
}

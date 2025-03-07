// App.tsx
import React, { useState } from "react";
import { 
  Container, 
  Box, 
  Button, 
  TextField, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  TableFooter, 
  Paper, 
  Typography
} from "@mui/material";
import { calculateRebalancing, PortfolioItem, RebalanceResult } from "./rebalanceLogic";

// Helper function to format numbers with thousand delimiters (Swiss-style)
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("de-CH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const initialTestData: PortfolioItem[] = [
  { id: 1, name: "VNRT, IE00BKX55R35", currentValue: 3173.45, targetAllocation: 0.08 },
  { id: 2, name: "IEVL, IE00BQN1K901", currentValue: 3605.60, targetAllocation: 0.08 },
  { id: 3, name: "VAPX, IE00B9F5YL18", currentValue: 1587.80, targetAllocation: 0.04 },
  { id: 4, name: "CSUSS, IE00B3VWM098", currentValue: 3394.75, targetAllocation: 0.08 },
  { id: 5, name: "SMCX, IE00BKWQ0M75", currentValue: 3056.90, targetAllocation: 0.08 },
  { id: 6, name: "ISFE, IE00B2QWDR12", currentValue: 1061.48, targetAllocation: 0.04 },
  { id: 7, name: "EGUSAS, IE00B3Z3FS74", currentValue: 5511.70, targetAllocation: 0.16 },
  { id: 8, name: "BTC", currentValue: 1670.06, targetAllocation: 0.096 },
  { id: 9, name: "ETH", currentValue: 2260.09, targetAllocation: 0.064 },
  { id: 10, name: "EURE, IE00BSJCQV56", currentValue: 1177.10, targetAllocation: 0.04 },
  { id: 11, name: "CCUSAS, IE00B53H0131", currentValue: 1780.75, targetAllocation: 0.04 },
  { id: 12, name: "LYMAA, LU1287023342", currentValue: 6569.42, targetAllocation: 0.2 },
];

const App: React.FC = () => {
  // State for the portfolio items, new investment, and calculated results
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [newInvestment, setNewInvestment] = useState<number>(0);
  const [results, setResults] = useState<RebalanceResult[] | null>(null);

  // Add a new row with empty/default values
  const addNewRow = () => {
    const newItem: PortfolioItem = {
      id: portfolio.length > 0 ? Math.max(...portfolio.map((item) => item.id)) + 1 : 1,
      name: "",
      currentValue: 0,
      targetAllocation: 0,
    };
    setPortfolio([...portfolio, newItem]);
  };

  /**
   * Update a specific row’s field.
   * For targetAllocation, we expect user input as a percentage (e.g., 20 for 20%),
   * so we convert it to decimal format (i.e., 0.2) for internal storage.
   */
  const updateRow = (id: number, field: keyof PortfolioItem, value: string) => {
    setPortfolio((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (field === "name") {
            return { ...item, [field]: value };
          }
          if (field === "targetAllocation") {
            // Divide by 100 to convert percentage input to a decimal.
            return { ...item, [field]: parseFloat(value) / 100 || 0 };
          }
          // For currentValue, use a direct number conversion.
          return { ...item, [field]: parseFloat(value) || 0 };
        }
        return item;
      })
    );
  };

  // Load preset test data
  const loadTestData = () => {
    setPortfolio(initialTestData);
    setNewInvestment(24000);
    setResults(null);
  };

  // Remove all rows
  const deleteAllRows = () => {
    setPortfolio([]);
    setResults(null);
  };

  // Calculate the rebalancing results using our logic module
  const calculate = () => {
    const computedResults = calculateRebalancing(portfolio, newInvestment);
    setResults(computedResults);
  };

  // Export current data as JSON (download as file)
  const exportData = () => {
    const data = {
      newInvestment,
      portfolio,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
    link.href = url;
    link.download = `RebalancingTool_${timestamp}.json`;
    link.click();
  };

  // Import data from a JSON file
  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          setNewInvestment(imported.newInvestment);
          setPortfolio(imported.portfolio);
          setResults(null);
        } catch (error) {
          alert("Error importing data");
        }
      };
      reader.readAsText(file);
    }
  };

  // Totals for the table (only when results are computed)
  const totalCurrentValue = portfolio.reduce((sum, item) => sum + item.currentValue, 0);
  const totalProposedAction = results ? results.reduce((sum, r) => sum + r.proposedDelta, 0) : 0;
  const totalNewTotal = results 
    ? portfolio.reduce((sum, item) => {
        const r = results.find((r) => r.id === item.id);
        return sum + item.currentValue + (r ? r.proposedDelta : 0);
      }, 0)
    : totalCurrentValue;
  // Total target allocation (as percentage) for validation – should sum to 100 if inputs are correct
  const totalAllocationPercent = portfolio.reduce((sum, item) => sum + (item.targetAllocation * 100), 0);

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Rebalancer
        </Typography>


      {/* Top Form and Action Buttons using Box */}
      <Box 
        display="flex" 
        flexWrap="wrap" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={2}
      >
        {/* Left: New Investment input */}
        <Box mr={2} mb={2}>
          <TextField
            label="Geplante Neuinvestition"
            type="number"
            value={newInvestment}
            onChange={(e) => setNewInvestment(parseFloat(e.target.value) || 0)}
            fullWidth
          />
        </Box>
        {/* Right: Action Buttons */}
        <Box display="flex" flexWrap="wrap" gap={1}>
          <Button variant="contained" onClick={calculate}>
            Berechne Verteilung
          </Button>
          <Button variant="outlined" onClick={exportData}>
            Daten exportieren
          </Button>
          <Button variant="outlined" component="label">
            Daten importieren
            <input type="file" hidden onChange={importData} />
          </Button>
          <Button variant="outlined" onClick={loadTestData}>
            Beispieldaten laden
          </Button>
          <Button variant="outlined" onClick={deleteAllRows}>
            Alle Zeilen löschen
          </Button>
          <Button variant="outlined" onClick={addNewRow}>
            Zeile hinzufügen
          </Button>
        </Box>
      </Box>

      {/* Data Table */}
      <Box mt={4}>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Bezeichnung/ISIN</TableCell>
                <TableCell>Zielallokation [%]</TableCell>
                <TableCell>Aktueller Wert</TableCell>
                <TableCell>Delta (Vor/Nach)</TableCell>
                <TableCell>Proposed Action</TableCell>
                <TableCell>Neuer Gesamtwert</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolio.map((item) => {
                // Find the corresponding result (if calculated)
                const result = results?.find((r) => r.id === item.id);
                // Calculate a “before” delta percentage (for display when not calculated yet)
                const currentTotal = portfolio.reduce((sum, i) => sum + i.currentValue, 0);
                const beforePerc = currentTotal > 0 ? item.currentValue / currentTotal : 0;
                const beforeDelta = (beforePerc - item.targetAllocation) * 100;
                // Calculate new total amount: current value + proposed delta (if computed)
                const newTotal = result ? item.currentValue + result.proposedDelta : item.currentValue;
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <TextField
                        value={item.name}
                        onChange={(e) => updateRow(item.id, "name", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        inputProps={{ step: "0.1" }}
                        // Display value multiplied by 100 to show as a whole percentage.
                        value={(item.targetAllocation * 100).toString()}
                        onChange={(e) => updateRow(item.id, "targetAllocation", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        inputProps={{ step: "0.01" }}
                        value={item.currentValue}
                        onChange={(e) => updateRow(item.id, "currentValue", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      {result ? (
                        <div>
                          {result.beforeDeltaPercent.toFixed(2)}% / {result.afterDeltaPercent.toFixed(2)}%
                        </div>
                      ) : (
                        `${beforeDelta.toFixed(2)}%`
                      )}
                    </TableCell>
                    <TableCell>
                      {result ? formatNumber(result.proposedDelta) : "-"}
                    </TableCell>
                    <TableCell>
                      {formatNumber(newTotal)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                {/* Columns: 1 (ID) and 2 (Name) */}
                <TableCell colSpan={2}>Total</TableCell>
                {/* Column 3: Total Target Allocation */}
                <TableCell>{formatNumber(totalAllocationPercent)}</TableCell>
                {/* Column 4: Total Current Value */}
                <TableCell>{formatNumber(totalCurrentValue)}</TableCell>
                {/* Column 5: Delta (empty) */}
                <TableCell />
                {/* Column 6: Total Proposed Action */}
                <TableCell>{results ? formatNumber(totalProposedAction) : "-"}</TableCell>
                {/* Column 7: Total New Total */}
                <TableCell>{results ? formatNumber(totalNewTotal) : "-"}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      </Box>
    </Container>
  );
};

export default App;

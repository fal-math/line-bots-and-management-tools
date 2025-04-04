// CSVパーサー
function parseCSV(input) {
  const rows = [];
  let i = 0;
  let currentRow = [];
  let currentValue = '';
  let inQuotes = false;

  while (i < input.length) {
    const char = input[i];
    if (char === '"') {
      if (inQuotes && input[i + 1] === '"') {
        currentValue += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
      i++;
      continue;
    }
    if (char === ',' && !inQuotes) {
      currentRow.push(currentValue);
      currentValue = '';
      i++;
      continue;
    }
    if ((char === '\n' || char === '\r') && !inQuotes) {
      currentRow.push(currentValue);
      rows.push(currentRow);
      currentRow = [];
      currentValue = '';
      if (char === '\r' && input[i + 1] === '\n') {
        i += 2;
      } else {
        i++;
      }
      continue;
    }
    currentValue += char;
    i++;
  }
  if (currentValue !== '' || currentRow.length > 0) {
    currentRow.push(currentValue);
    rows.push(currentRow);
  }
  return rows;
}
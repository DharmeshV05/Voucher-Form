function selectFilter() {
  const filter = document.getElementById("filter");
  const selectedOption = filter.options[filter.selectedIndex];
  const logoUrl = selectedOption.getAttribute("data-logo");
  const selectedLogoContainer = document.getElementById("selected-logo");
  selectedLogoContainer.innerHTML = `<img src="${logoUrl}" alt="Selected Logo">`;
  console.log("Selected filter:", selectedOption.value);

  // Hide the filter section after selecting an option
  const filterSection = document.getElementById("filter-section");
  filterSection.style.display = "none";

  // Show the logo and enable option change by clicking logo
  selectedLogoContainer.onclick = function () {
    filterSection.style.display = "flex";
    selectedLogoContainer.innerHTML = "";
  };
}

function convertToTable(filename = "") {
    // Get form data
    const form = document.getElementById("voucher-form");
    let sel = document.getElementById("filter");
    const formData = new FormData(form);
    // Create table element
    const table = document.getElementById("formDataTable");
    table.classList.add("data-table"); // Optional class for styling
  
    // Generate random voucher number
    const voucherNoInput = document.getElementById("voucherNo");
    voucherNoInput.value = generateRandomVoucherNo();
  
    // Create header row
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.textContent = "filteredValue";
    headerRow.appendChild(headerCell);
    for (const entry of formData.entries()) {
      const headerCell = document.createElement("th");
      headerCell.textContent = entry[0];
      headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);
    // Create data row (single row with multiple cells)
    const dataRow = document.createElement("tr");
    const dataCell = document.createElement("td");
    dataCell.textContent = sel.value;
    dataRow.appendChild(dataCell);
    for (const entry of formData.entries()) {
      const dataCell = document.createElement("td");
      dataCell.textContent = entry[1];
      dataRow.appendChild(dataCell);
    }
    table.appendChild(dataRow);
    // Clear existing table content (if any)
    // const tableContainer = document.getElementById('table-container');
    // tableContainer.innerHTML = ''; // Clear previous table
    // Append the new table to the container
    //document.body.appendChild(table);
    var downloadLink;
    var dataType = "application/vnd.ms-excel";
    var tableHTML = table.outerHTML.replace(/ /g, "%20");
    // Specify file name
    filename = filename ? filename + ".xls" : "excel_data.xls";
    // Create download link element
    downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    if (navigator.msSaveOrOpenBlob) {
      var blob = new Blob(["\ufeff", tableHTML], {
        type: dataType
      });
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      // Create a link to the file
      downloadLink.href = "data:" + dataType + ", " + tableHTML;
      // Setting the file name
      downloadLink.download = filename;
      //triggering the function
      downloadLink.click();
    }
    table.innerHTML = "";
  }
  
  function generateRandomVoucherNo() {
    return Math.floor(Math.random() * 1000); // Generate a 4-digit random number
  }
  
  function convertAmountToWords() {
    const amountInput = document.getElementById("amount");
    const amountRsInput = document.getElementById("amountRs");
    const amount = parseFloat(amountInput.value);
    if (!isNaN(amount)) {
      const amountWords = convertNumberToWords(amount);
      amountRsInput.value = amountWords;
    } else {
      amountRsInput.value = "";
    }
  }
  function convertNumberToWords(num) {
    const ones = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine"
    ];
    const teens = [
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen"
    ];
    const tens = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety"
    ];
    const scales = ["", "thousand", "million", "billion", "trillion"];
  
    if (num === 0) return "zero";
  
    // Split the number into groups of three digits
    const chunks = [];
    while (num > 0) {
      chunks.push(num % 1000);
      num = Math.floor(num / 1000);
    }
  
    // Convert each chunk to words
    const words = chunks.map((chunk, index) => {
      if (chunk === 0) return "";
  
      const chunkWords = [];
  
      // Extract hundreds place
      const hundreds = Math.floor(chunk / 100);
      if (hundreds > 0) {
        chunkWords.push(ones[hundreds] + " hundred");
      }
  
      // Extract tens and ones places
      const remainder = chunk % 100;
      if (remainder > 0) {
        if (remainder < 10) {
          chunkWords.push(ones[remainder]);
        } else if (remainder < 20) {
          chunkWords.push(teens[remainder - 10]);
        } else {
          const tensPlace = Math.floor(remainder / 10);
          chunkWords.push(tens[tensPlace]);
          const onesPlace = remainder % 10;
          if (onesPlace > 0) {
            chunkWords.push(ones[onesPlace]);
          }
        }
      }
  
      // Add scale (thousand, million, etc.)
      if (index > 0 && chunkWords.length > 0) {
        chunkWords.push(scales[index]);
      }
  
      return chunkWords.reverse().join(" ");
    });
  
    return words.reverse().join(" ").trim();
  }
  
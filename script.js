// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("voucher-form");
  const inputs = form.querySelectorAll("input");

  // Retrieve the last generated voucher number from localStorage or set it to 1 if not available
  let voucherCounter = parseInt(localStorage.getItem("voucherCounter")) || 1;

  // Generate and display voucher number
  const voucherNoInput = document.getElementById("voucherNo");
  voucherNoInput.value = voucherCounter;

  // Increment voucher counter for the next voucher
  voucherCounter++;

  // Save the updated voucher counter to localStorage
  localStorage.setItem("voucherCounter", voucherCounter);

  // Add event listeners for input fields to handle Enter keypress
  inputs.forEach((input, index) => {
      input.addEventListener("keypress", function (event) {
          if (event.key === "Enter") {
              event.preventDefault();
              const nextIndex = index + 1;
              if (nextIndex < inputs.length) {
                  inputs[nextIndex].focus();
              } else {
                  inputs[0].focus(); // Focus on the first input field if the last one is reached
              }
          }
      });
  });
});

// Function to select filter
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

// Function to show toast message
function showToast(message) {
  // Create toast element
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = message;

  // Append toast to body
  document.body.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
      toast.remove();
  }, 3000);
}

// Function to convert form data to table and export to Excel
function convertToTable(filename = "") {
  // Get form data
  const form = document.getElementById("voucher-form");
  const formData = new FormData(form);

  // Validate form fields
  let isValid = true;
  formData.forEach((value, key) => {
      if (key !== "voucherNo" && value.trim() === "") { // Exclude voucherNo from validation
          showToast(`Please fill in the ${key} field.`);
          isValid = false;
      }
  });

  if (!isValid) {
      return; // Stop further execution if form is invalid
  }

  // Get the selected filter value
  let sel = document.getElementById("filter");

  // Create table element
  const table = document.getElementById("formDataTable");
  table.classList.add("data-table"); // Optional class for styling

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

  // Generate Excel file
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
      downloadLink.href = "data:" + dataType + ", " + tableHTML;
      downloadLink.download = filename;
      downloadLink.click();
  }
  table.innerHTML = "";
   // Reset the voucher number
   localStorage.removeItem("voucherCounter");
   // Reload the page after exporting to Excel
    window.location.reload();
}

// Function to generate voucher number
function generateVoucherNumber() {
  // Retrieve the last generated voucher number from localStorage
  let voucherCounter = parseInt(localStorage.getItem("voucherCounter")) || 1;

  // Set the voucher number in the form
  const voucherNoInput = document.getElementById("voucherNo");
  voucherNoInput.value = voucherCounter;

  // Increment voucher counter for the next voucher
  voucherCounter++;

  // Save the updated voucher counter to localStorage
  localStorage.setItem("voucherCounter", voucherCounter);
}

// Function to convert amount to words
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
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const scales = ["", "thousand", "million", "billion", "trillion"];

  if (num === 0) return "zero";
  if (num < 0) return "negative numbers are not supported";

  // Split the number into groups of three digits
  const chunks = [];
  while (num > 0) {
      chunks.push(num % 1000);
      num = Math.floor(num / 1000);
  }

  // Convert a three-digit chunk to words using recursion
  function convertChunk(n) {
      if (n === 0) return "";
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
      return ones[Math.floor(n / 100)] + " hundred" + (n % 100 !== 0 ? " " + convertChunk(n % 100) : "");
  }

  // Convert each chunk to words
  const words = chunks.map((chunk, index) => {
      if (chunk === 0) return "";
      const chunkWords = convertChunk(chunk);
      return chunkWords + (index > 0 ? " " + scales[index] : "");
  });

  // Join all the chunk words and return the result
  return words.reverse().join(" ").trim();
}

// Example Usage
console.log(convertNumberToWords(1234567)); // "one million two hundred thirty-four thousand five hundred sixty-seven"
console.log(convertNumberToWords(0));       // "zero"
console.log(convertNumberToWords(42));      // "forty-two"
console.log(convertNumberToWords(1001));    // "one thousand one"
console.log(convertNumberToWords(1000000)); // "one million"
 


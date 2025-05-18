// Base URL for fetching currency exchange rates from the public API
const BASE_URL_UsingApi = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// Run this code when the HTML content is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  
  // Select all <select> dropdowns inside the element with class "dropdown"
  const dropdowns = document.querySelectorAll(".dropdown select");

  // Select the "Get Exchange Rate" button
  const btn = document.querySelector("form button");

  // Select the "from" currency <select> element
  const fromCurrency = document.querySelector(".from select");

  // Select the "to" currency <select> element
  const toCurrency = document.querySelector(".to select");

  // Select the <p> element inside the result area to display the exchange result
  const resultText = document.querySelector(".final-msg p");

  // Loop through each dropdown (<select>) to populate the currency options
  for (let select of dropdowns) {
    // Loop through each currency code in the "countryList" object
    // (countryList is assumed to be defined in code.js)
    for (let CurrencyCode in countryList) {
      let newOption = document.createElement("option"); // Create a new <option> element
      newOption.innerText = CurrencyCode;              // Set text inside the option
      newOption.value = CurrencyCode;                  // Set its value attribute

      // Set default selections: "USD" for "from", "INR" for "to"
      if (select.name === "from" && CurrencyCode === "USD") {
        newOption.selected = true;
      } else if (select.name === "to" && CurrencyCode === "INR") {
        newOption.selected = true;
      }

      // Add the option to the current <select> dropdown
      select.appendChild(newOption);
    }

    // Add event listener to update flag when user changes currency selection
    select.addEventListener("change", (evt) => {
      updateFlags(evt.target); // Call function to update the flag
    });
  }

  // Function to update the flag image next to the selected currency
  const updateFlags = (element) => {
    let currCode = element.value;             // Get selected currency code
    let countryCode = countryList[currCode];  // Get corresponding country code
    let newSrcLink = `https://flagsapi.com/${countryCode}/flat/64.png`; // Construct image URL
    let img = element.parentElement.querySelector("img"); // Select the <img> in the same container
    img.src = newSrcLink; // Update the image source to show new flag
  };

  // When user clicks the "Get Exchange Rate" button
  btn.addEventListener("click", async (evt) => {
    evt.preventDefault(); // Prevent form from submitting or refreshing the page

    // Get the input field where user types amount
    let amount = document.querySelector("form input");

    // Get the numeric value entered by user
    let amountValue = amount.value;

    // If input is empty or less than 1, reset it to 1
    if (amountValue === "" || amountValue < 1) {
      amountValue = 1;
      amount.value = "1"; // Also update the input box visually
    }

    // Build the URL to fetch exchange rates for the "from" currency
    const URL = `${BASE_URL_UsingApi}/${fromCurrency.value.toLowerCase()}.json`;

    try {
      // Make a request to the API and wait for the response
      let response = await fetch(URL);
      let data = await response.json(); // Parse response to JSON

      // Get the exchange rate from "fromCurrency" to "toCurrency"
      let rate = data[fromCurrency.value.toLowerCase()][toCurrency.value.toLowerCase()];

      // Calculate the converted amount and round to 2 decimal places
      let convertedAmount = (rate * amountValue).toFixed(2);

      // Display the result to the user
      resultText.innerText = `${amountValue} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`;
    } catch (error) {
      // If something goes wrong, show an error message and log the error
      resultText.innerText = "Failed to fetch exchange rate.";
      console.error("Error fetching exchange rate:", error);
    }
  });

});

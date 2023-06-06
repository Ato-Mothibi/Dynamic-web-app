// scripts.js

const form = document.querySelector("[data-form]");
const result = document.querySelector("[data-result]");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entries = new FormData(form);
  const { dividend, divider } = Object.fromEntries(entries);

// //To return a whole number or number without decimals
//   const division = dividend / divider
// //   result.innerText = dividend / divider;
//   const noDecimal = Math.floor(division)
//   result.innerText = noDecimal

// Prodive a message if no numbers are insert 
if (isNaN(dividend) || isNaN(divider) || !isFinite(dividend) || !isFinite(divider)) {
    document.body.innerHTML = "Something critical went wrong. Please reload the page.";
    console.error("Critical error occurred", new Error().stack);
  } else if (dividend === '' || divider === '') {
    result.innerText = "Division not performed. Both values are required in inputs. Try again.";
  } else if (divider <= 0 ) {
    result.innerText = "Division not performed. Invalid number provided. Try again.";
    console.error("Invalid number provided", new Error().stack);
  } else {
    const division = dividend / divider;
    const noDecimal = Math.floor(division);
    result.innerText = noDecimal;
  }
});
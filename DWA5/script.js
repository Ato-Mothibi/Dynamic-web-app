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
// if (divider <= 0 ) {
//     result.innerText = "Division not performed. Invalid number provided. Try again.";
//     console.error("Invalid number provided", new Error().stack);
//   } else if (dividend === '' || divider === '') {
//     result.innerText = "Division not performed. Both values are required in inputs. Try again.";
//   } else if (isNaN(dividend) || isNaN(divider) || !isFinite(dividend) || !isFinite(divider)) {
//     document.body.innerHTML = "Something critical went wrong. Please reload the page.";
//     console.error("Critical error occurred", new Error().stack);
//   } else {
//     const division = dividend / divider;
//     const noDecimal = Math.floor(division);
//     result.innerText = noDecimal;
//   }


try {
    if (divider <= 0 ) {
       throw result.innerText = "Division not performed. Invalid number provided. Try again.";
        console.log("Invalid number provided", new Error().stack);
      } else if (dividend === '' || divider === '') {
        throw result.innerText = "Division not performed. Both values are required in inputs. Try again.";
      } else if (isNaN(dividend) || isNaN(divider) || !isFinite(dividend) || !isFinite(divider)) {
        throw document.body.innerHTML = "Something critical went wrong. Please reload the page.";
        console.log("Critical error occurred", new Error().stack);
      } else {
        const division = dividend / divider;
        const noDecimal = Math.floor(division);
        result.innerText = noDecimal;
      }
} catch (error) {
    console.error(new Error(error))
}


// Responsible for checking if it's a num 
//   try{
//     if (isNaN(dividend) || isNaN(divider)) throw document.body.innerHTML = "Something critical went wrong. Please reload the page.";
//   }
// //Error message for when what's entered is not a number  
//   catch(error){
//     console.error("Critical error occurred", new Error().stack)
//   }
//    try{
// // Responsible to check if the inputs are empty or not 
//     if (dividend === '' || divider === '') throw result.innerText = "Division not performed. Both values are required in inputs. Try again.";
// //Responsible for checking if the divider is negative
//     if (divider < 0 ) throw result.innerText = "Division not performed. Invalid number provided. Try again.";
//     }
// //Error message for when the number is negative or not finite/whole
//   catch(error){
//     console.error("Invalid number provided", new Error().stack);
//   }
//   finally {
//     const division = dividend / divider;
//     const noDecimal = Math.floor(division);
//     result.innerText = noDecimal;
//   }

})

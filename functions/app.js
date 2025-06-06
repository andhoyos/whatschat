function getIp(callback) {
  fetch("https://ipinfo.io/json?token=749ad893305312", {
    headers: { Accept: "application/json" },
  })
    .then((resp) => resp.json())
    .catch(() => {
      return {
        country: "us",
      };
    })
    .then((resp) => callback(resp.country));
}
// Handle international prefixes, format phone input field
// Uses intl-tel-input plugin
const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
  preferredCountries: ["us", "co", "in", "de"],
  initialCountry: "auto",
  geoIpLookup: getIp,
  separateDialCode: true,
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

function process(event) {
  event.preventDefault();

  const phoneNumber = phoneInput.getNumber();
  let phoneNumberLink = phoneNumber.replace('+','');

  if (phoneInput.isValidNumber()) {
    Swal.fire({
      position: "top-center",
      icon: "success",
      text: `let's chat with : ${phoneNumber}`,
      showConfirmButton: false,
      timer: 1500,
    });

    setTimeout(() => {
      window.location.href = `https://api.whatsapp.com/send/?phone=${phoneNumberLink}&text&type=phone_number&app_absent=1`;
    }, 1500);
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Invalid phone number.!",
    });
  }
  // OPTION 1 - Twilio Lookup API
  // Pros: Free API call, updated data
  // Pros: The Lookup API can return line type and carrier info too: https://www.twilio.com/docs/lookup/api
  // Cons: Network request
  //   const data = new URLSearchParams();
  //   data.append("phone", phoneNumber);

  //   fetch("./lookup", {
  //     method: "POST",
  //     body: data,
  //   })
  //     .then((response) => response.json())
  //     .then((json) => {
  //       if (json.success) {
  //         info.style.display = "";
  //         info.innerHTML = `Phone number in E.164 format: <strong>${phoneNumber}</strong>`;
  //       } else {
  //         console.error(json.error);
  //         error.style.display = "";
  //         error.innerHTML = json.error;
  //       }
  //     })
  //     .catch((err) => {
  //       error.style.display = "";
  //       error.innerHTML = `Something went wrong: ${err}`;
  //     });

  // OPTION 2 - intl-tel-input validity check
  // Pros: No additional API call
  // Cons: Requires plugin updates for updates on phone number validity
  // if (phoneInput.isValidNumber()) {
  //   info.style.display = "";
  //   info.innerHTML = `Phone number in E.164 format: <strong>${phoneNumber}</strong>`
  // } else {
  //   error.style.display = "";
  //   error.innerHTML = `Invalid phone number.`
  // }
}

// const form = document.getElementById("lookup");
// form.addEventListener("submit", process);

//drop down menu/
const btn = document.querySelector(".menu-toggle");
const menu = document.querySelector("#navMenu");

btn.addEventListener("click", () => {
  menu.classList.toggle("open");
});

//Shows red error if form isn't filled in right
//const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    let isValid = true;

    clearError(name);
    clearError(email);
    clearError(message);

    if (name.value.trim() === "") {
      showError(name, "Fyll i ditt namn.");
      isValid = false;
    }

    if (email.value.trim() === "") {
      showError(email, "Fyll i din e-post.");
      isValid = false;
    } else if (!email.value.includes("@")) {
      showError(email, "Ange en giltig e-postadress.");
      isValid = false;
    }

    if (message.value.trim() === "") {
      showError(message, "Skriv ett meddelande.");
      isValid = false;
    } else if (message.value.trim().length < 10) {
      showError(message, "Meddelandet måste vara minst 10 tecken.");
      isValid = false;
    }

    if (!isValid) {
      event.preventDefault();
    }
  });

  function showError(input, message) {
    input.classList.add("error");
    input.nextElementSibling.textContent = message;
  }

  function clearError(input) {
    input.classList.remove("error");
    input.nextElementSibling.textContent = "";
  }
} 
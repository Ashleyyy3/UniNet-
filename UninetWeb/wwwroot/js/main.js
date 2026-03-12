// Dropdown menu
const btn = document.querySelector(".menu-toggle");
const menu = document.querySelector("#navMenu");
const overlay = document.querySelector("#menuOverlay");

if (btn && menu) {
  btn.addEventListener("click", () => {
    menu.classList.toggle("open");

    if (overlay) {
      overlay.classList.toggle("show");
    }
  });

  if (overlay) {
    overlay.addEventListener("click", () => {
      menu.classList.remove("open");
      overlay.classList.remove("show");
    });
  }
}

// Contact form validation
const contactForm = document.getElementById("contactForm");

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

    if (input.nextElementSibling) {
      input.nextElementSibling.textContent = message;
    }
  }

  function clearError(input) {
    input.classList.remove("error");

    if (input.nextElementSibling) {
      input.nextElementSibling.textContent = "";
    }
  }
}

// Planner checklist
document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");

  if (!taskInput || !addTaskBtn || !taskList) return;

  const demoTasks = [
    { text: "Läsa kapitel 3 i kursboken", done: false },
    { text: "Lämna in webbdesignuppgiften", done: false },
    { text: "Tenta - Webbdesign", done: true },
    { text: "Studiefika med vänner", done: false }
  ];

  let tasks = JSON.parse(localStorage.getItem("tasks")) || demoTasks;

  renderTasks();

  addTaskBtn.addEventListener("click", addTask);

  taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

  function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") return;

    tasks.push({
      text: taskText,
      done: false
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
  }

  function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;

      const span = document.createElement("span");
      span.textContent = task.text;

      if (task.done) {
        span.style.textDecoration = "line-through";
        span.style.opacity = "0.7";
      }

      checkbox.addEventListener("change", () => {
        tasks[index].done = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Ta bort";

      deleteBtn.addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);

      taskList.appendChild(li);
    });
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
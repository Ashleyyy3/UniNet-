// Active navigation link
const currentPage = window.location.pathname.split("/").pop() || "index.html";

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
  const linkPage = link.getAttribute("href");

  if (linkPage === currentPage) {
    link.classList.add("active");
  }
});

function launchConfetti() {
  if (typeof confetti !== "function") return;

  confetti({
    particleCount: 80,
    angle: 60,
    spread: 60,
    origin: { x: 0 }
  });

  confetti({
    particleCount: 80,
    angle: 120,
    spread: 60,
    origin: { x: 1 }
  });
}

function showSuccessMessage() {
  const oldMessage = document.querySelector(".success-message");
  if (oldMessage) {
    oldMessage.remove();
  }

  const msg = document.createElement("div");
  msg.classList.add("success-message");
  msg.textContent = "🎉 Bra jobbat!";

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 1800);
}

// Dropdown menu
const btn = document.querySelector(".menu-toggle");
const menu = document.querySelector("#navMenu");
const overlay = document.querySelector("#menuOverlay");

if (btn && menu) {
  btn.addEventListener("click", () => {
    menu.classList.toggle("open");

    const isOpen = menu.classList.contains("open");
    btn.setAttribute("aria-expanded", isOpen);

    if (overlay) {
      overlay.classList.toggle("show");
    }
  });

  if (overlay) {
    overlay.addEventListener("click", () => {
      menu.classList.remove("open");
      overlay.classList.remove("show");
      btn.setAttribute("aria-expanded", "false");
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menu.classList.remove("open");

      if (overlay) {
        overlay.classList.remove("show");
      }

      btn.setAttribute("aria-expanded", "false");
    }
  });
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

document.addEventListener("DOMContentLoaded", () => {
  // ===== CHECKLIST =====
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");

  if (taskInput && addTaskBtn && taskList) {
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
        checkbox.setAttribute("aria-label", `Markera uppgift: ${task.text}`);

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.done) {
          span.style.textDecoration = "line-through";
          span.style.opacity = "0.7";
        }

        checkbox.addEventListener("change", () => {
          tasks[index].done = checkbox.checked;

          if (checkbox.checked) {
            launchConfetti();
            showSuccessMessage();
          }

          saveTasks();
          renderTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Ta bort";
        deleteBtn.setAttribute("aria-label", `Ta bort uppgift: ${task.text}`);

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
  }

  // ===== CALENDAR + EVENTS =====
  const monthYear = document.getElementById("calendarMonthYear");
  const calendarDates = document.getElementById("calendarDates");
  const prevMonthBtn = document.getElementById("prevMonthBtn");
  const nextMonthBtn = document.getElementById("nextMonthBtn");

  const selectedDateText = document.getElementById("selectedDateText");
  const eventInput = document.getElementById("eventInput");
  const addEventBtn = document.getElementById("addEventBtn");
  const eventList = document.getElementById("eventList");

  if (
    monthYear &&
    calendarDates &&
    prevMonthBtn &&
    nextMonthBtn &&
    selectedDateText &&
    eventInput &&
    addEventBtn &&
    eventList
  ) {
    const monthNames = [
      "Januari", "Februari", "Mars", "April", "Maj", "Juni",
      "Juli", "Augusti", "September", "Oktober", "November", "December"
    ];

    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let selectedDate = null;

    const demoEvents = [
      { date: "2026-03-20", text: "Inlämning Webbdesign" },
      { date: "2026-03-25", text: "Tenta Webbdesign" },
      { date: "2026-04-02", text: "Tenta OOSU 2" }
    ];

    let events = JSON.parse(localStorage.getItem("calendarEvents")) || demoEvents;

    renderCalendar(currentMonth, currentYear);
    renderEvents();

    prevMonthBtn.addEventListener("click", () => {
      currentMonth--;

      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }

      renderCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener("click", () => {
      currentMonth++;

      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }

      renderCalendar(currentMonth, currentYear);
    });

    addEventBtn.addEventListener("click", addEvent);

    eventInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        addEvent();
      }
    });

    function formatDate(year, month, day) {
      const m = String(month + 1).padStart(2, "0");
      const d = String(day).padStart(2, "0");
      return `${year}-${m}-${d}`;
    }

    function formatDateForDisplay(dateString) {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    }

    function renderCalendar(month, year) {
      calendarDates.innerHTML = "";
      monthYear.textContent = `${monthNames[month]} ${year}`;

      const firstDay = new Date(year, month, 1);
      const lastDate = new Date(year, month + 1, 0).getDate();

      let startDay = firstDay.getDay();
      startDay = startDay === 0 ? 6 : startDay - 1;

      for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("empty");
        calendarDates.appendChild(emptyCell);
      }

      for (let day = 1; day <= lastDate; day++) {
        const dateCell = document.createElement("div");
        const dateString = formatDate(year, month, day);

        dateCell.textContent = day;

        if (
          day === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear()
        ) {
          dateCell.classList.add("today");
        }

        if (selectedDate === dateString) {
          dateCell.classList.add("selected-date");
        }

        const hasEvent = events.some(event => event.date === dateString);
        if (hasEvent) {
          dateCell.classList.add("has-event");
        }

        dateCell.addEventListener("click", () => {
          selectedDate = dateString;
          selectedDateText.textContent = `Valt datum: ${formatDateForDisplay(selectedDate)}`;
          renderCalendar(currentMonth, currentYear);
        });

        calendarDates.appendChild(dateCell);
      }
    }

    function addEvent() {
      const eventText = eventInput.value.trim();

      if (!selectedDate || eventText === "") return;

      events.push({
        date: selectedDate,
        text: eventText
      });

      eventInput.value = "";
      saveEvents();
      renderEvents();
      renderCalendar(currentMonth, currentYear);
    }

    function renderEvents() {
      eventList.innerHTML = "";

      const todayString = formatDate(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const upcomingEvents = [...events]
        .filter(event => event.date >= todayString)
        .sort((a, b) => a.date.localeCompare(b.date));

      if (upcomingEvents.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = "Inga kommande händelser ännu.";
        eventList.appendChild(emptyItem);
        return;
      }

      upcomingEvents.forEach((event) => {
        const li = document.createElement("li");

        const info = document.createElement("div");
        info.classList.add("event-info");

        const date = document.createElement("span");
        date.classList.add("event-date");
        date.textContent = formatDateForDisplay(event.date);

        const text = document.createElement("span");
        text.classList.add("event-text");
        text.textContent = event.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-event-btn");
        deleteBtn.textContent = "Ta bort";
        deleteBtn.setAttribute("aria-label", `Ta bort händelse: ${event.text}`);

        deleteBtn.addEventListener("click", () => {
          const originalIndex = events.findIndex(
            item => item.date === event.date && item.text === event.text
          );

          if (originalIndex !== -1) {
            events.splice(originalIndex, 1);
            saveEvents();
            renderEvents();
            renderCalendar(currentMonth, currentYear);
          }
        });

        info.appendChild(date);
        info.appendChild(text);

        li.appendChild(info);
        li.appendChild(deleteBtn);

        eventList.appendChild(li);
      });
    }

    function saveEvents() {
      localStorage.setItem("calendarEvents", JSON.stringify(events));
    }
  }
});
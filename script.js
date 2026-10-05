const applyTheme = (theme) => {
  const isDark = theme === "dark";
  document.body.classList.toggle("theme-dark", isDark);

  const themeToggle = document.querySelector(".theme-toggle");

  if (themeToggle) {
    const icon = themeToggle.querySelector(".theme-toggle-icon");
    const label = themeToggle.querySelector(".theme-toggle-label");

    if (icon) {
      icon.textContent = isDark ? "☀️" : "🌙";
    }

    if (label) {
      label.textContent = isDark ? "Light mode" : "Dark mode";
    }

    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  try {
    localStorage.setItem("ithaca-theme", theme);
  } catch {
    // The theme still works when browser storage is unavailable.
  }
};

let savedTheme;
try {
  savedTheme = localStorage.getItem("ithaca-theme");
} catch {
  // Use the system preference when browser storage is unavailable.
}
const preferredTheme = (["light", "dark"].includes(savedTheme) && savedTheme) ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

applyTheme(preferredTheme);

const themeToggle = document.querySelector(".theme-toggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

const bookingForm = document.querySelector("#booking-form");

if (bookingForm) {
  const voyageInput = document.querySelector("#voyage");
  const voyageChoices = new Map([
    ["cyclops", "The Cyclops Coast"],
    ["sea", "The Open Sea"],
    ["ithaca", "Homeward to Ithaca"]
  ]);
  const requestedVoyage = new URLSearchParams(window.location.search).get("voyage");
  if (voyageChoices.has(requestedVoyage)) {
    voyageInput.value = voyageChoices.get(requestedVoyage);
  }

  const travelerInput = document.querySelector("#traveler");
  const result = document.querySelector("#booking-result");
  const summary = document.querySelector("#booking-summary");

  travelerInput.addEventListener("input", () => {
    travelerInput.setCustomValidity("");
  });

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const traveler = travelerInput.value.trim();

    if (!traveler) {
      travelerInput.setCustomValidity("Please enter a traveler name.");
      travelerInput.reportValidity();
      return;
    }

    const voyage = document.querySelector("#voyage").value;
    const travelers = Number(
      document.querySelector("#travelers").value
    );

    const advice = {
      "The Cyclops Coast":
        "Pack your own food and stay outside occupied caves.",
      "The Open Sea":
        "Bring your courage and leave the boasting ashore.",
      "Homeward to Ithaca":
        "Keep your eyes on home and look after your fellow travelers."
    };

    const travelerWord = travelers === 1 ? "traveler" : "travelers";

    result.textContent =
      `Welcome aboard, ${traveler}! Your fictional request for ` +
      `${travelers} ${travelerWord} on "${voyage}" is ready. ` +
      advice[voyage] +
      " This is a demonstration; no reservation has been made.";

    if (summary) {
      const summaryList = summary.querySelector("ul");
      summaryList.replaceChildren();

      for (const [label, value] of [
        ["Traveler", traveler],
        ["Voyage", voyage],
        ["Passengers", travelers],
        ["Tip", advice[voyage]]
      ]) {
        const item = document.createElement("li");
        const heading = document.createElement("strong");
        heading.textContent = `${label}:`;
        item.append(heading, ` ${value}`);
        summaryList.append(item);
      }
      summary.hidden = false;
    }

    result.hidden = false;
    const voyageLetter = document.querySelector("#captain-letter");

    if (voyageLetter && !voyageLetter.open) {
      const seal = document.querySelector("#break-seal");
      const message = document.querySelector("#captain-message");
      message.hidden = true;
      seal.setAttribute("aria-expanded", "false");
      voyageLetter.showModal();
      seal.focus();
    }
  });
}
// CHARACTER MATCH
const characterForm = document.querySelector("#character-form");

if (characterForm) {
  const photoInput = document.querySelector("#portrait");
  const preview = document.querySelector("#portrait-preview");
  const photoMessage = document.querySelector("#photo-message");
  const characterResult = document.querySelector("#character-result");

  let portraitUrl = null;

  function clearPortrait() {
    preview.hidden = true;
    preview.removeAttribute("src");

    if (portraitUrl) {
      URL.revokeObjectURL(portraitUrl);
      portraitUrl = null;
    }
  }

  photoInput.addEventListener("change", () => {
    clearPortrait();
    characterResult.hidden = true;
    characterResult.replaceChildren();
    photoMessage.textContent = "";

    const file = photoInput.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (
      !allowedTypes.includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      photoMessage.textContent =
        "Choose a JPG, PNG, or WebP image no larger than 5 MB.";
      photoInput.value = "";
      return;
    }

    portraitUrl = URL.createObjectURL(file);
    preview.src = portraitUrl;
    preview.hidden = false;
  });

  preview.addEventListener("error", () => {
    clearPortrait();
    photoInput.value = "";
    photoMessage.textContent =
      "This image could not be opened. Please choose another.";
  });

  const characters = {
    odysseus: {
      name: "Odysseus",
      description:
        "You’re the clever planner of the crew. You can find a way " +
        "out of trouble—just resist giving your victory speech " +
        "while someone is still throwing rocks."
    },
    penelope: {
      name: "Penelope",
      description:
        "You value loyalty, patience, and careful decisions. " +
        "You think ahead and don’t let other people rush you. " +
        "Your strongest tool is a steady mind."
    },
    polyphemus: {
      name: "Polyphemus",
      description:
        "You enjoy your own space and take boundaries seriously. " +
        "Your ideal weekend involves peace, quiet, and sheep. " +
        "Consider a polite welcome sign instead of a giant boulder."
    }
  };

  characterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const answers = new FormData(characterForm);
    const scores = {
      odysseus: 0,
      penelope: 0,
      polyphemus: 0
    };

    for (const question of ["strategy", "priority", "weakness"]) {
      scores[answers.get(question)]++;
    }

    const highestScore = Math.max(...Object.values(scores));
    const tiedCharacters = Object.keys(scores).filter(
      (character) => scores[character] === highestScore
    );

    // If all three answers differ, the first answer breaks the tie.
    const winner = tiedCharacters.length === 1
      ? tiedCharacters[0]
      : answers.get("strategy");

    const match = characters[winner];

    characterResult.replaceChildren();

    if (portraitUrl) {
      const portrait = document.createElement("img");
      portrait.src = portraitUrl;
      portrait.alt = "Your portrait on your character card";
      portrait.className = "match-portrait";
      characterResult.append(portrait);
    }

    const heading = document.createElement("h3");
    heading.textContent = match.name;

    const description = document.createElement("p");
    description.textContent = match.description;

    const note = document.createElement("p");
    note.className = "small-note";
    note.textContent =
      tiedCharacters.length > 1
        ? "A mixed match! Your first answer broke the tie. " +
          "This is a playful personality activity."
        : "Matched using your answers. This is a playful " +
          "personality activity, not a photo analysis.";

    characterResult.append(heading, description, note);
    characterResult.hidden = false;
  });

  characterForm.addEventListener("reset", () => {
    clearPortrait();
    photoMessage.textContent = "";
    characterResult.replaceChildren();
    characterResult.hidden = true;
  });
}

// FUNNY SURVIVAL QUIZ
const survivalForm = document.querySelector("#survival-form");

if (survivalForm) {
  const survivalResult = document.querySelector("#survival-result");

  survivalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const answers = new FormData(survivalForm);
    let score = 0;

    for (let question = 1; question <= 5; question++) {
      score += Number(answers.get(`q${question}`));
    }

    let message;

    if (score === 5) {
      message =
        "Ready for Ithaca! You’ve earned a seat aboard. " +
        "Please teach the captain your no-boasting policy.";
    } else if (score >= 3) {
      message =
        "Promising crew member! Keep practicing—and stay " +
        "close to the person with the escape plan.";
    } else {
      message =
        "Poseidon has added you to his watchlist. " +
        "Perhaps start with a quiet harbor tour.";
    }

    survivalResult.replaceChildren();

    const resultText = document.createElement("p");
    resultText.textContent = `Your score: ${score}/5. ${message}`;

    const lesson = document.createElement("p");
    lesson.textContent =
      "Crew advice: respect others’ homes, plan carefully, " +
      "remember Nobody, escape beneath the sheep, and keep " +
      "rowing once you’re safe.";

    survivalResult.append(resultText, lesson);
    survivalResult.hidden = false;
  });

  survivalForm.addEventListener("reset", () => {
    survivalResult.replaceChildren();
    survivalResult.hidden = true;
  });
}
// Open or close the activities.
document.querySelectorAll("[data-panel]").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = document.getElementById(button.dataset.panel);
    if (!panel) return;

    const shouldOpen = panel.hidden;

    // Close both panels before opening the selected one.
    document.querySelectorAll("[data-panel]").forEach((otherButton) => {
      const otherPanel = document.getElementById(
        otherButton.dataset.panel
      );

      if (otherPanel) otherPanel.hidden = true;
      otherButton.setAttribute("aria-expanded", "false");
    });

    if (shouldOpen) {
      panel.hidden = false;
      button.setAttribute("aria-expanded", "true");
      panel.scrollIntoView({ block: "start" });
    }
  });
});

const sealButton = document.querySelector("#break-seal");
const captainMessage = document.querySelector("#captain-message");

if (sealButton && captainMessage) {
  sealButton.addEventListener("click", () => {
    captainMessage.hidden = false;
    sealButton.setAttribute("aria-expanded", "true");
    captainMessage.focus();
  });
}

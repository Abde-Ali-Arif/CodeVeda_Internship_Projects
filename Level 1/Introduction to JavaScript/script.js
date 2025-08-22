// Entry point
document.addEventListener("DOMContentLoaded", () => {
  initializeDropdown();
  initializeModal();
  initializeFormValidation();
});

// Dropdown logic
function initializeDropdown() {
  const toggleButton = document.getElementById("dropdownToggle");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const dropdownLabel = document.getElementById("dropdownLabel");

  if (!toggleButton || !dropdownMenu || !dropdownLabel) {
    return;
  }

  function closeDropdown() {
    dropdownMenu.classList.add("hidden");
    toggleButton.setAttribute("aria-expanded", "false");
  }

  function openDropdown() {
    dropdownMenu.classList.remove("hidden");
    toggleButton.setAttribute("aria-expanded", "true");
  }

  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const isHidden = dropdownMenu.classList.contains("hidden");
    if (isHidden) {
      openDropdown();
    } else {
      closeDropdown();
    }
  });

  document.addEventListener("click", (event) => {
    if (!dropdownMenu.classList.contains("hidden")) {
      closeDropdown();
    }
  });

  dropdownMenu.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.classList.contains("dropdown-item")) {
      const selectedValue = target.getAttribute("data-value") || target.textContent || "";
      dropdownLabel.textContent = selectedValue;
      closeDropdown();
    }
  });
}

// Modal logic
function initializeModal() {
  const openModalButton = document.getElementById("openModal");
  const modalOverlay = document.getElementById("modalOverlay");
  const closeModalButton = document.getElementById("closeModal");
  const cancelModalButton = document.getElementById("cancelModal");
  const confirmModalButton = document.getElementById("confirmModal");

  if (!openModalButton || !modalOverlay || !closeModalButton || !cancelModalButton || !confirmModalButton) {
    return;
  }

  function openModal() {
    modalOverlay.classList.remove("hidden");
    modalOverlay.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modalOverlay.classList.add("hidden");
    modalOverlay.setAttribute("aria-hidden", "true");
  }

  openModalButton.addEventListener("click", () => openModal());
  closeModalButton.addEventListener("click", () => closeModal());
  cancelModalButton.addEventListener("click", () => closeModal());
  confirmModalButton.addEventListener("click", () => {
    // Example confirm action: show a temporary message
    alert("Confirmed!");
    closeModal();
  });

  // Close when clicking outside the dialog
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modalOverlay.classList.contains("hidden")) {
      closeModal();
    }
  });
}

// Form validation
function initializeFormValidation() {
  const form = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const messageInput = document.getElementById("message");
  const termsInput = document.getElementById("terms");
  const successMessage = document.getElementById("formSuccess");

  if (!form || !nameInput || !emailInput || !passwordInput || !messageInput || !termsInput || !successMessage) {
    return;
  }

  function setFieldError(inputElement, message) {
    const field = inputElement.closest(".form-field");
    if (!field) return;
    field.classList.add("has-error");
    const errorElementId = `error-${inputElement.id}`;
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function clearFieldError(inputElement) {
    const field = inputElement.closest(".form-field");
    if (!field) return;
    field.classList.remove("has-error");
    const errorElementId = `error-${inputElement.id}`;
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  function isValidName(value) {
    return /^[A-Za-z][A-Za-z\s]{1,}$/.test(value.trim());
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function isValidPassword(value) {
    return value.length >= 6;
  }

  function isValidMessage(value) {
    return value.trim().length >= 10;
  }

  function validateAllFields() {
    let isValid = true;

    clearFieldError(nameInput);
    clearFieldError(emailInput);
    clearFieldError(passwordInput);
    clearFieldError(messageInput);
    document.getElementById("error-terms").textContent = "";

    if (!isValidName(nameInput.value)) {
      setFieldError(nameInput, "Please enter your full name (2+ characters).");
      isValid = false;
    }

    if (!isValidEmail(emailInput.value)) {
      setFieldError(emailInput, "Please enter a valid email address.");
      isValid = false;
    }

    if (!isValidPassword(passwordInput.value)) {
      setFieldError(passwordInput, "Password must be at least 6 characters.");
      isValid = false;
    }

    if (!isValidMessage(messageInput.value)) {
      setFieldError(messageInput, "Message should be at least 10 characters.");
      isValid = false;
    }

    if (!termsInput.checked) {
      const termsError = document.getElementById("error-terms");
      if (termsError) termsError.textContent = "Please accept the terms to continue.";
      isValid = false;
    }

    return isValid;
  }

  function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.remove("hidden");
  }

  function hideSuccess() {
    successMessage.textContent = "";
    successMessage.classList.add("hidden");
  }

  // Live validation handlers
  nameInput.addEventListener("input", () => {
    if (isValidName(nameInput.value)) {
      clearFieldError(nameInput);
    }
  });

  emailInput.addEventListener("input", () => {
    if (isValidEmail(emailInput.value)) {
      clearFieldError(emailInput);
    }
  });

  passwordInput.addEventListener("input", () => {
    if (isValidPassword(passwordInput.value)) {
      clearFieldError(passwordInput);
    }
  });

  messageInput.addEventListener("input", () => {
    if (isValidMessage(messageInput.value)) {
      clearFieldError(messageInput);
    }
  });

  termsInput.addEventListener("change", () => {
    const termsError = document.getElementById("error-terms");
    if (termsError) termsError.textContent = "";
  });

  form.addEventListener("reset", () => {
    [nameInput, emailInput, passwordInput, messageInput].forEach(clearFieldError);
    const termsError = document.getElementById("error-terms");
    if (termsError) termsError.textContent = "";
    hideSuccess();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    hideSuccess();
    const valid = validateAllFields();
    if (!valid) {
      return;
    }

    // Simulate successful submission
    showSuccess("Thanks! Your message has been sent.");
    form.reset();
  });
}



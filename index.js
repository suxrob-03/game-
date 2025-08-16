let box = document.getElementById("popup");
window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.style.overflow = "hidden";
    box.style.display = 'block'
  }, 400);
});

// close

const closePopup = document.querySelector(".popup-close");

closePopup.addEventListener("click", () => {
    box.style.display = 'none'
    document.body.style.overflow = "auto";

  });

// typing

const roles = ["Hello, Guest", "Welcome to ", "Game website."];

const typingElement = document.getElementById("typing");
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 150;
let deletingSpeed = 75;
let pauseBetweenRoles = 1500;

function type() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    typingElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(type, pauseBetweenRoles);
      return;
    }
  } else {
    typingElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
}
document.addEventListener("DOMContentLoaded", () => {
  if (typingElement) {
    type();
  }
});




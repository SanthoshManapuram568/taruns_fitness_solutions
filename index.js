document.addEventListener("DOMContentLoaded", function () {
  // Get modal and close buttons
  var modal = document.getElementById("offerModal");
  var closeButtons = document.querySelectorAll(".close-button");
  var navHamburger = document.querySelector(".nav-hamburger"); // Define properly
  var navMenu = document.querySelector(".header-nav ul");

  // Ensure modal and buttons exist before adding event listeners
  if (modal) {
    closeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        modal.style.display = "none";
      });
    });
  }

  // Mouse move effect for hero section
  var hero = document.getElementById("section-hero");

  if (hero) {
    hero.addEventListener("mousemove", (e) => {
      const div = document.createElement("div");
      div.classList.add("hero-section-mouseClick");
      div.style.left = e.pageX + "px";
      div.style.top = e.pageY + "px";
      hero.appendChild(div);
      setTimeout(() => {
        hero.removeChild(div);
      }, 200);
    });
  }

  // Toggle menu on mobile
  if (navHamburger && navMenu) {
    navHamburger.addEventListener("click", function () {
      navMenu.classList.toggle("nav-open");
    });
  }

  // Initialize AOS animations
  AOS.init({
    offset: 120,
    delay: 50,
    duration: 400,
    once: true,
  });
});


document.addEventListener("DOMContentLoaded", async function () {
  /*** 1️⃣ INITIALIZATION ***/
  emailjs.init("5qdUdXA3EzfbBzOLd");

  const SUPABASE_URL = "https://yjpjumvaadajilxkdrwb.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqcGp1bXZhYWRhamlseGtkcndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4ODU1NzAsImV4cCI6MjA1MDQ2MTU3MH0.ZloxuS3lY_hEfI6teaEvdZ8R3eC95tk-7loyMVLNo4o";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  /*** 2️⃣ ELEMENT REFERENCES ***/
  const modal = document.getElementById("offerModal");
  const membershipModal = document.getElementById("membershipModal");
  const membershipForm = document.getElementById("membershipForm");
  const getStartedLinks = document.querySelectorAll(".get-started-link");
  const closeButtons = document.querySelectorAll(".close-button");
  const navHamburger = document.querySelector(".nav-hamburger");
  const navMenu = document.querySelector(".header-nav ul");
  const contactForm = document.getElementById("contactForm");
  const reviewForm = document.getElementById("reviewForm");
  const submitReviewBtn = document.getElementById("submitReviewBtn");
  const reviewList = document.getElementById("reviewList");
  const reviewSuccessMsg = document.getElementById("reviewSuccessMsg");

  /*** 3️⃣ OFFER MODAL (SHOW ON PAGE LOAD) ***/
  modal.style.display = sessionStorage.getItem("modalClosed") === "true" ? "none" : "block";
  closeButtons.forEach((button) => button.addEventListener("click", () => {
    modal.style.display = "none";
    sessionStorage.setItem("modalClosed", "true");
  }));

  /*** 4️⃣ NAVBAR TOGGLE (MOBILE) ***/
  if (navHamburger && navMenu) {
    navHamburger.addEventListener("click", () => navMenu.classList.toggle("nav-open"));
  }

  /*** 5️⃣ MEMBERSHIP MODAL ***/
  function openModal(duration) {
    membershipModal.style.display = "flex";
    document.getElementById("threeMonths").checked = duration === "3Months";
    document.getElementById("sixMonths").checked = duration === "6Months";
    document.getElementById("oneYear").checked = duration === "OneYear";
  }

  getStartedLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(link.getAttribute("data-membership"));
    });
  });

  function closeModal() {
    membershipModal.style.display = "none";
  }
  closeButtons.forEach((button) => button.addEventListener("click", closeModal));

  /*** 6️⃣ MEMBERSHIP FORM SUBMISSION ***/
  membershipForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const emailData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      contact: document.getElementById("contacts").value,
      membership: document.querySelector("input[name='membership']:checked").value,
    };

    emailjs.send("service_sf3lbfo", "template_myz3pzi", emailData)
      .then(() => showSuccessMessage(membershipForm, "We have received your request and will reach out shortly."))
      .catch((error) => console.error("Error sending email:", error));
  });

  /*** 7️⃣ CONTACT FORM ***/
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        number: document.getElementById("number").value,
        message: document.getElementById("message").value,
      };

      emailjs.send("service_sf3lbfo", "template_myz3pzi", emailData)
        .then(() => {
          alert("Your message has been sent successfully!");
          contactForm.reset();
        })
        .catch((error) => console.error("Error sending email:", error));
    });
  }

  /*** 8️⃣ REVIEWS SYSTEM ***/
  let allReviews = [];
  let currentIndex = 0;

  async function fetchReviewsOnce() {
    try {
      const cachedReviews = sessionStorage.getItem("reviews");
      if (cachedReviews) {
        allReviews = JSON.parse(cachedReviews);
      } else {
        let { data: reviews, error } = await supabase.from("tfsreview").select("*");
        if (error) throw error;
        sessionStorage.setItem("reviews", JSON.stringify(reviews));
        allReviews = reviews;
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }

  function displayNextReviews() {
    if (!allReviews.length) return;
    
    reviewList.innerHTML = "";
    const currentReviews = allReviews.slice(currentIndex, currentIndex + 3);

    currentReviews.forEach(({ name, photo_url, review }) => {
      displayNewReview(name, photo_url, review);
    });

    currentIndex = (currentIndex + 3) % allReviews.length;
    setTimeout(displayNextReviews, 8000);
  }

  async function startReviewRotation() {
    await fetchReviewsOnce();
    displayNextReviews();
  }

  submitReviewBtn.addEventListener("click", () => reviewForm.style.display = "block");

  reviewForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("reviewName").value;
    const photo = document.getElementById("reviewPhoto").files[0];
    const reviewText = document.getElementById("reviewText").value;

    if (!name || !photo || !reviewText) return alert("All fields are required!");

    try {
      const fileName = `${Date.now()}-${photo.name}`;
      const { error: uploadError } = await supabase.storage.from("tfsphotos").upload(`public/${fileName}`, photo);
      if (uploadError) throw uploadError;

      const photoURL = `${SUPABASE_URL}/storage/v1/object/public/tfsphotos/public/${fileName}`;
      const { error: reviewError } = await supabase.from("tfsreview").insert([{ name, photo_url: photoURL, review: reviewText }]);
      if (reviewError) throw reviewError;

      sessionStorage.removeItem("reviews");
      await fetchReviewsOnce(); // Fetch latest reviews from DB only on new submission
      displayNextReviews();

      reviewSuccessMsg.style.display = "block";
      setTimeout(() => {
        reviewSuccessMsg.style.display = "none";
        reviewForm.reset();
        reviewForm.style.display = "none";
      }, 1000);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Something went wrong. Try again.");
    }
  });

  document.getElementById("reviewPhoto").addEventListener("change", function () {
    document.getElementById("fileLabel").textContent = this.files[0]?.name || "Choose a Photo";
  });

  function displayNewReview(name, photoURL, reviewText) {
    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("review-info");
    reviewDiv.innerHTML = `
    <div class="review-image" data-aos="image-rotateIn"><img src="${photoURL}" alt="Logo" width="130" height="130" /></div>
    <div class="review-details" data-aos="fade-down">
    <div><strong>${name}</strong></div>
    <div>${reviewText}</div>
    </div>
    `;
    reviewList.prepend(reviewDiv);
  }

  function showSuccessMessage(form, message) {
    alert(message);
  }

  /*** 9️⃣ START REVIEWS ROTATION ***/
  startReviewRotation();

  /*** 🔟 ANIMATIONS ***/
  AOS.init({ offset: 120, delay: 50, duration: 400, once: true });
});

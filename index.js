document.addEventListener("DOMContentLoaded", function () {
  // Get modal and close buttons
  var modal = document.getElementById("offerModal");
  var closeButtons = document.querySelectorAll(".close-button");
  var navHamburger = document.querySelector(".nav-hamburger"); // Define properly
  var navMenu = document.querySelector(".header-nav ul");

// Offer model shown when page loads START
// Check sessionStorage for modal closed state
if (sessionStorage.getItem("modalClosed") === "true") {
  if (modal) {
    modal.style.display = "none";
  }
} else {
  if (modal) {
    modal.style.display = "block"; // Show modal if not closed before
  }
}

// Add event listeners to close buttons
if (modal) {
  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      modal.style.display = "none";
      sessionStorage.setItem("modalClosed", "true"); // Store in session storage
    });
  });
}
// Offer model shown when page loads END


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

  // NAV BAR | MOBILE START
  // Toggle menu on mobile
  if (navHamburger && navMenu) {
    navHamburger.addEventListener("click", function () {
      navMenu.classList.toggle("nav-open");
    });
  }
  // NAV BAR | MOBILE END

 //MEMBERSHIP MODEL START

 emailjs.init('5qdUdXA3EzfbBzOLd');

const membershipModal = document.getElementById("membershipModal");
const getStartedLinks = document.querySelectorAll(".get-started-link");
const membershipForm = document.getElementById("membershipForm");
const successMessage = document.createElement("p");  // Create a success message element
successMessage.style.color = "green";  // Style the success message



// Open modal function
function openModal(duration) {
  membershipModal.style.display = "flex";  // Show modal
  // Reset radio button selection
  document.getElementById("threeMonths").checked = false;
  document.getElementById("sixMonths").checked = false;
  document.getElementById("oneYear").checked = false;
  
  if (duration === "3Months") {
    document.getElementById("threeMonths").checked = true;
  } else if (duration === "6Months") {
    document.getElementById("sixMonths").checked = true;
  } else if (duration === "OneYear") {
    document.getElementById("oneYear").checked = true;
  }
}

// Handle "Get Started" links
getStartedLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();  // Prevent default link behavior
    const membershipType = link.getAttribute("data-membership");
    openModal(membershipType);  // Open modal with selected membership type
  });
});

// Close modal
function closeModal() {
  membershipModal.style.display = "none";
}

// Attach close buttons
closeButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

// Handle form submission
membershipForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const contact = document.getElementById("contacts").value;

  
  
  // Get selected membership
  let selectedMembership = "";
  if (document.getElementById("threeMonths").checked) {
    selectedMembership = "3 Months";
  } else if (document.getElementById("sixMonths").checked) {
    selectedMembership = "6 Months";
  } else if (document.getElementById("oneYear").checked) {
    selectedMembership = "1 Year";
  }

  // Create an object to send via EmailJS
  const emailData = {
    name: name,
    email: email,
    contact: contact,
    membership: selectedMembership,
  };

  // Send the email using EmailJS
  emailjs.send('service_sf3lbfo', 'template_myz3pzi', emailData)
  .then(function(response) {
    // Display the success message after successful email send
    successMessage.textContent = "We have received your request and we'll reach out to you shortly.";
    membershipForm.insertBefore(successMessage, membershipForm.firstChild);  // Insert success message at the top
    membershipForm.reset();  // Reset the form fields

   // closeModal();  // Close the modal after submission
   setTimeout(function() {
    successMessage.remove();
  }, 5000);  // 5000 ms = 5 seconds
}, function(error) {
    // Log errors if the email fails to send
    console.log("Error sending email:", error);
  });

  // Here you would typically send the data to your server or payment system
  // alert(`Name: ${name}\nEmail: ${email}\nContact: ${contact}\nMembership: ${selectedMembership}`);
  // closeModal();  // Close modal after submission

  //CONTACT FORM START
  const contactForm = document.getElementById("contactForm");
  // Handle form submission
  if (contactForm) {
    console.log("contactForm");
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();  // Prevent the form from refreshing the page on submit

      // Get form data
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const number = document.getElementById("number").value;
      const message = document.getElementById("message").value;

      // Create an object to send via EmailJS
      const emailData = {
        name: name,
        email: email,
        number: number,
        message: message
      };

      // Send the email using EmailJS
      emailjs.send('service_sf3lbfo', 'template_myz3pzi', emailData)
        .then(function(response) {
          // Show success message
          alert("Your message has been sent successfully!");

          // Optionally clear the form after submission
          contactForm.reset();
        }, function(error) {
          // Log errors if the email fails to send
          console.log("Error sending email:", error);
        });
    });
  }

    //Contact form END

});
 //MEMBERSHIP MODEL END

 //REVIEW
// Initialize Supabase
const SUPABASE_URL = "https://yjpjumvaadajilxkdrwb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqcGp1bXZhYWRhamlseGtkcndiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4ODU1NzAsImV4cCI6MjA1MDQ2MTU3MH0.ZloxuS3lY_hEfI6teaEvdZ8R3eC95tk-7loyMVLNo4o";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get references to HTML elements
const submitReviewBtn = document.getElementById("submitReviewBtn");
const reviewForm = document.getElementById("reviewForm");
const reviewSuccessMsg = document.getElementById("reviewSuccessMsg");
const reviewList = document.getElementById("reviewList");

// Show form when button is clicked
submitReviewBtn.addEventListener("click", function () {
  reviewForm.style.display = "block";
});

// Fetch and display existing reviews
async function fetchReviews(offset = 0) {
  // Get total count of reviews
  const { count, error: countError } = await supabase
  .from('tfsreview')
  .select('*', { count: 'exact', head: true });

if (countError) {
  console.error('Error getting review count:', countError);
  return;
}

// Calculate total number of sets (each set contains 3 reviews)
const totalSets = Math.ceil(count / 3);
const currentSet = Math.floor(offset / 3) + 1; // Calculate current set based on offset

  // Fetch 3 reviews using the offset
  let { data: reviews, error } = await supabase
  .from('tfsreview')
  .select('*')
  .range(offset, offset + 2);  // Fetch 3 reviews starting from offset

if (error) {
  console.error('Error fetching reviews:', error);
  return;
}

  reviewList.innerHTML = ""; // Clear previous reviews

  reviews.forEach((review) => {
    displayNewReview(review.name, review.photo_url, review.review);
  });
  setTimeout(function() {
    const nextOffset = (currentSet % totalSets) * 3;  // Cycle through sets
    fetchReviews(nextOffset);
  }, 5000);}

// Handle form submission
reviewForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("reviewName").value;
  const photo = document.getElementById("reviewPhoto").files[0];
  const reviewText = document.getElementById("reviewText").value;

  if (!name || !photo || !reviewText) {
    alert("All fields are required!");
    return;
  }

  try {
    // Upload photo to Supabase Storage
    const fileName = `${Date.now()}-${photo.name}`;
    const { data, error } = await supabase.storage
      .from("tfsphotos")
      .upload(`public/${fileName}`, photo);

    if (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Try again.");
      return;
    }

    const photoURL = `${SUPABASE_URL}/storage/v1/object/public/tfsphotos/public/${fileName}`;

    // Save review to Supabase Database
    const { data: reviewData, error: reviewError } = await supabase
      .from("tfsreview")
      .insert([{ name, photo_url: photoURL, review: reviewText }]);

    if (reviewError) {
      console.error("Error saving review:", reviewError);
      alert("Failed to submit review. Try again.");
      return;
    }

    // Show success message
    reviewSuccessMsg.style.display = "block";
    setTimeout(() => {
      reviewSuccessMsg.style.display = "none";
      reviewForm.reset();
      reviewForm.style.display = "none";
    }, 1000);

    // Update UI with the new review
    displayNewReview(name, photoURL, reviewText);
  } catch (error) {
    console.error("Error submitting review:", error);
    alert("Something went wrong. Try again.");
  }
});

document.getElementById("reviewPhoto").addEventListener("change", function() {
  const fileName = this.files[0] ? this.files[0].name : "Choose a Photo";
  document.getElementById("fileLabel").textContent = fileName;
});

// Function to dynamically add reviews
function displayNewReview(name, photoURL, reviewText) {
  const reviewDiv = document.createElement("div");
  reviewDiv.classList.add("review-info");

  reviewDiv.innerHTML = `
    <div class="review-image" data-aos="image-rotateIn"><img src="${photoURL}" alt="Logo" class="review-icon" width="130" height="130" /></div>
    <div class="review-details" data-aos="fade-down">
      <div><strong>${name}</strong></div>
      <div>${reviewText}</div>
    </div>
  `;

  reviewList.prepend(reviewDiv); // Add new review to the top
}

// Load reviews when the page loads
fetchReviews();


  // Initialize AOS animations
  AOS.init({
    offset: 120,
    delay: 50,
    duration: 400,
    once: true,
  });
});

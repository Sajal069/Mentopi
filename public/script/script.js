const sections = document.querySelectorAll(".fade-in-section");

const observer_1 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer_1.unobserve(entry.target);
    }
  });
});

sections.forEach((section) => {
  observer_1.observe(section);
});

document.addEventListener("DOMContentLoaded", function () {
  let observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5, // Trigger when 10% of the section is visible
  };

  let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target); // Stop observing once animation is triggered
      }
    });
  }, observerOptions);

  let section = document.querySelector(".section3");
  observer.observe(section);
});

document.addEventListener("DOMContentLoaded", function () {
  const observerOptions = {
    threshold: 0.3,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        entry.target.classList.remove("hidden");
        entry.target.style.visibility = "visible";
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  const hiddenElements = document.querySelectorAll(
    ".fade-in-section5, .Mentor-profile"
  );
  hiddenElements.forEach((element) => {
    element.style.visibility = "hidden"; // Ensure the elements are initially hidden
    observer.observe(element);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const observerOptions = {
    threshold: 0.1,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        entry.target.classList.remove("hidden");
        entry.target.style.visibility = "visible";
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  const hiddenElements = document.querySelectorAll(
    ".fade-in-section6, .FAQ-rating"
  );
  hiddenElements.forEach((element) => {
    element.style.visibility = "hidden"; // Ensure the elements are initially hidden
    observer.observe(element);
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const observerOptions = {
    threshold: 0.1,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const targetNumber = parseInt(element.getAttribute("data-target"));
        const duration = 2000; // Duration of the animation in milliseconds

        let start = 0;
        const increment = targetNumber / (duration / 16);

        const updateNumber = () => {
          start += increment;
          if (start < targetNumber) {
            element.textContent = Math.floor(start) + "+";
            requestAnimationFrame(updateNumber);
          } else {
            element.textContent = targetNumber + "+";
          }
        };

        requestAnimationFrame(updateNumber);
        observer.unobserve(element);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  const numberElements = document.querySelectorAll(".number");
  numberElements.forEach((element) => observer.observe(element));
});

document
  .getElementById("newsletterForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("floatingInput").value;
    const name = document.getElementById("floatingName").value;

    try {
      const response = await fetch("/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      if (response.ok) {
        alert(
          "Subscription successful! An email has been sent to contact@mentopi.com."
        );
      } else {
        alert("Subscription failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });

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

document
  .getElementById("payment-form-1")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const upiId = document.getElementById("upi-id").value;
    const response = await fetch("/create-order/BAT-level-1", {
      method: "POST",
    });
    const order = await response.json();

    var options = {
      key: "your_razorpay_key_id", // Replace with your Razorpay key id
      amount: order.amount,
      currency: order.currency,
      name: "Mentopi",
      description: "Test Transaction",
      order_id: order.id, // This is a sample Order ID. Pass the `id` obtained in the response of createOrder.
      handler: async function (response) {
        const verifyResponse = await fetch("/verify-payment/BAT-level-1", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          }),
        });
        const result = await verifyResponse.json();
        if (result.success) {
          window.location.href = "/payment-success";
        } else {
          window.location.href = "/payment-failed";
        }
      },
      prefill: {
        email: "<%= user.email %>", // Pass email dynamically
        contact: "<%= user.phone %>", // Pass contact dynamically if available
      },
      notes: {
        address: "note value",
      },
      theme: {
        color: "#3399cc",
      },
      method: {
        upi: {
          vpa: upiId, // User's UPI ID
        },
      },
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
  });

document
  .getElementById("payment-form-2")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const upiId = document.getElementById("upi-id").value;
    const response = await fetch("/create-order/BAT-level-2", {
      method: "POST",
    });
    const order = await response.json();

    var options = {
      key: "your_razorpay_key_id", // Replace with your Razorpay key id
      amount: order.amount,
      currency: order.currency,
      name: "Mentopi",
      description: "Test Transaction",
      order_id: order.id, // This is a sample Order ID. Pass the `id` obtained in the response of createOrder.
      handler: async function (response) {
        const verifyResponse = await fetch("/verify-payment/BAT-level-1", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          }),
        });
        const result = await verifyResponse.json();
        if (result.success) {
          window.location.href = "/payment-success";
        } else {
          window.location.href = "/payment-failed";
        }
      },
      prefill: {
        email: "<%= user.email %>", // Pass email dynamically
        contact: "<%= user.phone %>", // Pass contact dynamically if available
      },
      notes: {
        address: "note value",
      },
      theme: {
        color: "#3399cc",
      },
      method: {
        upi: {
          vpa: upiId, // User's UPI ID
        },
      },
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
  });

document
  .getElementById("payment-form-3")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const upiId = document.getElementById("upi-id").value;
    const response = await fetch("/create-order/BAT-level-3", {
      method: "POST",
    });
    const order = await response.json();

    var options = {
      key: "your_razorpay_key_id", // Replace with your Razorpay key id
      amount: order.amount,
      currency: order.currency,
      name: "Mentopi",
      description: "Test Transaction",
      order_id: order.id, // This is a sample Order ID. Pass the `id` obtained in the response of createOrder.
      handler: async function (response) {
        const verifyResponse = await fetch("/verify-payment/BAT-level-1", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          }),
        });
        const result = await verifyResponse.json();
        if (result.success) {
          window.location.href = "/payment-success";
        } else {
          window.location.href = "/payment-failed";
        }
      },
      prefill: {
        email: "<%= user.email %>", // Pass email dynamically
        contact: "<%= user.phone %>", // Pass contact dynamically if available
      },
      notes: {
        address: "note value",
      },
      theme: {
        color: "#3399cc",
      },
      method: {
        upi: {
          vpa: upiId, // User's UPI ID
        },
      },
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
  });

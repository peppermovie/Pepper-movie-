// Pepper.movie
// Basic website interactions

document.addEventListener("DOMContentLoaded", function () {

  // -----------------------------
  // SELECTED PLAN
  // -----------------------------

  const selectedPlan = document.getElementById("selectedPlan");

  if (selectedPlan) {

    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");

    if (plan === "yearly") {
      selectedPlan.textContent = "Yearly — $40";
    } else {
      selectedPlan.textContent = "Monthly — $5";
    }
  }


  // -----------------------------
  // COPY WALLET ADDRESS
  // -----------------------------

  window.copyWallet = function () {

    const wallet = document.getElementById("walletAddress");

    if (!wallet) return;

    const address = wallet.textContent.trim();

    navigator.clipboard.writeText(address)
      .then(function () {

        alert("Wallet address copied.");

      })
      .catch(function () {

        alert("Copy failed. Please copy the address manually.");

      });
  };


  // -----------------------------
  // PAYMENT FORM
  // -----------------------------

  const paymentForm = document.querySelector(".payment-form");

  if (paymentForm) {

    paymentForm.addEventListener("submit", function (event) {

      event.preventDefault();

      const email = document.getElementById("email");
      const txid = document.getElementById("txid");
      const screenshot = document.getElementById("screenshot");
      const status = document.getElementById("paymentStatus");

      if (!email.value || !txid.value || !screenshot.files.length) {
        alert("Please complete all payment fields.");
        return;
      }

      status.textContent =
        "Payment submitted. Your transaction will be manually reviewed.";

      status.style.color = "#c52a4a";

      paymentForm.reset();

    });
  }


  // -----------------------------
  // MEMBER VIDEO BUTTONS
  // -----------------------------

  const memberButtons =
    document.querySelectorAll(".member-play");

  memberButtons.forEach(function (button) {

    button.addEventListener("click", function (event) {

      const href = button.getAttribute("href");

      if (!href || href === "#") {
        event.preventDefault();

        alert(
          "This video will be available after the video link is added."
        );
      }

    });

  });

});

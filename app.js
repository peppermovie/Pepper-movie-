// ==========================================
// Pepper.movie - Supabase connection
// ==========================================

const SUPABASE_URL = "https://vpmmyiejcfuipwzjsqlu.supabase.co";
const SUPABASE_KEY = "sb_publishable_xLa7CWBw-sGizqb9oHy5Mg_QDLytX_h";


// Load Supabase library
const supabaseScript = document.createElement("script");

supabaseScript.src =
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

supabaseScript.onload = function () {

  window.supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

  console.log("Supabase connected successfully.");

  setupAuth();
  setupPayment();
  setupWallet();

};


// Add Supabase library to page
document.head.appendChild(supabaseScript);


// ==========================================
// AUTH
// ==========================================

function setupAuth() {

  const signUpBtn =
    document.getElementById("signUpBtn");

  const signInBtn =
    document.getElementById("signInBtn");


  // SIGN UP
  if (signUpBtn) {

    signUpBtn.addEventListener("click", async function (event) {

      event.preventDefault();

      const email =
        prompt("Enter your email:");

      if (!email) return;


      const password =
        prompt("Create a password (minimum 6 characters):");

      if (!password) return;


      const { data, error } =
        await window.supabaseClient.auth.signUp({
          email: email,
          password: password
        });


      if (error) {

        alert(error.message);
        return;

      }


      alert(
        "Account created. Check your email to confirm your account."
      );

    });

  }


  // SIGN IN
  if (signInBtn) {

    signInBtn.addEventListener("click", async function (event) {

      event.preventDefault();

      const email =
        prompt("Enter your email:");

      if (!email) return;


      const password =
        prompt("Enter your password:");

      if (!password) return;


      const { data, error } =
        await window.supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });


      if (error) {

        alert(error.message);
        return;

      }


      alert("Login successful.");

      window.location.href = "members.html";

    });

  }

}


// ==========================================
// PAYMENT
// ==========================================

function setupPayment() {

  const paymentForm =
    document.querySelector(".payment-form");

  if (!paymentForm) return;


  paymentForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const {
      data: { user }
    } = await window.supabaseClient.auth.getUser();


    if (!user) {

      alert("Please sign in before submitting payment.");

      return;

    }


    const email =
      document.getElementById("email").value.trim();

    const txid =
      document.getElementById("txid").value.trim();


    const params =
      new URLSearchParams(window.location.search);

    const plan =
      params.get("plan") === "yearly"
        ? "yearly"
        : "monthly";


    const amount =
      plan === "yearly"
        ? 40
        : 5;


    const { error } =
      await window.supabaseClient
        .from("payment_requests")
        .insert({

          user_id: user.id,
          plan: plan,
          amount_usd: amount,
          network: "TRC20",
          txid: txid

        });


    if (error) {

      alert(error.message);
      return;

    }


    document.getElementById("paymentStatus").textContent =
      "Payment submitted successfully. Your payment will be manually reviewed.";


    paymentForm.reset();

  });

}


// ==========================================
// WALLET
// ==========================================

function setupWallet() {

  window.copyWallet = function () {

    const wallet =
      document.getElementById("walletAddress");

    if (!wallet) return;


    navigator.clipboard
      .writeText(wallet.textContent.trim())
      .then(function () {

        alert("Wallet address copied.");

      });

  };

}

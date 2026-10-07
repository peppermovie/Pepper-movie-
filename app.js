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
  checkMembership();
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

async function checkMembership() {
  const message = document.getElementById("memberMessage");
  const videos = document.getElementById("memberVideos");

  if (!message || !videos) return;

  const { data: { user } } = await window.supabaseClient.auth.getUser();

  if (!user) {
    message.textContent = "Please sign in to access member videos.";
    videos.style.display = "none";
    return;
  }

  const { data, error } = await window.supabaseClient
    .from("memberships")
    .select("status, expires_at")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("expires_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(error);
    message.textContent = "Could not check membership.";
    videos.style.display = "none";
    return;
  }

  if (!data) {
    message.textContent = "You don't have an active membership yet.";
    videos.style.display = "none";
    return;
  }

  const expiresAt = new Date(data.expires_at);

  if (expiresAt <= new Date()) {
    message.textContent = "Your membership has expired.";
    videos.style.display = "none";
    return;
  }

  message.textContent =
    "Membership active until " + expiresAt.toLocaleDateString();

  videos.style.display = "grid";
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

    const screenshot =
      document.getElementById("screenshot").files[0];


    if (!email || !txid || !screenshot) {
      alert("Please complete all payment fields.");
      return;
    }


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


    // Create a unique file name
    const fileName =
      user.id + "/" +
      crypto.randomUUID() + "-" +
      screenshot.name;


    // Upload screenshot
    const { error: uploadError } =
      await window.supabaseClient
        .storage
        .from("payment-screenshots")
        .upload(fileName, screenshot);


    if (uploadError) {
      alert("Screenshot upload failed: " + uploadError.message);
      return;
    }


    // Save payment request
    const { error: paymentError } =
      await window.supabaseClient
        .from("payment_requests")
        .insert({

          user_id: user.id,
          plan: plan,
          amount_usd: amount,
          network: "TRC20",
          txid: txid,
          screenshot_path: fileName,
          status: "pending"

        });


    if (paymentError) {
      alert("Payment request failed: " + paymentError.message);
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

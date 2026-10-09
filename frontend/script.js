// /* ==========================================================
//    SUPABASE FORM - STEP BY STEP
   
//    This script connects your HTML form to Supabase (PostgreSQL database).
//    Each section explains what's happening and why.
   
//    Key difference from Firebase:
//    - Firebase = NoSQL (document-based, like JSON)
//    - Supabase = SQL (table-based, like Excel or a spreadsheet)
//    ========================================================== */


// /* ==========================================================
//    STEP 1: IMPORT SUPABASE LIBRARY FROM CDN
   
//    This line loads the Supabase JavaScript library from a CDN
//    (Content Delivery Network - Google's servers that host code files).
   
//    Supabase = An open-source Firebase alternative built on PostgreSQL
   
//    The library gives us the createClient() function which connects
//    to your Supabase database.
//    ========================================================== */

// import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";



// /* ==========================================================
//    STEP 2: SUPABASE CONFIG
   
//    These are YOUR Supabase project's connection details.
//    It tells the code "which Supabase project should I connect to?"
   
//    HOW TO GET THESE VALUES:
//    1. Go to https://supabase.com/ and sign in
//    2. Click your project name
//    3. Click "Settings" (gear icon at bottom left)
//    4. Click "API"
//    5. Copy:
//       - "Project URL" (looks like https://YOUR_ID.supabase.co)
//       - "anon public" key (a long string of letters/numbers)
   
//    PASTE YOUR VALUES HERE (replace the YOUR_... values):
//    ========================================================== */

// const SUPABASE_URL = "https://idhthkfzonkhuyalifdl.supabase.co";
// const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkaHRoa2Z6b25raHV5YWxpZmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MzQxNzQsImV4cCI6MjEwNjQxMDE3NH0.amBbe3S7mQnYtA2klwX81iCjpHCLPhqWYBw3h4srGwQ";



// /* ==========================================================
//    STEP 3: CREATE SUPABASE CLIENT
   
//    This does one thing: 
   
//    createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
//    → Creates a connection to your Supabase project
//    → The URL tells it WHERE to connect (your project's server)
//    → The anon key tells it WHO you are (a public user, not admin)
   
//    supabase = 
//    → Saves this connection in a variable called "supabase"
//       We use "supabase" later to read and write data
   
//    Think of it like: "supabase" is your connection to the database,
//    and you use it whenever you want to read or write data.
   
//    Why "anon" key?
//    - Anon = Anonymous (public user, limited permissions)
//    - Not a secret key (it's shown in your HTML/JS for everyone to see)
//    - Security = Supabase Row Level Security (RLS) controls what users can do
//    ========================================================== */

// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);



// /* ==========================================================
//    STEP 4: TABLE NAME
   
//    This is the name of the table in your Supabase database
//    where form messages get stored.
   
//    It must match what you create in Supabase!
//    We'll create a "submissions" table with columns:
//    - id (auto-increment)
//    - name (text)
//    - email (text)
//    - message (text)
//    - created_at (timestamp)
//    ========================================================== */

// const TABLE_NAME = "submissions";



// /* ==========================================================
//    STEP 5: SAVE TO SUPABASE FUNCTION
   
//    This function does the actual saving to your Supabase database.
   
//    Parameters:
//    - data: an object with { name, email, message }
   
//    What happens:
   
//    1. supabase.from(TABLE_NAME)
//       → "I want to work with the 'submissions' table"
//         (like picking a sheet in Google Sheets)
   
//    2. .insert([data])
//       → "Add this new row to the table"
//         The [...] means "this is an array" (can have multiple rows)
   
//    3. await
//       → Wait for Supabase to respond before moving on
//         (without this, code would run before data is saved)
   
//    4. const { error }
//       → If something fails, Supabase puts the error message here
//         If it works, error = null
   
//    5. if (error) throw new Error(...)
//       → If there's an error, stop and show it
//         The throw makes the error bubble up to the try/catch in the form handler
//    ========================================================== */

// async function saveToSupabase(data) {
//   console.log("📤 Saving to Supabase...", data); // Shows in browser console for debugging

//   // supabase.from("submissions") = point to the "submissions" table
//   // .insert([data]) = add a new row
//   // await = wait for Supabase to respond
//   const { error } = await supabase
//     .from(TABLE_NAME)
//     .insert([data]);

//   // If Supabase returned an error, throw it so try/catch catches it
//   if (error) {
//     throw new Error(error.message);
//   }

//   console.log("✅ Saved to Supabase successfully!");
// }



// /* ==========================================================
//    STEP 6: CONNECT TO HTML ELEMENTS
   
//    These lines find the form, button, and status box in your HTML.
//    They use document.getElementById() to find elements by their ID.
   
//    From your HTML:
//    - id="contact-form"   → the entire <form>
//    - id="submit-btn"     → the "Send message" button
//    - id="status"         → the <div> where we show success/error messages
   
//    Think of it like: JavaScript is reading your HTML and saying
//    "okay, I found the form, the button, and the message box"
//    ========================================================== */

// const form = document.getElementById("contact-form");
// const submitBtn = document.getElementById("submit-btn");
// const statusBox = document.getElementById("status");



// /* ==========================================================
//    STEP 7: SHOW MESSAGES FUNCTION
   
//    After saving, we show the user a message (success or error).
   
//    Input: lines = array of objects like:
//    [
//      { ok: true,  text: "Saved successfully!" },
//      { ok: false, text: "Email is invalid!" }
//    ]
   
//    The function creates HTML and puts it in the statusBox.
//    If ok: true → shows in green (--supabase color)
//    If ok: false → shows in red (--error color)
//    ========================================================== */

// function showStatus(lines) {
//   // Create HTML: for each line, make a <p> tag
//   // Add class "ok" or "fail" to color it green or red
//   statusBox.innerHTML = lines
//     .map((line) => `<p class="${line.ok ? "ok" : "fail"}">${line.text}</p>`)
//     .join("");
  
//   console.log("📝 Status message shown:", lines);
// }



// /* ==========================================================
//    STEP 8: HANDLE FORM SUBMIT
   
//    This runs when the user clicks the "Send message" button.
   
//    Event flow:
//    1. User fills form and clicks button
//    2. form.addEventListener("submit", ...) catches it
//    3. event.preventDefault() stops the page from reloading
//    4. We read the form values (name, email, message)
//    5. We validate (check if they're empty or if email is wrong format)
//    6. We call saveToSupabase(data)
//    7. We show a success or error message
//    ========================================================== */

// form.addEventListener("submit", async (event) => {
//   event.preventDefault(); // Stop the browser from reloading the page
  
//   console.log("🚀 Form submitted!"); // Debug message

//   // STEP 8A: READ FORM VALUES
//   // .value gets what the user typed into each field
//   // .trim() removes spaces from the start/end
//   const data = {
//     name: form.name.value.trim(),
//     email: form.email.value.trim(),
//     message: form.message.value.trim(),
//   };

//   console.log("📋 Form data:", data); // Show what we read


//   // STEP 8B: VALIDATE (check if data is correct)
  
//   // Check 1: Make sure nothing is empty
//   if (!data.name || !data.email || !data.message) {
//     showStatus([
//       { ok: false, text: "❌ Please fill in all fields (name, email, message)." }
//     ]);
//     console.log("⚠️  Validation failed: empty fields");
//     return; // Stop here, don't try to save
//   }

//   // Check 2: Make sure email looks like an email
//   // This regex pattern checks: something@something.something
//   if (!/^\S+@\S+\.\S+$/.test(data.email)) {
//     showStatus([
//       { ok: false, text: "❌ Please enter a valid email address." }
//     ]);
//     console.log("⚠️  Validation failed: invalid email format");
//     return; // Stop here, don't try to save
//   }

//   console.log("✔️  Validation passed!"); // All checks passed


//   // STEP 8C: LOCK THE BUTTON
//   // While saving, disable the button and show "Sending..."
//   // This prevents the user from clicking it twice
//   submitBtn.disabled = true;
//   submitBtn.textContent = "Sending...";
//   statusBox.innerHTML = ""; // Clear old messages


//   // STEP 8D: TRY TO SAVE
//   // try/catch catches errors if Supabase fails
//   try {
//     await saveToSupabase(data); // Wait for Supabase to respond
    
//     // If we get here, it worked!
//     showStatus([
//       { ok: true, text: "✅ Message saved to Supabase!" }
//     ]);
    
//     form.reset(); // Clear the form fields for the next message
//     console.log("🎉 All done!");
    
//   } catch (error) {
//     // If something went wrong, show the error
//     showStatus([
//       { ok: false, text: `❌ Supabase error: ${error.message}` }
//     ]);
//     console.error("❌ Save failed:", error); // Show full error in console
//   }


//   // STEP 8E: UNLOCK THE BUTTON
//   // After saving (or after the error), turn the button back on
//   submitBtn.disabled = false;
//   submitBtn.textContent = "Send message"; // Change text back to normal
// });


// /* ==========================================================
//    SUMMARY: HOW IT ALL CONNECTS
//    ========================================================== */

// /*
//    USER (you)
//         ↓
//    HTML (form, button, input fields)
//         ↓
//    JavaScript (this file)
//         ↓
//    Supabase SDK (import at the top)
//         ↓
//    Supabase servers (supabase.com's data centers)
//         ↓
//    Your PostgreSQL database (stores the data in a table)

//    When user clicks button:
//    1. HTML form catches the click
//    2. JavaScript reads form.name.value, form.email.value, etc.
//    3. JavaScript validates the data
//    4. JavaScript calls saveToSupabase(data)
//    5. saveToSupabase uses Supabase SDK to send data to supabase.com servers
//    6. Supabase checks Row Level Security (RLS) policies
//    7. If allowed, stores it in your PostgreSQL table
//    8. JavaScript shows a success message in the HTML
   
//    All of this happens in milliseconds!

//    KEY DIFFERENCES FROM FIREBASE:
//    - Firebase uses NoSQL (JSON documents)
//    - Supabase uses SQL (relational tables)
//    - Firebase has built-in auth
//    - Supabase uses Row Level Security (RLS) for permissions
//    - Both store data in the cloud (no local server needed)
// */


/* ==========================================================
   STUDENT FEEDBACK FRONTEND
   Frontend → Express Backend → Supabase
   ========================================================== */


/* ==========================================================
   STEP 1: BACKEND API URL

   During local development, our Express backend runs on:

   http://localhost:3000

   Later, when we deploy the backend to Railway, we will
   change this to the Railway URL.

   IMPORTANT:
   The frontend does NOT connect directly to Supabase.
   ========================================================== */

const API_URL = "http://localhost:3000";


/* ==========================================================
   STEP 2: CONNECT TO HTML ELEMENTS
   ========================================================== */

const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const statusBox = document.getElementById("status");


/* ==========================================================
   STEP 3: SHOW STATUS MESSAGE
   ========================================================== */

function showStatus(lines) {
  statusBox.innerHTML = lines
    .map(
      (line) =>
        `<p class="${line.ok ? "ok" : "fail"}">${line.text}</p>`
    )
    .join("");

  console.log("📝 Status message:", lines);
}


/* ==========================================================
   STEP 4: SEND DATA TO BACKEND

   OLD architecture:

   Frontend → Supabase

   NEW architecture:

   Frontend → Express Backend → Supabase

   This function sends the form data to our Express API.
   ========================================================== */

async function saveSubmission(data) {
  console.log("📤 Sending data to backend...", data);

  const response = await fetch(`${API_URL}/api/submissions`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(data)
  });


  /* ========================================================
     Convert backend response from JSON
     ======================================================== */

  const result = await response.json();

  console.log("📥 Backend response:", result);


  /* ========================================================
     Check whether backend returned an error
     ======================================================== */

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to save submission"
    );
  }


  return result;
}


/* ==========================================================
   STEP 5: HANDLE FORM SUBMISSION
   ========================================================== */

form.addEventListener("submit", async (event) => {

  // Prevent page refresh
  event.preventDefault();

  console.log("🚀 Form submitted!");


  /* ========================================================
     STEP 5A: READ FORM VALUES
     ======================================================== */

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim()
  };

  console.log("📋 Form data:", data);


  /* ========================================================
     STEP 5B: VALIDATE FORM
     ======================================================== */

  // Check empty fields
  if (!data.name || !data.email || !data.message) {

    showStatus([
      {
        ok: false,
        text: "❌ Please fill in all fields."
      }
    ]);

    return;
  }


  // Check email format
  if (!/^\S+@\S+\.\S+$/.test(data.email)) {

    showStatus([
      {
        ok: false,
        text: "❌ Please enter a valid email address."
      }
    ]);

    return;
  }


  console.log("✔️ Validation passed!");


  /* ========================================================
     STEP 5C: DISABLE BUTTON WHILE REQUEST IS RUNNING
     ======================================================== */

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  statusBox.innerHTML = "";


  /* ========================================================
     STEP 5D: SEND DATA TO EXPRESS BACKEND
     ======================================================== */

  try {

    const result = await saveSubmission(data);


    /* ======================================================
       SUCCESS
       ====================================================== */

    showStatus([
      {
        ok: true,
        text: "✅ Message saved successfully!"
      }
    ]);


    // Clear form
    form.reset();

    console.log("🎉 Submission completed!");
    console.log("📦 Saved data:", result.data);

  }


  /* ========================================================
     ERROR
     ======================================================== */

  catch (error) {

    console.error("❌ Submission failed:", error);

    showStatus([
      {
        ok: false,
        text: `❌ ${error.message}`
      }
    ]);

  }


  /* ========================================================
     STEP 5E: ENABLE BUTTON AGAIN
     ======================================================== */

  submitBtn.disabled = false;
  submitBtn.textContent = "Send message";

});
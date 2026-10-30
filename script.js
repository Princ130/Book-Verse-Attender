console.log("BOOKVERSE SCRIPT LOADED");

const form = document.getElementById("attendanceForm");
console.log("FORM FOUND:", form);

const feedback = document.getElementById("feedback");
const charCount = document.getElementById("charCount");

const overlay = document.getElementById("successOverlay");
const successTime = document.getElementById("successTime");
const closeSuccess = document.getElementById("closeSuccess");

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwnRuaQOxcEH6aLfvGt5FM_q_WJsYe6A0ueiD0cbJq5cYy-09amsW--x7akBtdA-JCDRw/exec";

// CHARACTER COUNTER

feedback.addEventListener("input", () => {
    charCount.textContent = `${feedback.value.length} / 600`;
});


// ERROR HANDLING

function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    error.textContent = message;

    input.closest(".field").classList.toggle(
        "invalid",
        Boolean(message)
    );
}


// TIMESTAMP FORMATTING

function formatLocalTimestamp(date) {
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(date);
}


// SUCCESS POPUP

function showSuccessModal() {
    const now = new Date();

    successTime.textContent = formatLocalTimestamp(now);

    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
}



form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.querySelector("span:first-child").textContent =
        "Recording attendance...";

    const attendanceRecord = {
        name: document.getElementById("fullName").value.trim(),
        registrationNumber: document.getElementById("regNo").value.trim(),
        department: document.getElementById("department").value.trim(),
        section: document.getElementById("section").value.trim(),
        email: document.getElementById("email").value.trim(),
        feedback: feedback.value.trim()
    };

    try {
        const formData = new URLSearchParams(attendanceRecord);

        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        });

        showSuccessModal();

    } catch (error) {
        console.error("Submission error:", error);
        alert("Submission failed. Please try again.");

    } finally {
        submitButton.disabled = false;
        submitButton.querySelector("span:first-child").textContent =
            "Confirm my attendance";
            console.log("SUBMIT EVENT FIRED");

console.log("FORM VALID:", form.checkValidity());
    }
});


// CLOSE SUCCESS POPUP

function dismissSuccess() {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
}

closeSuccess.addEventListener("click", dismissSuccess);


// CLOSE WHEN CLICKING OUTSIDE

overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
        dismissSuccess();
    }
});


// CLOSE USING ESCAPE KEY

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        overlay.classList.contains("show")
    ) {
        dismissSuccess();
    }
});

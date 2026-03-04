// =============================
// Mobile Menu Toggle
// =============================
function toggleMenu() {
    document.querySelector(".nav-menu").classList.toggle("active");
}


// =============================
// Smooth Scrolling
// =============================
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function (e) {

        const targetId = this.getAttribute("href");

        if (targetId.startsWith("#")) {
            e.preventDefault();

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }

        // close menu on mobile
        document.querySelector(".nav-menu").classList.remove("active");
    });
});


// =============================
// Project Modal
// =============================
function openModal(title, description, techs) {

    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalDescription").innerText = description;

    const techContainer = document.getElementById("modalTechs");
    techContainer.innerHTML = "";

    techs.forEach(tech => {
        const span = document.createElement("span");
        span.className = "tech-tag";
        span.innerText = tech;
        techContainer.appendChild(span);
    });

    document.getElementById("projectModal").style.display = "block";
}

function closeModal() {
    document.getElementById("projectModal").style.display = "none";
}


// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById("projectModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};


// =============================
// Theme Toggle
// =============================
function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    let theme = document.body.classList.contains("dark-mode")
        ? "dark"
        : "light";

    localStorage.setItem("theme", theme);

    updateIcon();
}

function updateIcon() {

    const btn = document.querySelector(".theme-toggle");

    if (!btn) return;

    if (document.body.classList.contains("dark-mode")) {
        btn.textContent = "☀️";
    } else {
        btn.textContent = "🌙";
    }
}


// =============================
// Load Theme on Page Start
// =============================
window.onload = () => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateIcon();
};
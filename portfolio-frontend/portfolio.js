const API = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
  loadSkills();
  loadProjects();
});

/* ===============================
   LOAD SKILLS
================================ */

function loadSkills() {
  fetch(API + "/skills")
    .then(res => res.json())
    .then(data => renderSkills(data))
    .catch(err => console.error("Skills error:", err));
}

function renderSkills(skills) {
  const container = document.getElementById("skills-container");

  if (!skills.length) {
    container.innerHTML = "<p>No skills available</p>";
    return;
  }

  container.innerHTML = skills.map(skill => `
    <div class="skill-card">
      ${skill.iconUrl ? `
        <img src="${skill.iconUrl}" 
             class="skill-icon"
             onerror="this.style.display='none'" />
      ` : ""}

      <h3>${skill.name}</h3>
      ${skill.description ? `<p>${skill.description}</p>` : ""}
    </div>
  `).join("");
}

/* ===============================
   LOAD PROJECTS
================================ */

function loadProjects() {
  fetch(API + "/projects")
    .then(res => res.json())
    .then(data => renderProjects(data))
    .catch(err => console.error("Projects error:", err));
}

function renderProjects(projects) {
  const container = document.getElementById("projects-container");

  if (!projects.length) {
    container.innerHTML = "<p>No projects available</p>";
    return;
  }

  container.innerHTML = projects.map(project => {

    const techTags = project.technologies
      ? project.technologies.split(",").map(t =>
        `<span class="tech-tag">${t.trim()}</span>`
      ).join("")
      : "";

    return `
      <div class="project-card">

        <div class="project-header">
          <h3>${project.title}</h3>
        </div>

        <div class="project-body">

          ${project.description ? `
            <p class="project-description">
              ${project.description}
            </p>
          ` : ""}

          <div class="project-techs">
            ${techTags}
          </div>

          <button class="project-action"
            onclick="openProject('${project.githubLink}')">
            View Project
          </button>

        </div>

      </div>
    `;
  }).join("");


}

function openProject(githubLink) {
  console.log("Opening:", githubLink); // for debugging

  if (githubLink && githubLink !== "null" && githubLink !== "undefined") {
    window.open(githubLink, "_blank");
  } else {
    alert("GitHub link not available.");
  }
}

/* ===============================
   API CONFIG
================================ */

const API = "http://localhost:8080";

let skills = [];
let projects = [];

let editingSkillId = null;
let editingProjectId = null;

/* ===============================
   INIT
================================ */

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initSkillEvents();
  initProjectEvents();
  initModal();

  loadSkills();
  loadProjects();
});

/* ===============================
   LOAD FROM DATABASE
================================ */

function loadSkills() {
  fetch(API + "/skills")
    .then(res => res.json())
    .then(data => {
      skills = data;
      renderSkills();
    });
}

function loadProjects() {
  fetch(API + "/projects")
    .then(res => res.json())
    .then(data => {
      projects = data;
      renderProjects();
    });
}

/* ===============================
   TOAST
================================ */

const showToast = (msg) => {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#111";
  toast.style.color = "#fff";
  toast.style.padding = "10px 16px";
  toast.style.borderRadius = "6px";
  toast.style.zIndex = "2000";

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
};

/* ===============================
   TABS
================================ */

function initTabs() {
  document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab")
        .forEach(t => t.classList.remove("active"));

      document.querySelectorAll(".tab-content")
        .forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab)
        .classList.add("active");
    });
  });
}

/* ===============================
   SKILLS
================================ */

function initSkillEvents() {
  document.getElementById("add-skill-btn")
    .addEventListener("click", () => toggleSkillForm(true));

  document.getElementById("cancel-skill")
    .addEventListener("click", () => toggleSkillForm(false));

  document.getElementById("skill-form")
    .addEventListener("submit", handleSkillSubmit);
}

function toggleSkillForm(show, skill = null) {
  const form = document.getElementById("skill-form");

  if (!show) {
    form.classList.add("hidden");
    form.reset();
    editingSkillId = null;
    return;
  }

  form.classList.remove("hidden");

  if (skill) {
    editingSkillId = skill.id;
    document.getElementById("skill-form-title").textContent = "Edit Skill";
    document.getElementById("skill-name").value = skill.name;
    document.getElementById("skill-desc").value = skill.description || "";
    document.getElementById("skill-icon").value = skill.iconUrl || "";
  } else {
    editingSkillId = null;
    document.getElementById("skill-form-title").textContent = "Add New Skill";
    form.reset();
  }
}

function handleSkillSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("skill-name").value.trim();
  const description = document.getElementById("skill-desc").value.trim();
  const iconUrl = document.getElementById("skill-icon").value.trim();

  if (!name) return showToast("Skill name required");

  const skillData = { name, description, iconUrl };

  if (editingSkillId) {
    fetch(API + "/skills/" + editingSkillId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skillData)
    }).then(() => {
      showToast("Skill updated");
      loadSkills();
    });
  } else {
    fetch(API + "/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skillData)
    }).then(() => {
      showToast("Skill added");
      loadSkills();
    });
  }

  toggleSkillForm(false);
}

function renderSkills() {
  const container = document.getElementById("skills-list");

  if (!skills.length) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No skills yet. Click "+ Add Skill"</p>
      </div>`;
    return;
  }

  container.innerHTML = skills.map(skill => `
    <div class="item-card">
      <div class="item-title">
        ${skill.iconUrl ? `
          <img src="${skill.iconUrl}" class="item-icon"
          onerror="this.style.display='none'" />
        ` : ""}
        ${skill.name}
      </div>

      ${skill.description ? `
        <p class="item-description">${skill.description}</p>
      ` : ""}

      <div class="item-actions">
        <button class="btn btn-edit" onclick="editSkill(${skill.id})">Edit</button>
        <button class="btn btn-delete" onclick="deleteSkill(${skill.id})">Delete</button>
      </div>
    </div>
  `).join("");
}

window.editSkill = (id) => {
  const skill = skills.find(s => s.id === Number(id));
  if (skill) toggleSkillForm(true, skill);
};

window.deleteSkill = (id) => {
  if (!confirm("Delete this skill?")) return;

  fetch(API + "/skills/" + id, {
    method: "DELETE"
  }).then(() => {
    showToast("Skill deleted");
    loadSkills();
  });
};

/* ===============================
   PROJECTS (UPDATED FIXED VERSION)
================================ */

function initProjectEvents() {
  document.getElementById("add-project-btn")
    .addEventListener("click", () => toggleProjectForm(true));

  document.getElementById("cancel-project")
    .addEventListener("click", () => toggleProjectForm(false));

  document.getElementById("project-form")
    .addEventListener("submit", handleProjectSubmit);
}

function toggleProjectForm(show, project = null) {
  const form = document.getElementById("project-form");

  if (!show) {
    form.classList.add("hidden");
    form.reset();
    editingProjectId = null;
    return;
  }

  form.classList.remove("hidden");

  if (project) {
    editingProjectId = project.id;
    document.getElementById("project-form-title").textContent = "Edit Project";

    document.getElementById("project-name").value = project.title;
    document.getElementById("project-tech").value = project.technologies || "";
    document.getElementById("project-desc").value = project.description || "";
    document.getElementById("project-github").value = project.githubLink || "";
    document.getElementById("project-linkedin").value = project.linkedinLink || "";
  } else {
    editingProjectId = null;
    document.getElementById("project-form-title").textContent = "Add New Project";
    form.reset();
  }
}

async function handleProjectSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("project-name").value.trim();
  const technologies = document.getElementById("project-tech").value.trim();
  const description = document.getElementById("project-desc").value.trim();
  const githubLink = document.getElementById("project-github").value.trim();
  const linkedinLink = document.getElementById("project-linkedin").value.trim();
  const imageFile = document.getElementById("project-image").files[0]; // make sure id matches your input

  if (!title) return showToast("Project title required");

  const formData = new FormData();
  formData.append("title", title);
  formData.append("technologies", technologies);
  formData.append("description", description);
  formData.append("githubLink", githubLink);
  formData.append("linkedinLink", linkedinLink);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    let response;

    if (editingProjectId) {
      response = await fetch(API + "/projects/" + editingProjectId, {
        method: "PUT",
        body: formData   // ✅ NO HEADERS
      });
    } else {
      response = await fetch(API + "/projects", {
        method: "POST",
        body: formData   // ✅ NO HEADERS
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend Error:", errorText);
      throw new Error("Failed to save project");
    }

    showToast(editingProjectId ? "Project updated" : "Project added");
    toggleProjectForm(false);
    loadProjects();

  } catch (error) {
    console.error("Project Save Error:", error);
    showToast("Error saving project");
  }
}

function renderProjects() {
  const container = document.getElementById("projects-list");

  if (!projects || !projects.length) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No projects yet. Click "+ Add Project"</p>
      </div>`;
    return;
  }

  container.innerHTML = projects.map(project => `
    <div class="item-card">

      ${project.imageUrl ? `
        <img
          src="http://localhost:8080${project.imageUrl}"
          class="project-image"
          onclick="openModal('http://localhost:8080${project.imageUrl}')"
          onerror="this.style.display='none'"
        />
      ` : ""}

      <div class="item-title">${project.title}</div>

      ${project.technologies ? `
        <div class="item-meta">
          <span><strong>Tech:</strong> ${project.technologies}</span>
        </div>
      ` : ""}

      ${project.description ? `
        <p class="item-description">${project.description}</p>
      ` : ""}

      <div class="item-links">
        ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" class="item-link">GitHub</a>` : ""}
        ${project.linkedinLink ? `<a href="${project.linkedinLink}" target="_blank" class="item-link">LinkedIn</a>` : ""}
      </div>

      <div class="item-actions">
        <button class="btn btn-edit" onclick="editProject(${project.id})">Edit</button>
        <button class="btn btn-delete" onclick="deleteProject(${project.id})">Delete</button>
      </div>

    </div>
  `).join("");
}

window.editProject = (id) => {
  const project = projects.find(p => p.id === Number(id));
  if (project) toggleProjectForm(true, project);
};

window.deleteProject = async (id) => {
  if (!confirm("Delete this project?")) return;

  try {
    const res = await fetch(API + "/projects/" + id, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Delete failed");

    showToast("Project deleted");
    loadProjects();
  } catch (err) {
    console.error("Delete Error:", err);
    showToast("Error deleting project");
  }
};

/* ===============================
   IMAGE MODAL
================================ */

function initModal() {
  const modal = document.getElementById("image-modal");
  const closeBtn = document.querySelector(".modal-close");

  modal?.addEventListener("click", (e) => {
    if (e.target.id === "image-modal") closeModal();
  });

  closeBtn?.addEventListener("click", closeModal);
}

window.openModal = (src) => {
  document.getElementById("modal-image").src = src;
  document.getElementById("image-modal").classList.remove("hidden");
};

function closeModal() {
  document.getElementById("image-modal").classList.add("hidden");
}
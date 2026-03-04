package com.example.portfolio.controller;

import com.example.portfolio.model.Project;
import com.example.portfolio.service.ProjectService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // ✅ Get All Projects
    @GetMapping
    public List<Project> getProjects() {
        return projectService.getAllProjects();
    }

    @PostMapping
    public Project createProject(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("technologies") String technologies,
            @RequestParam("githubLink") String githubLink
    ) {

        Project project = new Project();
        project.setTitle(title);
        project.setDescription(description);
        project.setTechnologies(technologies);
        project.setGithubLink(githubLink);

        return projectService.saveProject(project);
    }

    // ✅ Delete Project
    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("technologies") String technologies,
            @RequestParam("githubLink") String githubLink
    ) {

        Project existingProject = projectService.getProjectById(id);

        if (existingProject == null) {
            throw new RuntimeException("Project not found with id " + id);
        }

        existingProject.setTitle(title);
        existingProject.setDescription(description);
        existingProject.setTechnologies(technologies);
        existingProject.setGithubLink(githubLink);

        return projectService.saveProject(existingProject);
    }
}

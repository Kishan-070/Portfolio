package com.example.portfolio.controller;


import com.example.portfolio.model.Admin;
import com.example.portfolio.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @PostMapping("/login")
    public String login(@RequestBody Admin admin) {

        Admin validAdmin = adminRepository
                .findByUsernameAndPassword(admin.getUsername(), admin.getPassword());

        if (validAdmin != null) {
            return "SUCCESS";
        } else {
            return "FAIL";
        }
    }
}
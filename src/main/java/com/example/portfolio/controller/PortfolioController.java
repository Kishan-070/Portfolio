package com.example.portfolio.controller;

import com.example.portfolio.model.Portfolio;
import com.example.portfolio.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin("*")
public class PortfolioController {

    @Autowired
    private PortfolioService service;

    @PostMapping
    public Portfolio createPortfolio(@RequestBody Portfolio portfolio) {
        return service.savePortfolio(portfolio);
    }

    @GetMapping
    public List<Portfolio> getAllPortfolios() {
        return service.getAllPortfolios();
    }

    @GetMapping("/{id}")
    public Portfolio getPortfolioById(@PathVariable Long id) {
        return service.getPortfolioById(id);
    }

    @DeleteMapping("/{id}")
    public void deletePortfolio(@PathVariable Long id) {
        service.deletePortfolio(id);
    }
}
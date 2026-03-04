package com.example.portfolio.service;

import com.example.portfolio.model.Portfolio;
import com.example.portfolio.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository repository;

    public Portfolio savePortfolio(Portfolio portfolio) {
        return repository.save(portfolio);
    }

    public List<Portfolio> getAllPortfolios() {
        return repository.findAll();
    }

    public Portfolio getPortfolioById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deletePortfolio(Long id) {
        repository.deleteById(id);
    }
}
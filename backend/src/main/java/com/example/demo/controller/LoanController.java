package com.example.demo.controller;

import com.example.demo.dto.LoanRequest;
import com.example.demo.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/loan")
@CrossOrigin(origins = "http://localhost:3000") // IMPORTANT: Allows your frontend to connect
public class LoanController {

  @Autowired
  private LoanService loanService;

  @PostMapping("/calculate")
  public Map<String, Object> calculate(@RequestBody LoanRequest request) {
    return loanService.calculateLoan(request);
  }
}

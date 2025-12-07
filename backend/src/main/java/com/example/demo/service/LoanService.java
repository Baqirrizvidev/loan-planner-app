package com.example.demo.service;

import com.example.demo.dto.LoanRequest;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class LoanService {

  public Map<String, Object> calculateLoan(LoanRequest request) {
    double p = request.getPrincipal();
    double r = request.getRateOfInterest() / 12 / 100; // Monthly Rate
    int n = request.getTenureMonths();

    // Standard EMI Formula
    double emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    List<Map<String, Object>> schedule = new ArrayList<>();
    double balance = p;
    double totalInterest = 0;
    int actualTenure = 0;

    // Amortization Loop
    for (int month = 1; balance > 0 && month <= n * 2; month++) {
      double interest = balance * r;
      double principalPart = emi - interest;

      // Add Prepayment
      double extra = request.getPrepaymentAmount();

      if (balance < (principalPart + extra)) {
        principalPart = balance;
        extra = 0;
        balance = 0;
      } else {
        balance = balance - (principalPart + extra);
      }

      totalInterest += interest;
      actualTenure = month;

      Map<String, Object> record = new HashMap<>();
      record.put("month", month);
      record.put("principalPaid", Math.round(principalPart));
      record.put("interestPaid", Math.round(interest));
      record.put("balance", Math.round(balance));
      schedule.add(record);

      if (balance <= 0) break;
    }

    Map<String, Object> response = new HashMap<>();
    response.put("emi", Math.round(emi));
    response.put("totalInterest", Math.round(totalInterest));
    response.put("totalAmount", Math.round(p + totalInterest));
    response.put("actualTenure", actualTenure);
    response.put("schedule", schedule);

    return response;
  }
}

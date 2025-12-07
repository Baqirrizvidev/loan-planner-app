package com.example.demo.dto;

import lombok.Data;

@Data
public class LoanRequest {
  private double principal;      // e.g., 5000000
  private double rateOfInterest; // e.g., 8.5
  private int tenureMonths;      // e.g., 240
  private double prepaymentAmount; // Optional: Monthly extra payment
}

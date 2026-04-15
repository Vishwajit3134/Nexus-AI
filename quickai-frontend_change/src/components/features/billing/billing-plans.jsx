"use client";
import React from "react";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function BillingPlans() {
  const plans = [
    {
      name: "Free Plan",
      price: "₹0",
      oldPrice: "₹49",
      discount: "Free Forever",
      description: "For individuals exploring AI tools.",
      features: [
        "Access to basic AI tools",
        "Limited image generations",
        "Community support",
        "Email assistance",
      ],
      highlight: false,
    },
    {
      name: "Pro Plan",
      price: "₹199",
      oldPrice: "₹299",
      discount: "Save 33%",
      description: "For creators and professionals using AI daily.",
      features: [
        "Unlimited AI generations",
        "Access to all premium tools",
        "Faster response time",
        "Priority support",
        "Early feature access",
      ],
      highlight: true,
    },
    {
      name: "Enterprise Plan",
      price: "₹499",
      oldPrice: "₹799",
      discount: "Save 40%",
      description: "For teams and organizations scaling AI operations.",
      features: [
        "Team access (up to 10 users)",
        "Custom AI workflows",
        "Dedicated account manager",
        "Advanced analytics",
        "24/7 premium support",
      ],
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {plans.map((plan, index) => (
        <Card 
          key={index}
          className={`relative flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
            plan.highlight 
              ? "border-primary shadow-md scale-105 z-10 bg-card" 
              : "border-border bg-card/50"
          }`}
        >
          {/* Discount Tag */}
          <span
            className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
              plan.highlight
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {plan.discount}
          </span>

          <CardHeader className="pb-4">
            <h2 className="text-[20px]  font-medium text-foreground">
              {plan.name}
            </h2>
            <p className=" font-[16px] text-muted-foreground text-sm">{plan.description}</p>
          </CardHeader>

          <CardContent className="flex-1">
            {/* Price */}
            <div className="flex items-baseline mb-6">
              <span className="text-muted-foreground line-through mr-2 text-sm">
                {plan.oldPrice}
              </span>
              <span className="text-4xl font-extrabold text-foreground">
                {plan.price}
              </span>
              <span className="ml-1 text-muted-foreground text-sm">/month</span>
            </div>

            {/* Features */}
            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start text-sm text-foreground/80 text-[16px] ">
                  <Check className="text-green-500 h-4 w-4 mt-0.5 mr-2 shrink-0" /> 
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="pt-4">
            <Button
              className={`w-full font-semibold shadow-md ${
                plan.highlight
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {plan.highlight && <Zap className="w-4 h-4 mr-2 fill-current" />}
              {plan.highlight ? "Upgrade Now" : "Select Plan"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
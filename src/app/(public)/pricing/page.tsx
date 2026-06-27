"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { useApp } from "../../../context/AppContext";
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  CreditCard, 
  Wallet,
  Zap,
  Crown,
  Gem,
  X,
  Loader2
} from "lucide-react";

export default function PricingPage() {
  const { user } = useAuth();
  const { credits, purchaseCredits, upgradePlan } = useApp();
  const [checkoutModal, setCheckoutModal] = useState<{
    open: boolean;
    type: "stripe" | "payhere";
    amount: number;
    price: number;
    description: string;
  }>({
    open: false,
    type: "stripe",
    amount: 0,
    price: 0,
    description: ""
  });
  const [processing, setProcessing] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      credits: 5,
      period: "forever",
      features: [
        "5 free credits to start",
        "Access to all 5 AI tools",
        "Standard resolution output",
        "Basic theme selection",
        "Community support"
      ],
      icon: Zap,
      color: "from-slate-500 to-slate-600",
      borderColor: "border-slate-500/30",
      popular: false
    },
    {
      id: "premium",
      name: "Premium",
      price: 9,
      credits: 100,
      period: "monthly",
      features: [
        "100 credits per month",
        "Access to all 5 AI tools",
        "High-resolution (4K) output",
        "Premium theme library",
        "Priority processing",
        "Email support"
      ],
      icon: Crown,
      color: "from-indigo-500 to-indigo-600",
      borderColor: "border-indigo-500/30",
      popular: true
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      credits: 500,
      period: "monthly",
      features: [
        "500 credits per month",
        "Access to all 5 AI tools",
        "Ultra HD (8K) output",
        "Exclusive premium themes",
        "Instant processing",
        "Priority support",
        "API access",
        "Commercial usage rights"
      ],
      icon: Gem,
      color: "from-purple-500 to-purple-600",
      borderColor: "border-purple-500/30",
      popular: false
    }
  ];

  const creditPacks = [
    {
      id: "pack-10",
      credits: 10,
      price: 0.99,
      bonus: 0,
      color: "from-teal-500 to-teal-600"
    },
    {
      id: "pack-50",
      credits: 50,
      price: 4.99,
      bonus: 5,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      id: "pack-100",
      credits: 100,
      price: 9.99,
      bonus: 15,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "pack-500",
      credits: 500,
      price: 39.99,
      bonus: 100,
      color: "from-pink-500 to-pink-600"
    }
  ];

  const handleCheckout = async (type: "stripe" | "payhere") => {
    setProcessing(true);
    
    // Simulate checkout delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Process the purchase
    await purchaseCredits(checkoutModal.amount, checkoutModal.price, checkoutModal.description);
    
    setProcessing(false);
    setCheckoutModal({ ...checkoutModal, open: false });
  };

  const handlePlanUpgrade = async (planId: string) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const plan = plans.find(p => p.id === planId);
    if (plan && plan.price > 0) {
      setCheckoutModal({
        open: true,
        type: "stripe",
        amount: plan.credits,
        price: plan.price,
        description: `${plan.name} Subscription (${plan.period})`
      });
    } else {
      await upgradePlan(planId as "Free" | "Premium" | "Pro");
    }
  };

  const handleCreditPackPurchase = (pack: typeof creditPacks[0]) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setCheckoutModal({
      open: true,
      type: "stripe",
      amount: pack.credits + pack.bonus,
      price: pack.price,
      description: `${pack.credits + pack.bonus} Credit Pack${pack.bonus > 0 ? ` (+${pack.bonus} bonus)` : ""}`
    });
  };

  return (
    <div className="w-full bg-[#0B0F19] min-h-screen">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simple, Transparent Pricing</span>
          </div>
          
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white mb-6 leading-tight">
            Choose Your Plan<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Scale Your Creativity
            </span>
          </h1>
          
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Start free with 5 credits. Upgrade as you grow. No hidden fees, cancel anytime.
          </p>

          {user && (
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
              <Wallet className="h-4 w-4 text-indigo-400" />
              <span className="text-sm text-slate-300">Current Balance:</span>
              <span className="text-sm font-bold text-indigo-400">{credits} Credits</span>
            </div>
          )}
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="font-display font-black text-3xl text-white mb-4">Subscription Plans</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Monthly credit bundles with automatic renewal. Perfect for regular creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`glass-card rounded-2xl p-8 border transition-all duration-300 relative ${
                  plan.popular ? `${plan.borderColor} scale-105 shadow-2xl shadow-indigo-500/10` : "border-white/5"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Most Popular</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className={`inline-flex p-2.5 bg-gradient-to-tr ${plan.color} rounded-lg shadow-lg text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white">{plan.name}</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-2">
                      <span className="font-display font-black text-4xl text-white">${plan.price}</span>
                      <span className="text-slate-400 text-sm">/{plan.period}</span>
                    </div>
                    <div className="text-indigo-400 text-sm font-semibold">
                      {plan.credits} credits/month
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3 text-slate-300 text-sm">
                        <Check className="h-4 w-4 text-teal-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanUpgrade(plan.id)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                      plan.popular
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25"
                        : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                    }`}
                  >
                    {plan.price === 0 ? "Start Free" : "Subscribe Now"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Credit Packs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="font-display font-black text-3xl text-white mb-4">One-Time Credit Packs</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Buy credits as needed. No subscription required. Bonus credits on larger packs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {creditPacks.map((pack) => (
            <div
              key={pack.id}
              className="glass-card glass-card-hover rounded-2xl p-6 border border-white/5 text-center"
            >
              <div className="space-y-4">
                <div className={`inline-flex p-3 bg-gradient-to-tr ${pack.color} rounded-xl shadow-lg text-white mx-auto`}>
                  <CreditCard className="h-6 w-6" />
                </div>

                <div className="space-y-1">
                  <div className="font-display font-black text-3xl text-white">
                    {pack.credits + pack.bonus}
                  </div>
                  <div className="text-slate-400 text-xs">Credits</div>
                  {pack.bonus > 0 && (
                    <div className="text-teal-400 text-[10px] font-semibold">
                      +{pack.bonus} bonus free
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="font-display font-bold text-2xl text-white mb-1">
                    ${pack.price}
                  </div>
                  <div className="text-slate-500 text-xs">One-time purchase</div>
                </div>

                <button
                  onClick={() => handleCreditPackPurchase(pack)}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 font-semibold rounded-xl text-xs transition-all"
                >
                  Buy Pack
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Methods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-black text-2xl text-white mb-6">Secure Payment Options</h2>
          <p className="text-slate-400 text-sm mb-8">
            We accept all major payment methods. Your payment information is encrypted and secure.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-center">
              <div className="text-slate-400 text-xs font-semibold">Stripe</div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-center">
              <div className="text-slate-400 text-xs font-semibold">PayHere</div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-center">
              <div className="text-slate-400 text-xs font-semibold">Visa</div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-center">
              <div className="text-slate-400 text-xs font-semibold">Mastercard</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-black text-3xl text-white mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                q: "What happens if I run out of credits?",
                a: "You can purchase additional credit packs anytime. Your credits never expire, so you can use them whenever you need."
              },
              {
                q: "Can I cancel my subscription?",
                a: "Yes, you can cancel your subscription at any time from your dashboard. You'll continue to have access until the end of your billing period."
              },
              {
                q: "Do credits roll over?",
                a: "Subscription credits reset each month. One-time credit packs never expire and stay in your account until used."
              },
              {
                q: "What's the difference between plans?",
                a: "All plans give you access to all AI tools. Higher tiers offer more credits, higher resolution output, priority processing, and additional features like API access."
              }
            ].map((faq, idx) => (
              <div key={idx} className="glass-card border border-white/5 rounded-xl p-6">
                <h3 className="font-bold text-white text-sm mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout Modal */}
      {checkoutModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card border border-white/10 rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setCheckoutModal({ ...checkoutModal, open: false })}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl mb-4">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">Complete Your Purchase</h3>
                <p className="text-slate-400 text-sm">{checkoutModal.description}</p>
              </div>

              <div className="glass-panel border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Credits</span>
                  <span className="text-white font-semibold">{checkoutModal.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total</span>
                  <span className="text-white font-bold">${checkoutModal.price}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleCheckout("stripe")}
                  disabled={processing}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>Pay with Stripe</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleCheckout("payhere")}
                  disabled={processing}
                  className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4" />
                      <span>Pay with PayHere</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-slate-500 text-xs">
                Secure payment powered by Stripe & PayHere
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="glass-card border border-white/10 rounded-3xl p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white mb-4 leading-tight">
            Start Creating Today
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Get 5 free credits instantly. No credit card required. Upgrade when you're ready.
          </p>

          <Link
            href={user ? "/dashboard" : "/login"}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            <span>Create Free Account</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

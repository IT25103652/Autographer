"use client";

import React, { useState } from "react";
import { 
  Mail, 
  MessageSquare, 
  Send, 
  MapPin, 
  Phone,
  Clock,
  CheckCircle,
  X
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields");
      return;
    }

    // Simulate form submission
    setSubmitted(true);
    setError("");
    setFormData({ name: "", email: "", subject: "", message: "" });
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "support@autographer.me",
      description: "We'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      description: "Mon-Fri, 9am-6pm EST"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "San Francisco, CA",
      description: "Remote-first team"
    }
  ];

  const faqs = [
    {
      question: "How do I get started with Autographer?",
      answer: "Simply create an account, upload your photo, and choose an AI tool. Each tool has a credit cost that's clearly displayed before you generate."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards via Stripe, and PayHere for Sri Lankan customers. You can also earn free credits through our referral program."
    },
    {
      question: "Can I use the generated images commercially?",
      answer: "Yes! Once you generate an image, you own full commercial rights to use it however you like."
    },
    {
      question: "How do the AI tools work?",
      answer: "Our AI models are trained on millions of professional photos. They analyze your image and apply professional lighting, composition, and style transformations."
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
            <MessageSquare className="h-4 w-4 text-indigo-400" />
            <span className="text-indigo-300 text-sm font-semibold">Contact Us</span>
          </div>
          <h1 className="font-display font-black text-5xl md:text-6xl text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <div key={index} className="glass-card border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all duration-300">
              <div className="p-3 bg-indigo-500/10 rounded-xl w-fit mx-auto mb-4">
                <method.icon className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">{method.title}</h3>
              <p className="text-indigo-400 font-semibold mb-2">{method.value}</p>
              <p className="text-slate-500 text-sm">{method.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="glass-card border border-white/10 rounded-3xl p-8 md:p-12">
          <h2 className="font-display font-bold text-3xl text-white mb-6">Send us a Message</h2>
          
          {submitted && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-300 font-semibold">Message sent successfully! We'll get back to you soon.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3">
              <X className="h-5 w-5 text-red-400" />
              <span className="text-red-300 font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="" className="bg-slate-900">Select a subject</option>
                <option value="general" className="bg-slate-900">General Inquiry</option>
                <option value="support" className="bg-slate-900">Technical Support</option>
                <option value="billing" className="bg-slate-900">Billing Question</option>
                <option value="partnership" className="bg-slate-900">Partnership Opportunity</option>
                <option value="feedback" className="bg-slate-900">Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
            >
              <Send className="h-5 w-5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-400">Quick answers to common questions</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-card border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
              <h3 className="font-display font-bold text-lg text-white mb-2">{faq.question}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Business Hours */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="glass-card border border-white/10 rounded-3xl p-8 md:p-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Clock className="h-6 w-6 text-indigo-400" />
            <h2 className="font-display font-bold text-2xl text-white">Business Hours</h2>
          </div>
          <div className="text-center space-y-2">
            <p className="text-slate-300">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
            <p className="text-slate-300">Saturday: 10:00 AM - 4:00 PM EST</p>
            <p className="text-slate-300">Sunday: Closed</p>
            <p className="text-slate-500 text-sm mt-4">Response time: Within 24 hours on business days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

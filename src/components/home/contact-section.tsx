"use client";

import { useState } from "react";
import OrangeButton from "@/components/buttons/orange-button";
import { Filter } from "bad-words";
import * as LeoProfanity from "leo-profanity";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // Security constants
  const MAX_MESSAGE_LENGTH = 1000;
  const MAX_SUBJECT_LENGTH = 200;
  const MAX_NAME_LENGTH = 100;
  const MIN_SUBMIT_INTERVAL = 30000; // 30 seconds between submissions

  // Email validation regex
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Name validation regex (only letters, spaces, hyphens, apostrophes)
  const NAME_REGEX = /^[a-zA-Z\s'-]+$/;
  
  // Initialize profanity filters
  const badWordsFilter = new Filter();
  
  // Configure leo-profanity for additional filtering
  LeoProfanity.loadDictionary("en"); // Load English dictionary
  LeoProfanity.add(["terrorism", "terrorist", "violence", "violent", "weapon", "bomb", "explosive"]);

  // Sanitize input to prevent XSS
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
    // Note: Removed .trim() to allow spaces during typing
  };

  // Advanced profanity and inappropriate content detection
  const containsInappropriateContent = (text: string): boolean => {
    if (!text || text.trim().length === 0) return false;
    
    // Check with bad-words library (handles obfuscation like f*ck, b1tch)
    const hasBadWords = badWordsFilter.isProfane(text);
    
    // Check with leo-profanity (additional coverage)
    const hasLeoProfanity = LeoProfanity.check(text);
    
    // Additional patterns for violence and threats
    const violencePatterns = [
      /\b(kill|murder|death|die|hurt|harm|attack|assault|threat|bomb|weapon|gun|knife|stab|shoot|violence|violent)\b/i,
      /\b(terrorist|terrorism|explode|explosive)\b/i,
      // Handle obfuscated versions
      /k[!1i]ll/i,
      /d[!1i]e/i,
      /h[4@]rm/i,
      /v[!1i]olence/i,
      /terr[0o]r/i
    ];
    
    // Additional profanity patterns to catch creative obfuscation
    const profanityPatterns = [
      // f*ck variations
      /f[\*\!@#\$%\^&\-_\.u\d]*ck/i,
      /f[\*\!@#\$%\^&\-_\.u\d]*k/i,
      // b*tch variations  
      /b[\*\!@#\$%\^&\-_\.i\d]*tch/i,
      /b[\*\!@#\$%\^&\-_\.i\d]*ch/i,
      // sh*t variations
      /sh[\*\!@#\$%\^&\-_\.i\d]*t/i,
      // a**hole variations
      /a[\*\!@#\$%\^&\-_\.s\d]*hole/i,
      /a[\*\!@#\$%\^&\-_\.s\d]*h[o0]le/i,
      // damn variations
      /d[\*\!@#\$%\^&\-_\.a\d]*mn/i,
      /d[\*\!@#\$%\^&\-_\.a\d]*m/i,
      // Common leetspeak substitutions
      /fu[c0]k/i,
      /b[i1]tch/i,
      /sh[i1]t/i,
      /d[a4]mn/i,
      /h[3e]ll/i,
      /cr[a4]p/i,
      /[a4]ssh[o0]le/i,
      /b[a4]st[a4]rd/i,
      /p[i1]ss/i,
      /st[u0]p[i1]d/i,
      /[i1]d[i1][o0]t/i,
      /m[o0]r[o0]n/i,
      /d[u0]mb/i
    ];
    
    const hasViolentContent = violencePatterns.some(pattern => pattern.test(text));
    const hasProfanityPatterns = profanityPatterns.some(pattern => pattern.test(text));
    
    return hasBadWords || hasLeoProfanity || hasViolentContent || hasProfanityPatterns;
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > MAX_NAME_LENGTH) {
      newErrors.name = `Name must be less than ${MAX_NAME_LENGTH} characters`;
    } else if (!NAME_REGEX.test(formData.name)) {
      newErrors.name = "Name can only contain letters, spaces, hyphens, and apostrophes";
    } else if (containsInappropriateContent(formData.name)) {
      newErrors.name = "Name contains inappropriate language";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (containsInappropriateContent(formData.email)) {
      newErrors.email = "Email contains inappropriate language";
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length > MAX_SUBJECT_LENGTH) {
      newErrors.subject = `Subject must be less than ${MAX_SUBJECT_LENGTH} characters`;
    } else if (containsInappropriateContent(formData.subject)) {
      newErrors.subject = "Subject contains inappropriate language";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length > MAX_MESSAGE_LENGTH) {
      newErrors.message = `Message must be less than ${MAX_MESSAGE_LENGTH} characters`;
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (containsInappropriateContent(formData.message)) {
      newErrors.message = "Message contains inappropriate language";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting check
    const currentTime = Date.now();
    if (currentTime - lastSubmitTime < MIN_SUBMIT_INTERVAL) {
      setErrors({ message: "Please wait before submitting another message" });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Here you would typically send the data to your backend API
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus("success");
      setLastSubmitTime(currentTime);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
      
    } catch {
      setSubmitStatus("error");
      setErrors({ message: "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 dashboard-bg-primary">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-h2-size font-weight-bold text-darkest-green mb-4">
            Contact Us
          </h2>
          <p className="text-body4-size text-dark-green max-w-2xl mx-auto">
            Have questions or need support? We&apos;re here to help. Send us a message and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="std-form-label">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                maxLength={MAX_NAME_LENGTH}
                className={`std-form-input dashboard-input ${errors.name ? "border-red-500" : ""}`}
                placeholder="Enter your full name"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="std-form-label">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`std-form-input dashboard-input ${errors.email ? "border-red-500" : ""}`}
                placeholder="Enter your email address"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="std-form-label">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                maxLength={MAX_SUBJECT_LENGTH}
                className={`std-form-input dashboard-input ${errors.subject ? "border-red-500" : ""}`}
                placeholder="Enter the subject of your message"
                disabled={isSubmitting}
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {formData.subject.length}/{MAX_SUBJECT_LENGTH} characters
              </p>
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="std-form-label">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                maxLength={MAX_MESSAGE_LENGTH}
                rows={6}
                className={`std-form-input dashboard-input resize-none ${errors.message ? "border-red-500" : ""}`}
                placeholder="Enter your message here..."
                disabled={isSubmitting}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {formData.message.length}/{MAX_MESSAGE_LENGTH} characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-4">
              <OrangeButton
                variant="action"
                type="submit"
                disabled={isSubmitting}
                className="w-full max-w-xs"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </OrangeButton>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="text-green-600 text-center bg-green-50 p-3 rounded-lg border border-green-200">
                  <p>Thank you! Your message has been sent successfully.</p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  <p>There was an error sending your message. Please try again.</p>
                </div>
              )}
            </div>
          </form>

          {/* Additional Contact Information */}
          <div className="mt-12 text-center border-t pt-8">
            <h3 className="text-h5-size font-weight-semibold text-darkest-green mb-4">
              Other Ways to Reach Us
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-dark-green">
              <div>
                <h4 className="font-weight-semibold mb-2">Email Support</h4>
                <p className="text-body5-size">support@caremyway.com</p>
              </div>
              <div>
                <h4 className="font-weight-semibold mb-2">Phone Support</h4>
                <p className="text-body5-size">1-800-CARE-WAY</p>
                <p className="text-sm text-gray-600">Monday - Friday, 9 AM - 5 PM EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
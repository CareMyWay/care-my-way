"use client";

import { useState } from "react";
import OrangeButton from "@/components/buttons/orange-button";
import { Filter } from "bad-words";
import * as LeoProfanity from "leo-profanity";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_SUBJECT_LENGTH = 200;
const MAX_NAME_LENGTH = 100;
const MIN_SUBMIT_INTERVAL = 30000; // 30 seconds between submissions

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

const badWordsFilter = new Filter();
LeoProfanity.loadDictionary("en");
LeoProfanity.add([
  "terrorism",
  "terrorist",
  "violence",
  "violent",
  "weapon",
  "bomb",
  "explosive",
]);

const violencePatterns = [
  /\b(kill|murder|death|die|hurt|harm|attack|assault|threat|bomb|weapon|gun|knife|stab|shoot|violence|violent)\b/i,
  /\b(terrorist|terrorism|explode|explosive)\b/i,
  /k[!1i]ll/i,
  /d[!1i]e/i,
  /h[4@]rm/i,
  /v[!1i]olence/i,
  /terr[0o]r/i,
];

const profanityPatterns = [
  /f[\*\!@#\$%\^&\-_\.u\d]*ck/i,
  /b[\*\!@#\$%\^&\-_\.i\d]*tch/i,
  /sh[\*\!@#\$%\^&\-_\.i\d]*t/i,
  /a[\*\!@#\$%\^&\-_\.s\d]*h[o0]le/i,
  /d[\*\!@#\$%\^&\-_\.a\d]*mn/i,
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
  /d[u0]mb/i,
];

const sanitizeInput = (input: string) =>
  input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\//g, "&#x2F;");

const containsInappropriateContent = (text: string) =>
  !!text &&
  (badWordsFilter.isProfane(text) ||
    LeoProfanity.check(text) ||
    violencePatterns.some((p) => p.test(text)) ||
    profanityPatterns.some((p) => p.test(text)));

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

// =====================
// Reusable Field Component
// =====================
function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  maxLength,
  rows,
  disabled,
}: {
  label: string;
  name: keyof FormData;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  error?: string;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  disabled?: boolean;
}) {
  const InputTag = rows ? "textarea" : "input";
  return (
    <div>
      <label htmlFor={name} className="std-form-label">
        {label}
      </label>
      <InputTag
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        rows={rows}
        type={rows ? undefined : type}
        placeholder={placeholder}
        disabled={disabled}
        className={`std-form-input dashboard-input ${
          error ? "border-red-500" : ""
        } ${rows ? "resize-none" : ""}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {maxLength && (
        <p className="text-sm text-gray-500 mt-1">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
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
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: sanitizeInput(value) }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    const rules: Record<keyof FormData, () => void> = {
      name: () => {
        if (!formData.name.trim()) newErrors.name = "Name is required";
        else if (formData.name.length > MAX_NAME_LENGTH)
          newErrors.name = `Max ${MAX_NAME_LENGTH} characters`;
        else if (!NAME_REGEX.test(formData.name))
          newErrors.name =
            "Only letters, spaces, hyphens, and apostrophes allowed";
        else if (containsInappropriateContent(formData.name))
          newErrors.name = "Contains inappropriate language";
      },
      email: () => {
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!EMAIL_REGEX.test(formData.email))
          newErrors.email = "Invalid email address";
        else if (containsInappropriateContent(formData.email))
          newErrors.email = "Contains inappropriate language";
      },
      subject: () => {
        if (!formData.subject.trim()) newErrors.subject = "Subject is required";
        else if (formData.subject.length > MAX_SUBJECT_LENGTH)
          newErrors.subject = `Max ${MAX_SUBJECT_LENGTH} characters`;
        else if (containsInappropriateContent(formData.subject))
          newErrors.subject = "Contains inappropriate language";
      },
      message: () => {
        if (!formData.message.trim()) newErrors.message = "Message is required";
        else if (formData.message.length > MAX_MESSAGE_LENGTH)
          newErrors.message = `Max ${MAX_MESSAGE_LENGTH} characters`;
        else if (formData.message.length < 10)
          newErrors.message = "Must be at least 10 characters";
        else if (containsInappropriateContent(formData.message))
          newErrors.message = "Contains inappropriate language";
      },
    };

    (Object.keys(rules) as (keyof FormData)[]).forEach((field) =>
      rules[field]()
    );
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Date.now() - lastSubmitTime < MIN_SUBMIT_INTERVAL) {
      setErrors({ message: "Please wait before submitting again" });
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await new Promise((r) => setTimeout(r, 2000)); // mock send
      setSubmitStatus("success");
      setLastSubmitTime(Date.now());
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch {
      setSubmitStatus("error");
      setErrors({ message: "Failed to send message" });
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
            Have questions or need support? Contact Us.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Full Name *"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              maxLength={MAX_NAME_LENGTH}
              placeholder="Enter your full name"
              error={errors.name}
              disabled={isSubmitting}
            />
            <FormField
              label="Email Address *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              error={errors.email}
              disabled={isSubmitting}
            />
            <FormField
              label="Subject *"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              maxLength={MAX_SUBJECT_LENGTH}
              placeholder="Enter the subject"
              error={errors.subject}
              disabled={isSubmitting}
            />
            <FormField
              label="Message *"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              maxLength={MAX_MESSAGE_LENGTH}
              rows={6}
              placeholder="Enter your message"
              error={errors.message}
              disabled={isSubmitting}
            />

            <div className="flex flex-col items-center gap-4">
              <OrangeButton
                variant="action"
                type="submit"
                disabled={isSubmitting}
                className="w-full max-w-xs"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </OrangeButton>
              {submitStatus === "success" && (
                <p className="text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                  Thank you! Your message has been sent successfully.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-center">
                  There was an error sending your message. Please try again.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

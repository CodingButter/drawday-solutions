'use client';

import { useState } from 'react';
import { Button, Input, Label, Textarea, Alert, AlertDescription } from '@raffle-spinner/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@raffle-spinner/ui';
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Building,
  Globe,
  MessageSquare,
} from 'lucide-react';

export default function ContactFormClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    service_interest: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const serviceOptions = [
    { value: 'live_draw_software', label: 'Live Draw Software' },
    { value: 'web_development', label: 'Web Development' },
    { value: 'streaming_production', label: 'Streaming Production' },
    { value: 'full_package', label: 'Full Package Solution' },
    { value: 'consulting', label: 'Technical Consulting' },
    { value: 'other', label: 'Other' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service_interest: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.service_interest || !formData.message) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all required fields.',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      return false;
    }

    if (formData.message.length < 10) {
      setSubmitStatus({
        type: 'error',
        message: 'Message must be at least 10 characters long.',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset status
    setSubmitStatus({ type: null, message: '' });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Thank you for your message! We will get back to you soon.',
        });

        // Clear form
        setFormData({
          name: '',
          email: '',
          company: '',
          website: '',
          service_interest: '',
          message: '',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Alert */}
      {submitStatus.type && (
        <Alert
          className={`${
            submitStatus.type === 'success'
              ? 'bg-green-500/10 border-green-500/20'
              : 'bg-red-500/10 border-red-500/20'
          }`}
        >
          {submitStatus.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-400" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-400" />
          )}
          <AlertDescription
            className={submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}
          >
            {submitStatus.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Name and Email Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name" className="text-white mb-2">
            Name *
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="pl-10 bg-gray-900 border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
              placeholder="Your full name"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-white mb-2">
            Email *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10 bg-gray-900 border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Company and Website Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="company" className="text-white mb-2">
            Company
          </Label>
          <div className="relative">
            <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleInputChange}
              className="pl-10 bg-gray-900 border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
              placeholder="Your company name"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="website" className="text-white mb-2">
            Website
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
              className="pl-10 bg-gray-900 border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
              placeholder="https://example.com"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Service Interest Dropdown */}
      <div>
        <Label htmlFor="service" className="text-white mb-2">
          Service Interest *
        </Label>
        <Select
          value={formData.service_interest}
          onValueChange={handleSelectChange}
          disabled={isSubmitting}
        >
          <SelectTrigger
            id="service"
            className="bg-gray-900 border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
          >
            <SelectValue placeholder="Select a service you're interested in" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-800">
            {serviceOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-white hover:bg-gray-800"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Message Field */}
      <div>
        <Label htmlFor="message" className="text-white mb-2">
          Message *
        </Label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="pl-10 min-h-[150px] bg-gray-900 border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
            placeholder="Tell us about your project and how we can help..."
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12 text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>

      {/* Privacy Note */}
      <p className="text-sm text-gray-500 text-center">
        By submitting this form, you agree to our privacy policy. We respect your data and will
        never share it with third parties.
      </p>
    </form>
  );
}

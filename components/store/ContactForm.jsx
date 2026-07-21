"use client";

import { useState } from "react";
import { MdSend as Send, MdLoop as Loader2 } from 'react-icons/md';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Mock submit delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border/40 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl font-bold">Send Us a Message</h3>
        <p className="text-xs text-muted-foreground">
          Fill out the form below and our team will get back to you within 24 hours.
        </p>
      </div>

      {success ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl space-y-2">
          <p className="text-sm font-semibold">Message sent successfully!</p>
          <p className="text-xs text-muted-foreground">
            Thank you for contacting us. We will get back to you as soon as possible.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSuccess(false)}
            className="mt-2 text-emerald-600 hover:text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/10"
          >
            Send another message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Full Name</Label>
              <Input
                id="contactName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email Address</Label>
              <Input
                id="contactEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactSubject">Subject</Label>
            <Input
              id="contactSubject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="How can we help you?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactMessage">Message</Label>
            <textarea
              id="contactMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              required
              rows={5}
              className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground"
            />
          </div>

          <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/95 text-white rounded-full">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

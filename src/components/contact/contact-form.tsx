"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useContactStore } from "@/stores/contact-store";

export function ContactForm() {
  const sendMessage = useContactStore((s) => s.sendMessage);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sent, setSent] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage({ name, email, subject, message });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-card border border-success/30 bg-success/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden="true" />
        <h2 className="mt-3 font-display text-lg text-charcoal">Message Sent</h2>
        <p className="mt-2 text-sm text-body">Thanks for reaching out — our team will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <Button type="submit" size="lg" className="w-full">Send Message</Button>
    </form>
  );
}

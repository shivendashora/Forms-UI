"use client";

import { useState, KeyboardEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchWithLoader } from "@/app/utils/fetchWithLoader";
import { X } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string | null | undefined;
}

export default function ShareDialog({
  open,
  onOpenChange,
  formId,
}: Readonly<ShareDialogProps>) {
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // Filter out undefined formId
  const validFormId = formId ?? null;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim();
    
    if (!trimmedEmail) return;
    
    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (emails.includes(trimmedEmail)) {
      setError("This email is already added");
      return;
    }

    setEmails([...emails, trimmedEmail]);
    setEmailInput("");
    setError("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleShare = async () => {
    if (emails.length === 0) {
      setError("Please add at least one email address");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // API Payload:
      // {
      //   "formId": "123",
      //   "emails": ["test@example.com", "user@example.com"]
      // }
      const response = await fetchWithLoader(`${API_URL}/forms/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: validFormId,
          emails: emails,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to share form");
      }

      const data = await response.json();
      console.log("Share response:", data);
      
      setSuccess("Form shared successfully!");
      setEmails([]);
      
      // Close dialog after a short delay
      setTimeout(() => {
        onOpenChange(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Share error:", err);
      setError("Failed to share form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmailInput("");
    setEmails([]);
    setError("");
    setSuccess("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-600 border-gray-500">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">Share Form</DialogTitle>
          <DialogDescription className="text-gray-300">
            Enter email addresses to share this form with. You can add multiple email addresses.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Email Input with Horizontal Scroll Tags */}
          <div className="flex flex-col gap-2">
            {/* Container with horizontal scroll for email tags */}
            <div className="flex flex-wrap gap-2 p-2 border-2 border-gray-300 rounded-md bg-white min-h-[42px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {emails.map((email, index) => (
                <div
                  key={`${email}-${index}`}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-100 border border-blue-300 rounded-full text-xs text-blue-800 whitespace-nowrap"
                >
                  <span className="max-w-[120px] truncate">{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="text-blue-500 hover:text-blue-700 transition-colors flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {/* Input field that grows to fill remaining space */}
              <input
                type="email"
                placeholder={emails.length === 0 ? "Enter email address and press Enter" : ""}
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-[150px] border-none outline-none text-black placeholder:text-gray-400 bg-transparent py-1"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {/* Success Message */}
          {success && (
            <p className="text-sm text-green-400">{success}</p>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="bg-gray-500 hover:bg-gray-400 text-white border-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            disabled={emails.length === 0 || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {isSubmitting ? "Sending..." : "Send Mail"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

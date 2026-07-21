"use client";

import { useState } from "react";
import { MdAutoAwesome as Sparkles, MdLoop as Loader2, MdSend as Send } from 'react-icons/md';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscribed(true);
      setEmail("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-background">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
        <Sparkles className="h-8 w-8" />
      </div>
      
      <h1 className="font-serif text-4xl sm:text-6xl font-bold text-foreground mb-4 leading-tight">
        Something Beautiful <br/>
        Is Coming Soon
      </h1>
      
      <p className="text-sm text-muted-foreground max-w-md mb-10">
        Our new jewelry and accessories collection is launching soon. Join our list to get exclusive sneak peeks, early access, and launch day styling tips.
      </p>

      {subscribed ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full text-sm font-semibold max-w-sm px-8">
          Thank you! We'll notify you as soon as we launch.
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="px-5 py-3 rounded-full border border-border bg-white placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50 flex-1 text-foreground"
            required
          />
          <Button 
            type="submit" 
            disabled={loading} 
            className="rounded-full bg-primary hover:bg-primary/95 text-white shadow-none px-6 h-12 shrink-0 font-semibold text-sm"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Notify Me
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

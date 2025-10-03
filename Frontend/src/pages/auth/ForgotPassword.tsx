import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { KeyRound, Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Replace with Supabase call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setEmailSent(true);
    toast({
      title: "Reset Link Sent!",
      description: "Please check your email for password reset instructions.",
    });

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-soft flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16 flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Forgot Password?
              </h1>
              <p className="text-lg text-muted-foreground">
                No worries, we'll help you reset it
              </p>
            </div>

            <Card className="border-2 border-brand-red bg-card-light backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="w-6 h-6 text-brand-red" />
                  Reset Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!emailSent ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="border-2 border-brand-red/30 focus:border-brand-red bg-background pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        We'll send you a link to reset your password
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-semibold py-3 
                               hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-brand-red/25"
                    >
                      {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                      <Mail className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="text-lg font-semibold">Check Your Email</h3>
                    <p className="text-muted-foreground">
                      We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <div className="bg-background/50 rounded-lg p-4 text-sm text-muted-foreground">
                      <p>Didn't receive the email? Check your spam folder or try again in a few minutes.</p>
                    </div>
                  </motion.div>
                )}

                <div className="mt-6 text-center">
                  <Link 
                    to="/auth/login" 
                    className="inline-flex items-center gap-2 text-brand-red hover:underline font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
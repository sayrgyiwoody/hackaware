"use client";

import type React from "react";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield,
  ArrowLeft,
  ArrowRight,
  User,
  Globe,
  Code,
  Eye,
  AlertTriangle,
  BookOpen,
  Zap,
  CheckCircle,
  Star,
} from "lucide-react";
import Link from "next/link";

type UserInterest = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: "security" | "development" | "privacy" | "learning";
};

type ExpertiseLevel = {
  id: string;
  label: string;
  description: string;
  requirements: string[];
  color: string;
};

const userInterests: UserInterest[] = [
  {
    id: "web-security",
    label: "Web Application Security",
    description:
      "Learn about XSS, SQL injection, CSRF, and other web vulnerabilities",
    icon: <Shield className="h-5 w-5" />,
    category: "security",
  },
  {
    id: "privacy-protection",
    label: "Privacy & Data Protection",
    description:
      "Understanding GDPR, data tracking, and privacy-preserving technologies",
    icon: <Eye className="h-5 w-5" />,
    category: "privacy",
  },
  {
    id: "secure-coding",
    label: "Secure Coding Practices",
    description:
      "Writing secure code and avoiding common programming vulnerabilities",
    icon: <Code className="h-5 w-5" />,
    category: "development",
  },
  {
    id: "network-security",
    label: "Network Security",
    description:
      "Firewalls, VPNs, network protocols, and infrastructure security",
    icon: <Globe className="h-5 w-5" />,
    category: "security",
  },
  {
    id: "incident-response",
    label: "Incident Response",
    description: "How to respond to security breaches and cyber attacks",
    icon: <AlertTriangle className="h-5 w-5" />,
    category: "security",
  },
  {
    id: "cybersecurity-education",
    label: "Cybersecurity Education",
    description: "Teaching others about security and building awareness",
    icon: <BookOpen className="h-5 w-5" />,
    category: "learning",
  },
  {
    id: "penetration-testing",
    label: "Penetration Testing",
    description: "Ethical hacking and vulnerability assessment techniques",
    icon: <Zap className="h-5 w-5" />,
    category: "security",
  },
  {
    id: "compliance-regulations",
    label: "Compliance & Regulations",
    description:
      "Understanding security standards, audits, and regulatory requirements",
    icon: <CheckCircle className="h-5 w-5" />,
    category: "learning",
  },
];

const expertiseLevels: ExpertiseLevel[] = [
  {
    id: "beginner",
    label: "Beginner",
    description: "New to cybersecurity, looking to learn the basics",
    requirements: [
      "Little to no cybersecurity experience",
      "Want to understand basic security concepts",
      "Looking for simple explanations and guidance",
    ],
    color: "bg-green-500/20 border-green-500/30 text-green-400",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Some experience with security concepts and tools",
    requirements: [
      "Basic understanding of security principles",
      "Some experience with security tools",
      "Can follow technical discussions",
    ],
    color: "bg-blue-500/20 border-blue-500/30 text-blue-400",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Experienced professional seeking specialized knowledge",
    requirements: [
      "Strong technical background in security",
      "Experience with security implementations",
      "Looking for advanced techniques and insights",
    ],
    color: "bg-purple-500/20 border-purple-500/30 text-purple-400",
  },
  {
    id: "expert",
    label: "Expert",
    description: "Security professional or researcher",
    requirements: [
      "Extensive cybersecurity experience",
      "Professional security role or research",
      "Contributing to security community",
    ],
    color: "bg-amber-500/20 border-amber-500/30 text-amber-400",
  },
];

export default function RegisterPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Step 2: Interests
    selectedInterests: [] as string[],
    // Step 3: Expertise
    expertiseLevel: "",
    // Step 4: Goals
    goals: "",
    learningPreference: "",
    notifications: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.fullName.trim())
          newErrors.fullName = "Full name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = "Invalid email format";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 8)
          newErrors.password = "Password must be at least 8 characters";
        if (formData.password !== formData.confirmPassword)
          newErrors.confirmPassword = "Passwords don't match";
        break;
      case 2:
        if (formData.selectedInterests.length === 0)
          newErrors.interests = "Please select at least one interest";
        break;
      case 3:
        if (!formData.expertiseLevel)
          newErrors.expertiseLevel = "Please select your expertise level";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleInterestToggle = (interestId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interestId)
        ? prev.selectedInterests.filter((id) => id !== interestId)
        : [...prev.selectedInterests, interestId],
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setIsSubmitting(true);

    try {
      const payload = {
        username: formData.fullName,
        email: formData.email,
        expertise: formData.expertiseLevel,
        learning_style: formData.learningPreference,
        password: formData.password,
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      console.log("Submitting registration:", payload);

      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include", // VERY IMPORTANT to receive HttpOnly cookie
      });

      if (!res.ok) throw new Error("Registration failed");

      // JWT is already stored in HttpOnly cookie (safe)

      router.push("/chat");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInterestsByCategory = (category: string) => {
    return userInterests.filter((interest) => interest.category === category);
  };

  const selectedExpertise = expertiseLevels.find(
    (level) => level.id === formData.expertiseLevel
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-cyan-500 mr-2" />
              <span className="font-bold">HackAware Registration</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl py-8 px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Registration Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-700">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
          </Progress>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-cyan-500" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Let's start with your basic details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-400">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    className="bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Create a strong password"
                    className="bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-400">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm your password"
                    className="bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-500" />
                  Password Security Tips
                </h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Use at least 8 characters</li>
                  <li>• Include uppercase and lowercase letters</li>
                  <li>• Add numbers and special characters</li>
                  <li>• Avoid common words or personal information</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Interests Selection */}
        {currentStep === 2 && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-cyan-500" />
                Your Interests
              </CardTitle>
              <CardDescription>
                Select the cybersecurity topics you're most interested in
                learning about
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {errors.interests && (
                <p className="text-sm text-red-400">{errors.interests}</p>
              )}

              {/* Security Category */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-400" />
                  Security & Vulnerabilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getInterestsByCategory("security").map((interest) => (
                    <div
                      key={interest.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.selectedInterests.includes(interest.id)
                          ? "border-cyan-500 bg-cyan-500/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                      onClick={() => handleInterestToggle(interest.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.selectedInterests.includes(
                            interest.id
                          )}
                          onChange={() => handleInterestToggle(interest.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-red-400">{interest.icon}</div>
                            <h4 className="font-medium">{interest.label}</h4>
                          </div>
                          <p className="text-sm text-gray-400">
                            {interest.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Development Category */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-400" />
                  Development & Coding
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getInterestsByCategory("development").map((interest) => (
                    <div
                      key={interest.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.selectedInterests.includes(interest.id)
                          ? "border-cyan-500 bg-cyan-500/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                      onClick={() => handleInterestToggle(interest.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.selectedInterests.includes(
                            interest.id
                          )}
                          onChange={() => handleInterestToggle(interest.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-blue-400">{interest.icon}</div>
                            <h4 className="font-medium">{interest.label}</h4>
                          </div>
                          <p className="text-sm text-gray-400">
                            {interest.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Category */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-400" />
                  Privacy & Data Protection
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getInterestsByCategory("privacy").map((interest) => (
                    <div
                      key={interest.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.selectedInterests.includes(interest.id)
                          ? "border-cyan-500 bg-cyan-500/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                      onClick={() => handleInterestToggle(interest.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.selectedInterests.includes(
                            interest.id
                          )}
                          onChange={() => handleInterestToggle(interest.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-green-400">
                              {interest.icon}
                            </div>
                            <h4 className="font-medium">{interest.label}</h4>
                          </div>
                          <p className="text-sm text-gray-400">
                            {interest.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Category */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  Learning & Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getInterestsByCategory("learning").map((interest) => (
                    <div
                      key={interest.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.selectedInterests.includes(interest.id)
                          ? "border-cyan-500 bg-cyan-500/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                      onClick={() => handleInterestToggle(interest.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.selectedInterests.includes(
                            interest.id
                          )}
                          onChange={() => handleInterestToggle(interest.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-purple-400">
                              {interest.icon}
                            </div>
                            <h4 className="font-medium">{interest.label}</h4>
                          </div>
                          <p className="text-sm text-gray-400">
                            {interest.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {formData.selectedInterests.length > 0 && (
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                  <h4 className="font-medium mb-2">
                    Selected Interests ({formData.selectedInterests.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedInterests.map((interestId) => {
                      const interest = userInterests.find(
                        (i) => i.id === interestId
                      );
                      return (
                        <Badge
                          key={interestId}
                          variant="outline"
                          className="border-cyan-500 text-cyan-500"
                        >
                          {interest?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Expertise Level */}
        {currentStep === 3 && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan-500" />
                Your Expertise Level
              </CardTitle>
              <CardDescription>
                Help us understand your current cybersecurity knowledge level to
                provide personalized content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {errors.expertiseLevel && (
                <p className="text-sm text-red-400">{errors.expertiseLevel}</p>
              )}

              <RadioGroup
                value={formData.expertiseLevel}
                onValueChange={(value) =>
                  setFormData({ ...formData, expertiseLevel: value })
                }
                className="space-y-4"
              >
                {expertiseLevels.map((level) => (
                  <div key={level.id} className="space-y-2">
                    <div
                      className={`p-6 rounded-lg border cursor-pointer transition-all ${
                        formData.expertiseLevel === level.id
                          ? "border-cyan-500 bg-cyan-500/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, expertiseLevel: level.id })
                      }
                    >
                      <div className="flex items-start gap-4">
                        <RadioGroupItem
                          value={level.id}
                          id={level.id}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className={level.color}>{level.label}</Badge>
                            <h3 className="text-lg font-medium">
                              {level.description}
                            </h3>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-300">
                              This level is for you if:
                            </h4>
                            <ul className="space-y-1">
                              {level.requirements.map((req, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-400 flex items-start gap-2"
                                >
                                  <span className="text-cyan-500 mt-1">•</span>
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              {selectedExpertise && (
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Selected Level: {selectedExpertise.label}
                  </h4>
                  <p className="text-sm text-gray-400">
                    HackAware will customize its explanations and
                    recommendations based on your{" "}
                    {selectedExpertise.label.toLowerCase()} level expertise.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Goals and Preferences */}
        {currentStep === 4 && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-cyan-500" />
                Learning Goals & Preferences
              </CardTitle>
              <CardDescription>
                Tell us about your learning goals and how you prefer to learn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goals">
                  What are your main cybersecurity goals? (Optional)
                </Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) =>
                    setFormData({ ...formData, goals: e.target.value })
                  }
                  placeholder="e.g., Secure my company's website, learn ethical hacking, understand privacy laws..."
                  className="min-h-[100px] bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500"
                />
              </div>

              <div className="space-y-4">
                <Label>How do you prefer to learn?</Label>
                <RadioGroup
                  value={formData.learningPreference}
                  onValueChange={(value) =>
                    setFormData({ ...formData, learningPreference: value })
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interactive" id="interactive" />
                    <Label htmlFor="interactive">
                      Interactive demos and hands-on examples
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="explanations" id="explanations" />
                    <Label htmlFor="explanations">
                      Detailed explanations and theory
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="practical" id="practical" />
                    <Label htmlFor="practical">
                      Practical solutions and quick fixes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mixed" id="mixed" />
                    <Label htmlFor="mixed">Mix of all approaches</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications"
                  checked={formData.notifications}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, notifications: !!checked })
                  }
                />
                <Label htmlFor="notifications" className="text-sm">
                  Send me security alerts and learning recommendations
                </Label>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-500" />
                  Your Personalized HackAware Experience
                </h4>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>
                    <strong>Interests:</strong>{" "}
                    {formData.selectedInterests.length} topics selected
                  </p>
                  <p>
                    <strong>Level:</strong>{" "}
                    {selectedExpertise?.label || "Not selected"}
                  </p>
                  <p>
                    <strong>Learning Style:</strong>{" "}
                    {formData.learningPreference
                      ? formData.learningPreference.charAt(0).toUpperCase() +
                        formData.learningPreference.slice(1)
                      : "Not selected"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-gray-600 hover:bg-gray-800 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              {isSubmitting ? "Creating Account..." : "Complete Registration"}
              {!isSubmitting && <CheckCircle className="h-4 w-4 ml-2" />}
            </Button>
          )}
        </div>

        {/* Already have account */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-500 hover:text-cyan-400">
              Sign in here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

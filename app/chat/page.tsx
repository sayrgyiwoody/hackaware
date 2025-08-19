"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  Send,
  ArrowLeft,
  Scan,
  Eye,
  Code,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  CircleStop,
  OctagonMinus,
  CircleSlash2,
} from "lucide-react";
import Link from "next/link";
import { ChatMessage } from "@/components/chat-message";
import { ChatTypingIndicator } from "@/components/chat-typing-indicator";
import { ScanResults } from "@/components/scan-results";
import { SecurityThreatAlert } from "@/components/security-threat-alert";
import { InteractiveDemo } from "@/components/interactive-demo";
import { SecurityQuiz } from "@/components/security-quiz";
import { mockChunks, quizTopics, welcomeMessage } from "./mockdata";
import { MessageType } from "./types";

export default function ChatPage() {
  const [messages, setMessages] = useState<MessageType[]>(welcomeMessage);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [securityLevel, setSecurityLevel] = useState("Beginner");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userInput = "userInput"; // Declare userInput variable
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [urlToScan, setUrlToScan] = useState("");
  const [isUrlScanning, setIsUrlScanning] = useState(false);
  const [urlScanResult, setUrlScanResult] = useState<any>(null);
  const [urlScanProgress, setUrlScanProgress] = useState(0);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const stopRef = useRef(false);

  // Quiz state variables
  const [currentQuizTopic, setCurrentQuizTopic] = useState<string | null>(null);
  const [currentQuizDifficulty, setCurrentQuizDifficulty] =
    useState<string>("beginner");
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [showQuizSelection, setShowQuizSelection] = useState(true);
  const [quizResults, setQuizResults] = useState({
    correctAnswers: 0,
    totalQuestions: 0,
    answers: [] as boolean[],
  });
  const [totalScore, setTotalScore] = useState({
    totalCorrect: 0,
    totalQuestions: 0,
    completedQuizzes: 0,
  });
  const [quizLength, setQuizLength] = useState(5);

  const autoSuggestQueries = [
    "Scan facebook.com for security vulnerabilities",
    "Explain XSS attacks and prevention",
    "Show me SQL injection demo",
    "What are security headers?",
    "How does HTTPS work?",
    "Analyze privacy tracking on websites",
    "Demonstrate clickjacking attack",
    "Check website for malware",
    "Explain CSRF protection",
    "Show secure coding practices",
    "What is Content Security Policy?",
    "How to prevent data breaches?",
    "Scan google.com for privacy issues",
    "Explain phishing detection",
    "Show password security best practices",
    "What is OWASP Top 10?",
    "How does a Web Application Firewall (WAF) work?",
    "Explain CORS misconfigurations",
    "Check if a site uses HSTS",
    "What are common SSL/TLS vulnerabilities?",
    "Explain session hijacking and prevention",
    "How do cookie security flags (HttpOnly, Secure, SameSite) work?",
    "Detect outdated JavaScript libraries",
    "How to secure APIs against attacks?",
    "Explain directory traversal attacks",
    "What is brute force protection?",
    "Scan a site for open redirects",
    "How to detect hidden iframes?",
    "Explain DNS spoofing and prevention",
    "What are common cloud security risks?",
  ];

  // Auto-end quiz when switching tabs or using other features
  const endCurrentQuiz = () => {
    if (currentQuizTopic && !showQuizSelection) {
      const quizEndMessage: MessageType = {
        id: Date.now().toString(),
        role: "bot",
        content: `📚 **Quiz Ended**\n\nYour ${
          quizTopics.find((t) => t.id === currentQuizTopic)?.title
        } quiz has been automatically ended since you switched to another feature.\n\nYou can always restart the quiz from the Security Quiz tab when you're ready to continue learning!`,
        timestamp: new Date(),
        status: "info",
      };
      setMessages((prev) => [...prev, quizEndMessage]);

      // Reset quiz state
      setCurrentQuizTopic(null);
      setCurrentQuizIndex(0);
      setQuizQuestions([]);
      setQuizResults({ correctAnswers: 0, totalQuestions: 0, answers: [] });
      setShowQuizSelection(true);
    }
  };

  // Watch for tab changes and end quiz if needed
  useEffect(() => {
    if (activeTab !== "quiz") {
      endCurrentQuiz();
    }
  }, [activeTab]);

  const filterSuggestions = (inputValue: string) => {
    if (inputValue.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = autoSuggestQueries
      .filter((query) => query.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, 5);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputContainerRef.current &&
        !inputContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const extractUrlFromMessage = (message: string): string | null => {
    const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/g;
    const match = message.match(urlRegex);
    return match ? match[0] : null;
  };

  const isWebsiteScanRequest = (message: string): boolean => {
    const scanKeywords = [
      "scan",
      "check",
      "analyze",
      "audit",
      "test",
      "inspect",
    ];
    const hasKeyword = scanKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword)
    );
    const hasUrl = extractUrlFromMessage(message) !== null;
    return hasKeyword && hasUrl;
  };

  const isSecurityQuestionRequest = (message: string): boolean => {
    const securityKeywords = [
      "xss",
      "sql injection",
      "csrf",
      "security headers",
      "https",
      "ssl",
      "authentication",
      "authorization",
      "vulnerability",
      "exploit",
      "attack",
      "malware",
      "phishing",
    ];
    return securityKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword)
    );
  };

  const isDemoRequest = (message: string): boolean => {
    const demoKeywords = [
      "demo",
      "show me",
      "demonstrate",
      "example",
      "how does",
      "simulate",
    ];
    return demoKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword)
    );
  };

  const isQuizRequest = (message: string): boolean => {
    const quizKeywords = ["quiz", "test me", "challenge", "practice", "learn"];
    return quizKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword)
    );
  };

  const simulateWebsiteScan = (url: string, messageId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 12;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, scanProgress: progress } : msg
        )
      );

      if (progress >= 100) {
        clearInterval(interval);

        setTimeout(() => {
          const scanResults = {
            url: url,
            overallScore: 65,
            privacyScore: 45,
            securityScore: 70,
            performanceScore: 80,
            issues: [
              {
                type: "privacy",
                severity: "high",
                title: "Unauthorized Data Collection",
                description:
                  "Google Analytics and Facebook Pixel are collecting user data without explicit consent",
                impact: "Violates GDPR and user privacy rights",
                fix: "Implement consent management before loading tracking scripts",
                cve: null,
                affectedUsers: "All visitors",
              },
              {
                type: "security",
                severity: "critical",
                title: "Missing Content Security Policy",
                description:
                  "No CSP header detected, allowing arbitrary script execution",
                impact: "Vulnerable to XSS attacks and code injection",
                fix: "Add Content-Security-Policy header with strict directives",
                cve: "CVE-2023-1234",
                affectedUsers: "All users",
              },
              {
                type: "security",
                severity: "medium",
                title: "Outdated JavaScript Libraries",
                description: "jQuery 2.1.4 detected with known vulnerabilities",
                impact: "Potential for DOM-based XSS and prototype pollution",
                fix: "Update to jQuery 3.6+ or migrate to modern alternatives",
                cve: "CVE-2020-11022",
                affectedUsers: "Users with JavaScript enabled",
              },
              {
                type: "configuration",
                severity: "low",
                title: "Missing Security Headers",
                description:
                  "X-Frame-Options and X-Content-Type-Options headers not found",
                impact:
                  "Susceptible to clickjacking and MIME-type confusion attacks",
                fix: "Configure server to send security headers",
                cve: null,
                affectedUsers: "All visitors",
              },
            ],
            recommendations: [
              "Implement a Web Application Firewall (WAF)",
              "Set up Content Security Policy monitoring",
              "Regular security dependency updates",
              "Enable HTTPS Strict Transport Security (HSTS)",
            ],
          };

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    isScanning: false,
                    scanResults: scanResults,
                    content: `🔍 **Security Scan Complete for ${url}**\n\nOverall Security Score: **${scanResults.overallScore}/100**\n\nI found ${scanResults.issues.length} security issues that need attention. This website has some critical vulnerabilities that could put users at risk.`,
                  }
                : msg
            )
          );

          // Add threat alert if critical issues found
          const criticalIssues = scanResults.issues.filter(
            (issue) => issue.severity === "critical"
          );
          if (criticalIssues.length > 0) {
            setTimeout(() => {
              const threatAlert: MessageType = {
                id: (Date.now() + 2).toString(),
                role: "bot",
                content: "🚨 **Critical Security Alert**",
                timestamp: new Date(),
                status: "danger",
                threatAlert: {
                  type: "critical_vulnerability",
                  title: "Critical XSS Vulnerability Detected",
                  description:
                    "This website is vulnerable to Cross-Site Scripting attacks due to missing Content Security Policy",
                  riskLevel: "HIGH",
                  immediateActions: [
                    "Avoid entering sensitive information on this site",
                    "Consider using browser security extensions",
                    "Report this vulnerability to the website owner",
                  ],
                },
              };
              setMessages((prev) => [...prev, threatAlert]);
            }, 1000);
          }

          // Add educational follow-up
          setTimeout(() => {
            const educationalMessage: MessageType = {
              id: (Date.now() + 3).toString(),
              role: "bot",
              content:
                "Would you like me to:\n\n🎓 **Explain** any of these vulnerabilities in detail?\n🛠️ **Show you** how to fix these issues?\n🎯 **Demonstrate** how these attacks work?\n📝 **Generate** a security report for the website owner?",
              timestamp: new Date(),
              icon: "💡",
              status: "info",
            };
            setMessages((prev) => [...prev, educationalMessage]);
          }, 2000);
        }, 500);
      }
    }, 150);
  };

  const generateSecurityDemo = (topic: string) => {
    const demos = {
      xss: {
        title: "Cross-Site Scripting (XSS) Demo",
        description: "See how XSS attacks work and how to prevent them",
        steps: [
          {
            step: 1,
            action: "Attacker finds input field",
            code: "<input type='text' name='search'>",
          },
          {
            step: 2,
            action: "Injects malicious script",
            code: "<script>alert('XSS Attack!')</script>",
          },
          {
            step: 3,
            action: "Script executes in victim's browser",
            code: "// Steals cookies, redirects user, etc.",
          },
          {
            step: 4,
            action: "Prevention with CSP",
            code: "Content-Security-Policy: default-src 'self'",
          },
        ],
        prevention:
          "Always sanitize user input and implement Content Security Policy",
      },
      sql: {
        title: "SQL Injection Demo",
        description: "Understanding SQL injection vulnerabilities",
        steps: [
          {
            step: 1,
            action: "Vulnerable query",
            code: "SELECT * FROM users WHERE id = " + userInput,
          },
          {
            step: 2,
            action: "Malicious input",
            code: "1; DROP TABLE users; --",
          },
          {
            step: 3,
            action: "Resulting query",
            code: "SELECT * FROM users WHERE id = 1; DROP TABLE users; --",
          },
          {
            step: 4,
            action: "Safe parameterized query",
            code: "SELECT * FROM users WHERE id = ?",
          },
        ],
        prevention: "Use parameterized queries and input validation",
      },
    };
    return demos[topic as keyof typeof demos] || demos.xss;
  };

  const startQuiz = (topicId: string, difficulty: string) => {
    const topic = quizTopics.find((t) => t.id === topicId);
    if (!topic) return;

    const questions = generateQuizSet(topicId, difficulty, quizLength);
    setQuizQuestions(questions);
    setCurrentQuizTopic(topicId);
    setCurrentQuizDifficulty(difficulty);
    setCurrentQuizIndex(0);
    setShowQuizSelection(false);

    const quizStartMessage: MessageType = {
      id: Date.now().toString(),
      role: "bot",
      content: `🧠 **${topic.title} Security Quiz - ${
        difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
      } Level**\n\nGreat choice! I've prepared ${quizLength} ${difficulty} level questions about ${topic.title.toLowerCase()}. Each question includes detailed explanations to help you learn.\n\nLet's start with question 1:`,
      timestamp: new Date(),
      status: "info",
    };

    setMessages((prev) => [...prev, quizStartMessage]);

    // Add the first question
    setTimeout(() => {
      const questionMessage: MessageType = {
        id: `quiz-${Date.now()}`,
        role: "bot",
        content: `**Question 1 of ${quizLength}**`,
        timestamp: new Date(),
        quiz: questions[0],
        status: "info",
      };
      setMessages((prev) => [...prev, questionMessage]);
    }, 1000);
  };

  const showNextQuiz = (isCorrect?: boolean) => {
    // Track the answer if provided
    if (typeof isCorrect === "boolean") {
      setQuizResults((prev) => ({
        ...prev,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        totalQuestions: prev.totalQuestions + 1,
        answers: [...prev.answers, isCorrect],
      }));
    }

    if (currentQuizIndex < quizQuestions.length - 1) {
      const nextIndex = currentQuizIndex + 1;
      setCurrentQuizIndex(nextIndex);

      const questionMessage: MessageType = {
        id: `quiz-${Date.now()}`,
        role: "bot",
        content: `**Question ${nextIndex + 1} of ${quizLength}**`,
        timestamp: new Date(),
        quiz: quizQuestions[nextIndex],
        status: "info",
      };
      setMessages((prev) => [...prev, questionMessage]);
    } else {
      // Quiz completed - calculate final results
      const finalCorrectAnswers =
        quizResults.correctAnswers + (isCorrect ? 1 : 0);
      const finalTotalQuestions = quizLength;
      const finalAnswers = [...quizResults.answers, isCorrect || false];

      // Calculate new total score
      const newTotalScore = {
        totalCorrect: totalScore.totalCorrect + finalCorrectAnswers,
        totalQuestions: totalScore.totalQuestions + finalTotalQuestions,
        completedQuizzes: totalScore.completedQuizzes + 1,
      };

      // Update total score state
      setTotalScore(newTotalScore);

      const percentage = Math.round(
        (finalCorrectAnswers / finalTotalQuestions) * 100
      );
      const topicTitle =
        quizTopics.find((t) => t.id === currentQuizTopic)?.title || "Security";

      let performanceLevel = "";
      let performanceIcon = "";

      if (percentage >= 80) {
        performanceLevel = "Excellent";
        performanceIcon = "🏆";
      } else if (percentage >= 60) {
        performanceLevel = "Good";
        performanceIcon = "👍";
      } else if (percentage >= 40) {
        performanceLevel = "Fair";
        performanceIcon = "📚";
      } else {
        performanceLevel = "Needs Improvement";
        performanceIcon = "💪";
      }

      const overallPercentage = Math.round(
        (newTotalScore.totalCorrect / newTotalScore.totalQuestions) * 100
      );

      let overallPerformanceLevel = "";
      let overallPerformanceIcon = "";
      if (overallPercentage >= 80) {
        overallPerformanceLevel = "Excellent";
        overallPerformanceIcon = "🏆";
      } else if (overallPercentage >= 60) {
        overallPerformanceLevel = "Good";
        overallPerformanceIcon = "👍";
      } else if (overallPerformanceLevel >= 40) {
        overallPerformanceLevel = "Fair";
        overallPerformanceIcon = "📚";
      } else {
        overallPerformanceLevel = "Needs Improvement";
        overallPerformanceIcon = "💪";
      }

      // Show completion message immediately
      const completionMessage: MessageType = {
        id: Date.now().toString(),
        role: "bot",
        content: `${performanceIcon} **🎯 QUIZ COMPLETED - ${topicTitle}**

**📋 This Quiz Results:**
• **Score: ${finalCorrectAnswers}/${finalTotalQuestions} (${percentage}%)**
• **Performance: ${performanceLevel}**

**📊 Question Breakdown:**
${finalAnswers
  .map(
    (correct, index) =>
      `Question ${index + 1}: ${correct ? "✅ Correct" : "❌ Incorrect"}`
  )
  .join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${overallPerformanceIcon} **🏆 TOTAL RESULTS SUMMARY - ALL QUIZZES**

**📈 Overall Statistics:**
• **🎯 Total Score: ${newTotalScore.totalCorrect}/${
          newTotalScore.totalQuestions
        } (${overallPercentage}%)**
• **📚 Quizzes Completed: ${newTotalScore.completedQuizzes}**
• **🏅 Overall Performance: ${overallPerformanceLevel}**

**🎓 Learning Journey:**
${
  newTotalScore.completedQuizzes === 1
    ? "🌟 Great start! You've completed your first cybersecurity quiz."
    : newTotalScore.completedQuizzes < 3
    ? `🚀 You're building momentum! ${newTotalScore.completedQuizzes} quizzes completed.`
    : newTotalScore.completedQuizzes < 6
    ? `🔥 Excellent progress! You've completed ${newTotalScore.completedQuizzes} quizzes - you're becoming a security expert!`
    : `🏆 Outstanding! You've mastered ${newTotalScore.completedQuizzes} quizzes. You're a cybersecurity champion!`
}

**💪 Performance Analysis:**
${
  percentage >= 80
    ? "🌟 Outstanding work on this quiz!"
    : percentage >= 60
    ? "👏 Well done on this quiz!"
    : percentage >= 40
    ? "📈 Keep practicing - you're improving!"
    : "💪 Don't give up - try again to improve!"
}

**🚀 What's Next?**
• Try a different topic to broaden your knowledge
• Challenge yourself with a higher difficulty level  
• Ask me to explain any concepts you found challenging
• Retake quizzes to improve your scores
• Try longer quizzes for more comprehensive testing

Ready for your next cybersecurity challenge?`,
        timestamp: new Date(),
        status: percentage >= 60 ? "success" : "warning",
      };

      setMessages((prev) => [...prev, completionMessage]);

      // Reset quiz state
      setCurrentQuizTopic(null);
      setCurrentQuizIndex(0);
      setQuizQuestions([]);
      setQuizResults({ correctAnswers: 0, totalQuestions: 0, answers: [] });
      setShowQuizSelection(true);
    }
  };

  // Update the generateQuizSet function to accept difficulty parameter:
  const generateQuizSet = (
    topicId: string,
    difficulty = "beginner",
    length = 5
  ) => {
    const quizSets = {
      "web-security": {
        beginner: [
          {
            question: "What does XSS stand for?",
            options: [
              "Cross-Site Scripting",
              "Cross-System Security",
              "Cross-Server Scanning",
              "Cross-Site Security",
            ],
            correct: 0,
            explanation:
              "XSS stands for Cross-Site Scripting, a vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users.",
          },
          {
            question:
              "Which of the following is a sign of a potential SQL injection vulnerability?",
            options: [
              "Website loads slowly",
              "Error messages reveal database information",
              "Website has many images",
              "Website uses HTTPS",
            ],
            correct: 1,
            explanation:
              "Database error messages that reveal table names, column names, or SQL syntax often indicate SQL injection vulnerabilities.",
          },
          {
            question: "What is the primary purpose of input validation?",
            options: [
              "To make websites faster",
              "To prevent malicious data from being processed",
              "To improve user experience",
              "To reduce server costs",
            ],
            correct: 1,
            explanation:
              "Input validation ensures that only properly formatted and safe data is processed by the application, preventing various attacks including injection attacks.",
          },
          {
            question:
              "Which HTTP method should NOT be used for sensitive operations?",
            options: ["POST", "PUT", "GET", "DELETE"],
            correct: 2,
            explanation:
              "GET requests should not be used for sensitive operations because they can be cached, logged in server logs, and appear in browser history.",
          },
          {
            question: "What is CSRF?",
            options: [
              "A type of encryption",
              "An attack that tricks users into performing unwanted actions",
              "A security header",
              "A database vulnerability",
            ],
            correct: 1,
            explanation:
              "CSRF (Cross-Site Request Forgery) tricks authenticated users into performing actions they didn't intend to perform on a web application.",
          },
        ],
        intermediate: [
          {
            question:
              "Which of the following is the most effective way to prevent XSS attacks?",
            options: [
              "Using HTTPS instead of HTTP",
              "Implementing Content Security Policy (CSP)",
              "Disabling JavaScript in the browser",
              "Using strong passwords",
            ],
            correct: 1,
            explanation:
              "Content Security Policy (CSP) is one of the most effective defenses against XSS attacks. It allows you to specify which sources of content are trusted, preventing the execution of malicious scripts.",
          },
          {
            question: "What does SQL injection allow an attacker to do?",
            options: [
              "Only read data from the database",
              "Manipulate database queries to access, modify, or delete data",
              "Only crash the website",
              "Change the website's design",
            ],
            correct: 1,
            explanation:
              "SQL injection allows attackers to manipulate database queries, potentially giving them the ability to read sensitive data, modify records, delete data, or even execute administrative operations on the database.",
          },
          {
            question:
              "Which HTTP method should be used for operations that modify server data?",
            options: ["GET", "POST", "PUT or POST", "DELETE only"],
            correct: 2,
            explanation:
              "GET requests should never be used for operations that modify server data as they can be cached, logged, and triggered accidentally. POST, PUT, PATCH, and DELETE are appropriate for data-modifying operations.",
          },
          {
            question:
              "What is the difference between stored and reflected XSS?",
            options: [
              "No difference, they're the same",
              "Stored XSS is permanent, reflected XSS is temporary",
              "Reflected XSS is more dangerous",
              "Stored XSS only affects the attacker",
            ],
            correct: 1,
            explanation:
              "Stored XSS persists in the application's database and affects all users who view the infected content, while reflected XSS is temporary and typically affects only the user who clicks a malicious link.",
          },
          {
            question:
              "Which of these is NOT a valid way to prevent CSRF attacks?",
            options: [
              "Using CSRF tokens",
              "Checking the Referer header",
              "Using HTTPS only",
              "Implementing SameSite cookie attributes",
            ],
            correct: 2,
            explanation:
              "While HTTPS is important for security, it doesn't prevent CSRF attacks. CSRF tokens, Referer header validation, and SameSite cookie attributes are all valid CSRF prevention methods.",
          },
        ],
        advanced: [
          {
            question:
              "In a DOM-based XSS attack, where does the vulnerability typically occur?",
            options: [
              "Server-side code",
              "Database queries",
              "Client-side JavaScript code",
              "Network transmission",
            ],
            correct: 2,
            explanation:
              "DOM-based XSS vulnerabilities occur in client-side JavaScript code that processes user input and modifies the DOM without proper sanitization.",
          },
          {
            question: "Which technique can bypass basic SQL injection filters?",
            options: [
              "Using uppercase letters",
              "SQL comment injection and encoding",
              "Adding more spaces",
              "Using different browsers",
            ],
            correct: 1,
            explanation:
              "Advanced SQL injection techniques include using SQL comments (/* */), encoding (URL, hex, unicode), and various bypass methods to circumvent basic filtering mechanisms.",
          },
          {
            question: "What is a blind SQL injection?",
            options: [
              "An injection that doesn't work",
              "An injection where the attacker can't see direct output",
              "An injection that only works at night",
              "An injection that affects vision",
            ],
            correct: 1,
            explanation:
              "Blind SQL injection occurs when the application doesn't return database errors or data directly, forcing attackers to infer information through boolean-based or time-based techniques.",
          },
          {
            question: "Which CSP directive would prevent all inline scripts?",
            options: [
              "script-src 'none'",
              "script-src 'self'",
              "script-src 'unsafe-inline'",
              "default-src 'self'",
            ],
            correct: 1,
            explanation:
              "script-src 'self' allows scripts only from the same origin, effectively preventing inline scripts. 'unsafe-inline' would actually allow them, which defeats the security purpose.",
          },
          {
            question: "What is prototype pollution in JavaScript?",
            options: [
              "A performance optimization technique",
              "A vulnerability where attackers modify Object.prototype",
              "A method to clean up memory",
              "A way to improve code readability",
            ],
            correct: 1,
            explanation:
              "Prototype pollution is a vulnerability where attackers can modify Object.prototype or other built-in prototypes, potentially affecting all objects in the application and leading to various security issues.",
          },
        ],
      },
      // Add other topics with difficulty levels...
      authentication: {
        beginner: [
          {
            question: "What makes a password strong?",
            options: [
              "Using only uppercase letters",
              "Length, complexity, and uniqueness",
              "Using personal information",
              "Using common dictionary words",
            ],
            correct: 1,
            explanation:
              "Strong passwords should be long (12+ characters), complex (mix of letters, numbers, symbols), and unique for each account. Avoid personal information and common words.",
          },
          {
            question: "What is two-factor authentication (2FA)?",
            options: [
              "Using two different passwords",
              "A security process that requires two different authentication factors",
              "Logging in twice",
              "Using two different browsers",
            ],
            correct: 1,
            explanation:
              "2FA requires two different authentication factors: something you know (password), something you have (phone/token), or something you are (biometric). This significantly improves security.",
          },
          {
            question: "Why should passwords be hashed instead of encrypted?",
            options: [
              "Hashing is faster",
              "Hashing is irreversible, encryption is reversible",
              "Hashing uses less storage",
              "There's no difference",
            ],
            correct: 1,
            explanation:
              "Hashing is a one-way function that cannot be reversed, while encryption can be decrypted. For passwords, you only need to verify if the entered password matches, not retrieve the original.",
          },
          {
            question: "What is a session in web security?",
            options: [
              "A meeting between users",
              "A temporary connection between user and server",
              "A type of cookie",
              "A security vulnerability",
            ],
            correct: 1,
            explanation:
              "A session is a temporary, stateful connection between a user and server that maintains authentication and user data across multiple requests.",
          },
          {
            question: "Which is more secure for storing session identifiers?",
            options: [
              "URL parameters",
              "Local storage",
              "HTTP-only cookies",
              "Regular cookies",
            ],
            correct: 2,
            explanation:
              "HTTP-only cookies cannot be accessed by JavaScript, making them more secure against XSS attacks compared to other storage methods.",
          },
        ],
        intermediate: [
          {
            question:
              "Which is the most secure way to store passwords in a database?",
            options: [
              "Plain text",
              "Encrypted with AES",
              "Hashed with bcrypt and salt",
              "Base64 encoded",
            ],
            correct: 2,
            explanation:
              "Passwords should be hashed using a strong, slow hashing algorithm like bcrypt, scrypt, or Argon2, along with a unique salt for each password. Never store passwords in plain text or use fast hashing algorithms.",
          },
          {
            question: "What is session hijacking?",
            options: [
              "Stealing someone's username and password",
              "Taking over a user's authenticated session",
              "Blocking access to a website",
              "Changing website content",
            ],
            correct: 1,
            explanation:
              "Session hijacking occurs when an attacker steals or predicts a valid session token to gain unauthorized access to a user's session. This can be prevented with secure session management practices.",
          },
          {
            question: "Which cookie attribute helps prevent session hijacking?",
            options: ["HttpOnly", "Secure", "SameSite", "All of the above"],
            correct: 3,
            explanation:
              "All three attributes help secure cookies: HttpOnly prevents JavaScript access, Secure ensures transmission over HTTPS only, and SameSite helps prevent CSRF attacks.",
          },
          {
            question: "What is the purpose of password salting?",
            options: [
              "To make passwords taste better",
              "To prevent rainbow table attacks",
              "To make passwords longer",
              "To encrypt passwords",
            ],
            correct: 1,
            explanation:
              "Salt is random data added to passwords before hashing to ensure that identical passwords produce different hashes, preventing rainbow table attacks.",
          },
          {
            question: "Which authentication factor is 'something you are'?",
            options: ["Password", "SMS code", "Fingerprint", "Security key"],
            correct: 2,
            explanation:
              "Biometric factors like fingerprints, facial recognition, or iris scans represent 'something you are' - inherent characteristics of the user.",
          },
        ],
        advanced: [
          {
            question: "What is the main vulnerability in JWT tokens?",
            options: [
              "They're too long",
              "They can be decoded to reveal information",
              "They expire too quickly",
              "They're encrypted",
            ],
            correct: 1,
            explanation:
              "JWT tokens are base64 encoded (not encrypted) and can be decoded to reveal their contents. Sensitive information should not be stored in JWT payloads.",
          },
          {
            question: "Which attack targets the 'none' algorithm in JWT?",
            options: [
              "Brute force attack",
              "Algorithm confusion attack",
              "Replay attack",
              "Man-in-the-middle attack",
            ],
            correct: 1,
            explanation:
              "Algorithm confusion attacks exploit JWT implementations that accept the 'none' algorithm, allowing attackers to create unsigned tokens that bypass signature verification.",
          },
          {
            question: "What is OAuth 2.0 primarily designed for?",
            options: [
              "Password storage",
              "Authorization delegation",
              "Data encryption",
              "Session management",
            ],
            correct: 1,
            explanation:
              "OAuth 2.0 is an authorization framework that allows applications to obtain limited access to user accounts on behalf of the user without exposing passwords.",
          },
          {
            question: "Which is a secure method for password reset?",
            options: [
              "Sending new password via email",
              "Using security questions only",
              "Time-limited token sent to verified email",
              "Resetting to a default password",
            ],
            correct: 2,
            explanation:
              "Secure password reset uses time-limited, single-use tokens sent to a verified email address, allowing users to set a new password securely.",
          },
          {
            question:
              "What is the principle of least privilege in authentication?",
            options: [
              "Users should have minimum required permissions",
              "Users should have maximum permissions",
              "All users should have the same permissions",
              "Permissions don't matter",
            ],
            correct: 0,
            explanation:
              "The principle of least privilege means users should only have the minimum permissions necessary to perform their job functions, reducing the potential impact of compromised accounts.",
          },
        ],
      },
      // Add other topics similarly...
    };

    const topicQuizzes = quizSets[topicId as keyof typeof quizSets];
    if (!topicQuizzes) return [];

    const difficultyQuizzes =
      topicQuizzes[difficulty as keyof typeof topicQuizzes] ||
      topicQuizzes.beginner;

    // Shuffle and return the requested number of questions
    const shuffled = [...difficultyQuizzes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(length, shuffled.length));
  };

  //   const handleSendMessage = () => {
  //     if (!input.trim()) return

  //     // End current quiz when user sends a message in general chat
  //     endCurrentQuiz()

  //     const userMessage: MessageType = {
  //       id: Date.now().toString(),
  //       role: "user",
  //       content: input,
  //       timestamp: new Date(),
  //     }

  //     setMessages((prev) => [...prev, userMessage])
  //     const currentInput = input
  //     setInput("")
  //     setIsTyping(true)

  //     setTimeout(() => {
  //       setIsTyping(false)

  //       // Interactive demos
  //       if (isDemoRequest(currentInput)) {
  //         let demoTopic = "xss"
  //         if (currentInput.toLowerCase().includes("sql")) demoTopic = "sql"

  //         const demoMessage: MessageType = {
  //           id: (Date.now() + 1).toString(),
  //           role: "bot",
  //           content: "🎯 **Interactive Security Demo**",
  //           timestamp: new Date(),
  //           interactiveDemo: generateSecurityDemo(demoTopic),
  //           status: "info",
  //         }
  //         setMessages((prev) => [...prev, demoMessage])
  //         return
  //       }

  //       // Security-specific responses
  //       let botResponse: MessageType

  //       if (currentInput.toLowerCase().includes("xss") || currentInput.toLowerCase().includes("cross-site scripting")) {
  //         botResponse = {
  //           id: (Date.now() + 1).toString(),
  //           role: "bot",
  //           content: `# Cross-Site Scripting (XSS) Explained 🎯

  // Cross-Site Scripting (XSS) is one of the most common web vulnerabilities. It occurs when an attacker injects malicious scripts into web pages viewed by other users.

  // ## Types of XSS

  // ### 1. **Reflected XSS**
  // - Script reflected off web server
  // - Typically through URL parameters
  // - Requires user interaction (clicking malicious link)

  // ### 2. **Stored XSS**
  // - Script stored in database
  // - Executes when page loads
  // - More dangerous as it affects all users

  // ### 3. **DOM-based XSS**
  // - Script executes in DOM environment
  // - Client-side vulnerability
  // - Harder to detect with traditional scanners

  // ## Example Attack

  // \`\`\`javascript
  // // Vulnerable code
  // document.getElementById('output').innerHTML = userInput;

  // // Malicious input
  // <script>alert('XSS Attack!');</script>
  // \`\`\`

  // ## Prevention Methods

  // ### ✅ **Input Validation**
  // - Validate all user inputs
  // - Use whitelist approach
  // - Sanitize special characters

  // ### ✅ **Output Encoding**
  // - Encode data before displaying
  // - Use context-appropriate encoding
  // - HTML, JavaScript, CSS encoding

  // ### ✅ **Content Security Policy (CSP)**
  // \`\`\`http
  // Content-Security-Policy: default-src 'self'; script-src 'self'
  // \`\`\`

  // ### ✅ **Use Security Libraries**
  // - DOMPurify for HTML sanitization
  // - Framework-specific protections
  // - Regular security updates

  // ## Impact in Myanmar's Context

  // Many local e-commerce and business websites are vulnerable to XSS, potentially exposing:
  // - Customer personal information
  // - Payment details
  // - Session tokens
  // - Administrative access

  // Would you like me to demonstrate how XSS attacks work or show you how to test for XSS vulnerabilities?`,
  //           timestamp: new Date(),
  //           icon: "⚡",
  //           status: "warning",
  //         }
  //       } else if (currentInput.toLowerCase().includes("sql injection")) {
  //         botResponse = {
  //           id: (Date.now() + 1).toString(),
  //           role: "bot",
  //           content:
  //             "💉 **SQL Injection Vulnerability**\n\nSQL injection occurs when user input is directly concatenated into SQL queries, allowing attackers to manipulate database operations.\n\n**Impact in Myanmar's Context:**\nMany local e-commerce and business websites are vulnerable to SQL injection, potentially exposing customer data and financial information.\n\n**Prevention Methods:**\n• Use parameterized queries/prepared statements\n• Input validation and sanitization\n• Principle of least privilege for database users\n• Regular security audits",
  //           timestamp: new Date(),
  //           icon: "🛡️",
  //           status: "danger",
  //           codeExample: {
  //             vulnerable: `// Vulnerable\nquery = "SELECT * FROM users WHERE id = " + userId;`,
  //             secure: `// Secure\nquery = "SELECT * FROM users WHERE id = ?"\nstatement.setInt(1, userId);`,
  //           },
  //         }
  //       } else if (currentInput.toLowerCase().includes("https") || currentInput.toLowerCase().includes("ssl")) {
  //         botResponse = {
  //           id: (Date.now() + 1).toString(),
  //           role: "bot",
  //           content:
  //             "🔒 **HTTPS & SSL/TLS Security**\n\nHTTPS is crucial for protecting data in transit. In Myanmar's growing digital economy, many websites still lack proper HTTPS implementation.\n\n**Why HTTPS Matters:**\n• Encrypts data between browser and server\n• Prevents man-in-the-middle attacks\n• Required for modern web features\n• Improves SEO rankings\n• Builds user trust\n\n**Implementation Tips:**\n• Use Let's Encrypt for free SSL certificates\n• Enable HSTS (HTTP Strict Transport Security)\n• Redirect all HTTP traffic to HTTPS\n• Check for mixed content issues",
  //           timestamp: new Date(),
  //           icon: "🔐",
  //           status: "success",
  //           securityTip: {
  //             title: "Quick HTTPS Check",
  //             description:
  //               "Look for the lock icon in your browser's address bar. Green = secure, red/warning = insecure.",
  //           },
  //         }
  //       } else if (currentInput.toLowerCase().includes("privacy") || currentInput.toLowerCase().includes("gdpr")) {
  //         botResponse = {
  //           id: (Date.now() + 1).toString(),
  //           role: "bot",
  //           content:
  //             "🔒 **Web Privacy & Data Protection**\n\nPrivacy is becoming increasingly important as Myanmar integrates with global digital markets. Many local websites collect user data without proper consent.\n\n**Common Privacy Issues:**\n• Third-party tracking without consent\n• Excessive data collection\n• Lack of privacy policies\n• No user control over data\n\n**Best Practices:**\n• Implement consent management\n• Minimize data collection\n• Provide clear privacy policies\n• Allow users to delete their data\n• Use privacy-focused analytics alternatives",
  //           timestamp: new Date(),
  //           icon: "👁️",
  //           status: "warning",
  //         }
  //       } else if (currentInput.toLowerCase().includes("myanmar") || currentInput.toLowerCase().includes("local")) {
  //         botResponse = {
  //           id: (Date.now() + 1).toString(),
  //           role: "bot",
  //           content:
  //             "🇲🇲 **Web Security in Myanmar's Context**\n\nAs Myanmar's digital ecosystem grows, I've observed common security challenges:\n\n**Common Issues:**\n• Many local websites lack HTTPS\n• Outdated CMS installations (WordPress, etc.)\n• Weak password policies\n• No security headers implementation\n• Unpatched vulnerabilities\n\n**Recommendations for Myanmar Developers:**\n• Start with basic security headers\n• Use reputable hosting with SSL support\n• Keep all software updated\n• Implement proper backup strategies\n• Consider local cybersecurity training\n\nWould you like me to scan a specific Myanmar website to demonstrate these issues?",
  //           timestamp: new Date(),
  //           icon: "🌏",
  //           status: "info",
  //         }
  //       } else {
  //         botResponse = {
  //           id: (Date.now() + 1).toString(),
  //           role: "bot",
  //           content:
  //             "🤖 I'm specialized in web security! I can help you with:\n\n🔍 **Website Security Scanning** - Just provide a URL\n🛡️ **Vulnerability Explanations** - Ask about XSS, SQL injection, etc.\n🎯 **Attack Demonstrations** - See how exploits work\n📚 **Security Best Practices** - Learn secure coding\n🧠 **Interactive Quizzes** - Test your knowledge\n\nWhat would you like to explore? Try asking me to scan a website or explain a security concept!",
  //           timestamp: new Date(),
  //           status: "info",
  //         }
  //       }

  //       setMessages((prev) => [...prev, botResponse])
  //     }, 1200)
  //   }

  //stream response
  // const handleSendMessage = async () => {
  //   if (!input.trim()) return;

  //   const userMessage: MessageType = {
  //     id: Date.now().toString(),
  //     role: "user",
  //     content: input,
  //     timestamp: new Date(),
  //   };
  //   setMessages((prev) => [...prev, userMessage]);
  //   setInput("");
  //   setIsTyping(true);

  //   try {
  //     const response = await fetch(`${API_URL}/chat`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //       body: JSON.stringify({ question: input }),
  //     });

  //     if (!response.body) throw new Error("ReadableStream not supported");

  //     const reader = response.body.getReader();
  //     const decoder = new TextDecoder("utf-8");
  //     let botText = "";

  //     const botMessage: MessageType = {
  //       id: (Date.now() + 1).toString(),
  //       role: "bot",
  //       content: "",
  //       timestamp: new Date(),
  //       // interactiveDemo: generateSecurityDemo(demoTopic),
  //       status: "info",
  //     };

  //     // Add initial bot message to chat
  //     setMessages((prev) => [...prev, botMessage]);

  //     let buffer = "";

  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) break;

  //       buffer += decoder.decode(value, { stream: true });

  //       // Split by lines (each line is a JSON object)
  //       const lines = buffer.split("\n");
  //       buffer = lines.pop() || ""; // keep the last incomplete line in buffer

  //       for (const line of lines) {
  //         if (!line.trim()) continue;

  //         try {
  //           const parsed = JSON.parse(line);
  //           const content = parsed.message?.content || "";
  //           // Remove <think> tags
  //           const cleaned = content.replace(/<think>[\s\S]*?<\/think>/g, "");
  //           botText += cleaned;

  //           // Update bot message in real-time
  //           setMessages((prev) =>
  //             prev.map((msg) =>
  //               msg.id === botMessage.id ? { ...msg, content: botText } : msg
  //             )
  //           );

  //           // Set typing to false after the first text is added
  //           if (botText.trim() !== "") {
  //             setIsTyping(false);
  //           }
  //         } catch (e) {
  //           console.warn("Could not parse line as JSON:", line);
  //         }
  //       }
  //     }
  //   } catch (error: any) {
  //     console.error("Error streaming response:", error?.message || error);
  //   } finally {
  //     setIsTyping(false);
  //   }
  // };

  // Mock streaming response
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // hide suggestion 
    setShowSuggestions(false);

    // Reset stop flag before starting
    stopRef.current = false;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsTyping(true);
    setIsRendering(true);

    // Create a bot message placeholder
    const botMessage: MessageType = {
      id: (Date.now() + 1).toString(),
      role: "bot",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);

    let botText = "";

    // Stream chunks one by one
    for (let i = 0; i < mockChunks.length; i++) {
      if (stopRef.current) {
        botText += "... stopped";
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessage.id ? { ...msg, content: botText } : msg
          )
        );
        break; // stop if user clicked "Stop"
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      botText += mockChunks[i];

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessage.id ? { ...msg, content: botText } : msg
        )
      );

      if (botText.trim() !== "") {
        setIsTyping(false);
      }
    }

    setIsRendering(false);
  };

  //stop handle
  const handleStop = () => {
    stopRef.current = true;
    setIsRendering(false);
    setIsTyping(false);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "scan":
        setInput("Scan facebook.com for security vulnerabilities");
        break;
      case "privacy":
        setInput("Explain privacy tracking and how to protect users");
        break;
      case "security":
        setInput("What are the most important security headers?");
        break;
      case "code":
        setInput("Show me examples of secure coding practices");
        break;
    }
  };

  const handleTopicClick = (command: string) => {
    setInput(command);
  };

  const selectSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const scanUrl = async () => {
    if (!urlToScan.trim()) return;

    endCurrentQuiz();

    const scanMessageId = Date.now().toString();
    const scanMessage: MessageType = {
      id: scanMessageId,
      role: "bot",
      content: `🔍 **Initiating comprehensive security scan of ${urlToScan}**\n\nScanning for vulnerabilities, privacy issues, and security misconfigurations...`,
      timestamp: new Date(),
      icon: "🛡️",
      isScanning: true,
      scanProgress: 0,
      status: "info",
    };

    setMessages((prev) => [...prev, scanMessage]);
    setIsUrlScanning(true);
    setUrlScanProgress(0);

    // Show scanning progress (optional)
    const steps = [
      "Connecting to website...",
      "Analyzing HTTP headers...",
      "Checking SSL/TLS configuration...",
      "Scanning for third-party trackers...",
      "Detecting JavaScript libraries...",
      "Analyzing privacy policies...",
      "Checking security headers...",
      "Scanning for vulnerabilities...",
      "Generating security report...",
      "Finalizing analysis...",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const progress = ((i + 1) / steps.length) * 100;
      setUrlScanProgress(progress);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === scanMessageId ? { ...msg, scanProgress: progress } : msg
        )
      );
    }

    try {
      // scan the URL using your API
      const response = await fetch(`${API_URL}/scan/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ question: urlToScan }),
      });

      if (!response.ok) throw new Error("Failed to fetch scan results");

      const result = await response.json();

      // Update message with real results
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === scanMessageId
            ? {
                ...msg,
                isScanning: false,
                scanResults: result,
                content: `🔍 **Security Scan Complete for ${urlToScan}**\n\nOverall Security Score: **${result.overallScore}/100**\n\nI found ${result.issues.length} security issues that need attention.`,
              }
            : msg
        )
      );
    } catch (error) {
      console.error(error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === scanMessageId
            ? {
                ...msg,
                isScanning: false,
                status: "error",
                content: `❌ Failed to scan ${urlToScan}. Please try again.`,
              }
            : msg
        )
      );
    }

    setIsUrlScanning(false);
    setUrlToScan("");
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 50; // tolerance
    setIsUserAtBottom(atBottom);
  };

  // Scroll to bottom function
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // On initial render, scroll to bottom immediately
  useEffect(() => {
    scrollToBottom(false); // instant scroll
  }, []);

  // When messages update, scroll only if user is at bottom
  useEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom();
    }
  }, [messages, isUserAtBottom]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col">
      <main className="flex flex-col h-screen  relative">
        <header className="border-b border-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-cyan-500 mr-2" />
                <span className="font-bold">HackAware Security Chat</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-cyan-500 text-cyan-500"
              >
                {securityLevel}
              </Badge>
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Online
              </Badge>
              {totalScore.completedQuizzes > 0 && (
                <Badge
                  variant="outline"
                  className="border-purple-500 text-purple-500"
                >
                  Total: {totalScore.totalCorrect}/{totalScore.totalQuestions}
                </Badge>
              )}
            </div>
          </div>
        </header>
        {/* scrollable area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto scrollbar-none lg:p-4 space-y-4 min-h-0 container mx-auto max-w-5xl"
        >
          {messages.map((message) => (
            <div key={message.id}>
              <ChatMessage message={message} />

              {message.isScanning && (
                <div className="ml-11 mt-2">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 max-w-[80%]">
                    <div className="flex justify-between text-sm mb-2">
                      <span>🔍 Deep security analysis in progress...</span>
                      <span>{message.scanProgress}%</span>
                    </div>
                    <Progress
                      value={message.scanProgress || 0}
                      className="h-2 bg-gray-700 mb-3"
                    >
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
                    </Progress>
                    <div className="text-xs text-gray-400 space-y-1">
                      {(message.scanProgress || 0) > 15 && (
                        <div>✓ Analyzing HTTP security headers</div>
                      )}
                      {(message.scanProgress || 0) > 30 && (
                        <div>✓ Detecting third-party trackers</div>
                      )}
                      {(message.scanProgress || 0) > 45 && (
                        <div>
                          ✓ Scanning JavaScript libraries for vulnerabilities
                        </div>
                      )}
                      {(message.scanProgress || 0) > 60 && (
                        <div>✓ Checking SSL/TLS configuration</div>
                      )}
                      {(message.scanProgress || 0) > 75 && (
                        <div>
                          ✓ Analyzing privacy policies and consent mechanisms
                        </div>
                      )}
                      {(message.scanProgress || 0) > 90 && (
                        <div>✓ Generating security recommendations</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {message.scanResults && (
                <div className="ml-11 mt-2">
                  <ScanResults results={message.scanResults} />
                </div>
              )}

              {message.threatAlert && (
                <div className="ml-11 mt-2">
                  <SecurityThreatAlert alert={message.threatAlert} />
                </div>
              )}

              {message.interactiveDemo && (
                <div className="ml-11 mt-2">
                  <InteractiveDemo demo={message.interactiveDemo} />
                </div>
              )}

              {message.quiz && (
                <div className="ml-11 mt-2">
                  <SecurityQuiz
                    quiz={message.quiz}
                    onNext={(isCorrect) => showNextQuiz(isCorrect)}
                    showNext={
                      currentQuizTopic !== null &&
                      currentQuizIndex < quizQuestions.length - 1
                    }
                  />
                </div>
              )}

              {message.codeExample && (
                <div className="ml-11 mt-2">
                  <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-4 max-w-[80%]">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Code className="h-4 w-4 text-cyan-500" />
                      Code Examples
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-red-400 mb-1">
                          ❌ Vulnerable Code:
                        </div>
                        <pre className="bg-red-500/10 border border-red-500/30 rounded p-2 text-xs overflow-x-auto">
                          <code>{message.codeExample.vulnerable}</code>
                        </pre>
                      </div>
                      <div>
                        <div className="text-xs text-green-400 mb-1">
                          ✅ Secure Code:
                        </div>
                        <pre className="bg-green-500/10 border border-green-500/30 rounded p-2 text-xs overflow-x-auto">
                          <code>{message.codeExample.secure}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {message.securityTip && (
                <div className="ml-11 mt-2">
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 max-w-[80%]">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-cyan-500" />
                      {message.securityTip.title}
                    </h4>
                    <p className="text-sm text-gray-300">
                      {message.securityTip.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isTyping && <ChatTypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Fixed input area */}
        <div className="w-full max-w-4xl p-4 border border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 lg:rounded-xl mx-auto lg:mb-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="text">General Chat</TabsTrigger>
              <TabsTrigger value="url">URL Scan</TabsTrigger>
              <TabsTrigger value="quiz">Security Quiz</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-0">
              <div ref={inputContainerRef} className="relative">
                {showSuggestions && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-gray-300 border-b border-gray-700 last:border-b-0"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      filterSuggestions(e.target.value);

                      // Auto-grow logic
                      const el = textareaRef.current;
                      if (el) {
                        el.style.height = "auto"; // reset height
                        el.style.height = el.scrollHeight + "px"; // expand to fit content
                      }
                    }}
                    rows={1}
                    placeholder="Ask about web security, vulnerabilities, best practices..."
                    className="min-h-[60px] bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500 overflow-hidden resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!isRendering) {
                          handleSendMessage();
                        }
                      }
                      if (e.key === "Escape") {
                        setShowSuggestions(false);
                      }
                    }}
                    onFocus={() => {
                      if (input.length >= 2) {
                        filterSuggestions(input);
                      }
                    }}
                  />
                  <Button
                    onClick={isRendering ? handleStop : handleSendMessage}
                    size="icon"
                    className="bg-cyan-500 hover:bg-cyan-600 mt-auto py-4 h-fit disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRendering ? (
                      <CircleStop className="w-8 h-8" strokeWidth={2.25} />
                    ) : (
                      <Send className="w-6 h-6" />
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="url" className="mt-0">
              <div className="space-y-4">
                <div className="flex gap-2 w-full">
                  <Input
                    value={urlToScan}
                    onChange={(e) => setUrlToScan(e.target.value)}
                    placeholder="Enter website URL for security scan (e.g., https://example.com)"
                    className="flex-1 bg-gray-800/50 border-gray-700 focus-visible:ring-cyan-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        scanUrl();
                      }
                    }}
                    disabled={isUrlScanning}
                  />
                  <Dialog
                    open={showAnalysisModal}
                    onOpenChange={setShowAnalysisModal}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-gray-600 hover:bg-gray-700 bg-transparent"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-cyan-500" />
                          What HackAware will analyze
                        </DialogTitle>
                        <DialogDescription>
                          Comprehensive security and privacy analysis for any
                          website
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 py-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-cyan-500/20 p-1.5 rounded-full">
                            <Shield className="h-4 w-4 text-cyan-500" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              Security Headers & HTTPS
                            </h4>
                            <p className="text-sm text-gray-400">
                              Analyze security headers, SSL/TLS configuration,
                              and HTTPS implementation
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-500/20 p-1.5 rounded-full">
                            <Eye className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              Privacy & Tracking
                            </h4>
                            <p className="text-sm text-gray-400">
                              Detect third-party trackers, cookies, and privacy
                              compliance issues
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-red-500/20 p-1.5 rounded-full">
                            <Code className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              JavaScript Vulnerabilities
                            </h4>
                            <p className="text-sm text-gray-400">
                              Scan for outdated libraries and known security
                              vulnerabilities
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="bg-green-500/20 p-1.5 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              Security Best Practices
                            </h4>
                            <p className="text-sm text-gray-400">
                              Check Content Security Policy, cookie security,
                              and compliance standards
                            </p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    className="bg-cyan-500 hover:bg-cyan-600"
                    onClick={scanUrl}
                    disabled={!urlToScan.trim() || isUrlScanning}
                  >
                    <Scan className="h-4 w-4 mr-1" />
                    {isUrlScanning ? "Scanning..." : "Scan Now"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quiz" className="mt-0">
              <div className="space-y-4">
                {showQuizSelection ? (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold mb-2">
                        Choose Your Security Quiz
                      </h3>
                      <p className="text-sm text-gray-400">
                        Select a topic and difficulty level to start learning
                      </p>
                      {totalScore.completedQuizzes > 0 && (
                        <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                          <h4 className="font-medium mb-2 text-purple-300">
                            📊 Your Overall Progress
                          </h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-400">
                                {totalScore.completedQuizzes}
                              </div>
                              <div className="text-gray-400">
                                Quizzes Completed
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-400">
                                {totalScore.totalCorrect}/
                                {totalScore.totalQuestions}
                              </div>
                              <div className="text-gray-400">Total Score</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-400">
                                {Math.round(
                                  (totalScore.totalCorrect /
                                    totalScore.totalQuestions) *
                                    100
                                )}
                                %
                              </div>
                              <div className="text-gray-400">Average</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3 text-gray-300">
                          Select Topic:
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {quizTopics.map((topic) => (
                            <Button
                              key={topic.id}
                              variant="outline"
                              className={`h-auto p-4 flex flex-col items-center gap-2 border-gray-700 hover:border-cyan-500 hover:bg-cyan-500/10 bg-transparent ${
                                currentQuizTopic === topic.id
                                  ? "border-cyan-500 bg-cyan-500/10"
                                  : ""
                              }`}
                              onClick={() => setCurrentQuizTopic(topic.id)}
                            >
                              <span className="text-sm font-medium">
                                {topic.title}
                              </span>
                              <span className="text-xs text-gray-400 text-center">
                                {topic.description}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {currentQuizTopic && (
                        <div>
                          <h4 className="text-sm font-medium mb-3 text-gray-300">
                            Select Difficulty:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {difficultyLevels.map((level) => (
                              <Button
                                key={level.id}
                                variant="outline"
                                className={`h-auto p-4 flex flex-col items-center gap-2 border-gray-700 hover:bg-gray-700/50 bg-transparent ${
                                  currentQuizDifficulty === level.id
                                    ? `${level.color} bg-opacity-10`
                                    : ""
                                }`}
                                onClick={() =>
                                  setCurrentQuizDifficulty(level.id)
                                }
                              >
                                <span className="text-2xl">{level.icon}</span>
                                <span className="text-sm font-medium">
                                  {level.title}
                                </span>
                                <span className="text-xs text-gray-400 text-center">
                                  {level.description}
                                </span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentQuizTopic && currentQuizDifficulty && (
                        <div>
                          <h4 className="text-sm font-medium mb-3 text-gray-300">
                            Number of Questions:
                          </h4>
                          <select
                            value={quizLength}
                            onChange={(e) =>
                              setQuizLength(Number(e.target.value))
                            }
                            className="w-full max-w-xs bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(
                              (num) => (
                                <option key={num} value={num}>
                                  {num} Question{num > 1 ? "s" : ""}
                                </option>
                              )
                            )}
                          </select>
                          <p className="text-xs text-gray-400 mt-2">
                            Choose between 1-10 questions for your quiz
                          </p>
                        </div>
                      )}

                      {currentQuizTopic && currentQuizDifficulty && (
                        <div className="flex justify-center">
                          <Button
                            className="bg-cyan-500 hover:bg-cyan-600 px-8 py-3"
                            onClick={() =>
                              startQuiz(currentQuizTopic, currentQuizDifficulty)
                            }
                          >
                            Start {quizLength} Question
                            {quizLength > 1 ? "s" : ""}{" "}
                            {
                              difficultyLevels.find(
                                (l) => l.id === currentQuizDifficulty
                              )?.title
                            }{" "}
                            Quiz
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                      <h4 className="font-medium mb-2">Quiz in Progress</h4>
                      <p className="text-sm text-gray-400 mb-4">
                        {
                          quizTopics.find((t) => t.id === currentQuizTopic)
                            ?.title
                        }{" "}
                        -{" "}
                        {currentQuizDifficulty.charAt(0).toUpperCase() +
                          currentQuizDifficulty.slice(1)}{" "}
                        Level
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        <span>
                          Question {currentQuizIndex + 1} of{" "}
                          {quizQuestions.length}
                        </span>
                      </div>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowQuizSelection(true);
                            setCurrentQuizTopic(null);
                            setCurrentQuizIndex(0);
                            setQuizQuestions([]);
                          }}
                          className="border-gray-600 hover:bg-gray-700"
                        >
                          End Quiz & Choose New Topic
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-cyan-500" />
                    Interactive Learning
                  </h4>
                  <p className="text-sm text-gray-300">
                    Choose from 6 cybersecurity topics with 3 difficulty levels
                    each. Questions appear one at a time in the chat with
                    detailed explanations to help you learn effectively.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

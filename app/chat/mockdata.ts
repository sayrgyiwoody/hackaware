import { Code, Eye, Scan, Shield } from "lucide-react";
import { MessageType } from "./types";

export const mockChunks = [
  "Hello! ",
  "This is a ",
  "mock streaming ",
  "response to ",
  "test your UI 🚀\n\n",

  // Web-height test #1 (very long plain paragraph)
  "In today's fast-paced digital world, the **detection of fake news** has become increasingly important. ",
  "Fake news spreads rapidly across platforms like Facebook, Twitter, and TikTok, influencing opinions, ",
  "decisions, and even shaping entire communities. The consequences are not trivial—misinformation has been ",
  "linked to public health crises, economic instability, and the erosion of trust in democratic institutions. ",
  "Our approach focuses on combining *linguistic analysis*, statistical models, and context-aware algorithms ",
  "to provide reliable and fast classification. The key challenge lies not only in detecting obvious hoaxes ",
  "but also in identifying subtle manipulations, biased framing, and misleading narratives. ",
  "By training models on large datasets, we can approximate human-level judgment while operating at web scale.\n\n",

  // Web-height test #2 (Markdown with list & subpoints)
  "### 🚀 Features of Our Fake News Detector\n\n",
  "- 🔍 **Real-time analysis**: Each incoming article is processed in milliseconds.\n",
  "- 📊 **Classification**: News is labeled as *real*, *fake*, or *uncertain*.\n",
  "- 🌐 **Scalability**: Designed to handle millions of news pieces daily.\n",
  "- 📱 **Cross-platform support**: Web, mobile, and browser extension versions planned.\n\n",
  "Additional benefits include:\n",
  "1. Reduction of misinformation spread.\n",
  "2. Increased media literacy among users.\n",
  "3. Support for journalists and researchers.\n\n",

  // Web-height test #3 (very long markdown, code block)
  "### 🧑‍💻 Example Workflow\n\n",
  "The system follows a multi-step pipeline:\n\n",
  "1. **Preprocessing**: Clean and normalize text.\n",
  "2. **Feature Extraction**: Represent news using TF-IDF, embeddings, or BERT.\n",
  "3. **Model Inference**: Pass the processed data into trained ML/DL models.\n",
  "4. **Post-processing**: Aggregate confidence scores, apply thresholds.\n\n",
  "Here’s a small code example:\n\n",
  "```typescript\n",
  "import { analyzeNews } from './fakeNewsDetector';\n\n",
  "const text = `Breaking: Scientists discover traces of water on Mars!`;\n",
  "const result = analyzeNews(text);\n\n",
  "console.log(result);\n",
  "// { label: 'real', confidence: 0.92 }\n",
  "```\n\n" +
    "This ensures our system provides interpretable results while keeping performance high.\n\n",

  // Web-height test #4 (super long filler text to push scroll)
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
    "Vestibulum eget felis eget justo malesuada semper. Donec in ipsum nec sapien gravida volutpat. " +
    "Praesent suscipit, purus ut tincidunt vehicula, libero sapien dictum massa, at sagittis ligula nulla nec erat. " +
    "Suspendisse eu erat lorem. Sed eget hendrerit libero. Phasellus maximus, orci non porta fermentum, nulla arcu " +
    "faucibus nunc, nec sagittis orci libero non justo. In ac neque a mauris mattis volutpat sit amet sit amet ligula. " +
    "Curabitur sodales quam at lorem suscipit, a iaculis nunc pulvinar. Duis a volutpat sapien. Curabitur non tincidunt " +
    "leo. Integer sed lorem turpis. Ut a ligula a nunc ultricies sagittis. Morbi ornare purus sed nunc dapibus, nec luctus " +
    "ex efficitur. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.\n\n" +
    "Aliquam erat volutpat. Cras sit amet lacus et metus egestas convallis non sed nulla. Sed ultricies, sapien non " +
    "dictum euismod, lorem ex tristique ex, sed vestibulum risus nisl sed lacus. Nullam sed ultricies nibh. Duis viverra " +
    "sapien vel lacinia gravida. Cras et lorem mauris. Nullam non porta ante. Vestibulum ac augue eu mi maximus luctus. " +
    "Phasellus laoreet lorem non enim suscipit, et ultricies lacus fringilla.\n\n",

  // Closing sentence
  "✅ End of mock streaming response. Thanks for scrolling all the way! 🎉",
];

const securityTopics = [
  { icon: "🔒", label: "HTTPS & SSL", command: "explain HTTPS" },
  {
    icon: "🛡️",
    label: "Security Headers",
    command: "what are security headers",
  },
  {
    icon: "🍪",
    label: "Cookie Security",
    command: "cookie security best practices",
  },
  {
    icon: "🎯",
    label: "XSS Prevention",
    command: "how to prevent XSS attacks",
  },
  {
    icon: "🔐",
    label: "Authentication",
    command: "secure authentication methods",
  },
  {
    icon: "📊",
    label: "Privacy Tracking",
    command: "explain privacy tracking",
  },
];

export const quizTopics = [
  {
    id: "web-security",
    title: "Web Security",
    icon: "🛡️",
    description: "XSS, CSRF, injection attacks",
  },
  {
    id: "authentication",
    title: "Authentication",
    icon: "🔐",
    description: "Passwords, 2FA, sessions",
  },
  {
    id: "privacy",
    title: "Privacy & GDPR",
    icon: "👁️",
    description: "Data protection, tracking",
  },
  {
    id: "https-ssl",
    title: "HTTPS & SSL",
    icon: "🔒",
    description: "Encryption, certificates",
  },
  {
    id: "headers",
    title: "Security Headers",
    icon: "📋",
    description: "CSP, HSTS, X-Frame-Options",
  },
  {
    id: "malware",
    title: "Malware & Phishing",
    icon: "🦠",
    description: "Detection, prevention",
  },
];

export const difficultyLevels = [
  {
    id: "beginner",
    title: "Beginner",
    icon: "🌱",
    description: "Basic concepts and fundamentals",
    color: "text-green-400 border-green-400",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    icon: "⚡",
    description: "Practical applications and scenarios",
    color: "text-yellow-400 border-yellow-400",
  },
  {
    id: "advanced",
    title: "Advanced",
    icon: "🔥",
    description: "Complex attacks and defense strategies",
    color: "text-red-400 border-red-400",
  },
];

export const quickActions = [
  { icon: Scan, label: "Scan Website", action: "scan" },
  { icon: Eye, label: "Privacy Check", action: "privacy" },
  { icon: Shield, label: "Security Audit", action: "security" },
  { icon: Code, label: "Code Review", action: "code" },
];

export const welcomeMessage : MessageType[] = [
  {
    id: "welcome",
    role: "bot",
    content: `# Welcome to HackAware! 🛡️

I'm your AI web security assistant. I can help you:

🔍 **Scan websites** for vulnerabilities and privacy risks  
🛠️ **Review code** for security issues  
📚 **Learn** through interactive demos and quizzes  
🎯 **Understand** how attacks work and how to prevent them

**Try asking me to:**
- Scan a website URL
- Explain XSS or SQL injection
- Review your code for vulnerabilities
- Show security best practices

What would you like to explore first?`,
    timestamp: new Date(),
    status: "success",
  },
];

export const autoSuggestQueries = [
  "Scan facebook.com",
  "Suggest me cybersecurity topics based on my knowledge level",
  "Explain XSS attacks and prevention",
  "Explain Unit Testing.",
  "What are security headers?",
  "How does HTTPS work?",
  "Analyze privacy tracking on websites",
  "Demonstrate clickjacking attack",
  "Explain CSRF protection",
  "What is Content Security Policy?",
  "How to prevent data breaches?",
  "Show password security best practices",
  "What is OWASP Top 10?",
  "How does a Web Application Firewall (WAF) work?",
  "Explain CORS misconfigurations",
  "What are common SSL/TLS vulnerabilities?",
  "Explain session hijacking and prevention",
  "How do cookie security flags (HttpOnly, Secure, SameSite) work?",
  "Detect outdated JavaScript libraries",
  "How to secure APIs against attacks?",
  "Explain directory traversal attacks",
  "What is brute force protection?",
  "How to detect hidden iframes?",
  "Explain DNS spoofing and prevention",
  "What are common cloud security risks?",
];

export const chatHistory = [
  { id: "1", title: "Introduction to Web Security" },
  { id: "2", title: "Understanding XSS Attacks" },
  { id: "3", title: "SQL Injection Prevention Tips" },
  { id: "4", title: "Analyzing HTTPS Implementation" },
  { id: "5", title: "Exploring OWASP Top 10" },
  { id: "6", title: "Mitigating CSRF Attacks" },
  { id: "7", title: "Secure Cookie Practices" },
  { id: "8", title: "Understanding Clickjacking" },
  { id: "9", title: "Implementing Content Security Policy" },
  { id: "10", title: "Detecting Security Misconfigurations" },
  { id: "11", title: "Preventing Directory Traversal" },
  { id: "12", title: "Analyzing API Security" },
  { id: "13", title: "Exploring Authentication Mechanisms" },
  { id: "14", title: "Securing File Uploads" },
  { id: "15", title: "Understanding Security Tokens" },
];
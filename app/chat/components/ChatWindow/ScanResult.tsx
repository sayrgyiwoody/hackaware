"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Eye,
  Share2,
  Link,
  Flag,
} from "lucide-react";
import { motion } from "framer-motion";

interface SecurityData {
  privacy_risk: {
    header: string;
    body: string;
  };
  security: {
    header: string;
    body: string;
  };
  data_sharing: {
    header: string;
    body: string;
  };
  overall: {
    malicious: string;
    suspicious: string;
    harmless: string;
    undetected: string;
    timeout: string;
  };
  flagged_vendors?: {
    vendor_name: string;
    category: string;
    result: string;
  }[];
}

interface SecurityDashboardProps {
  data: SecurityData;
}

export function ScanResult({ data }: SecurityDashboardProps) {
  const scanned_output = data;

  // Parse vendor statistics
  const parseVendorCount = (text: string) => {
    const match = text.match(/(\d+) vendors/);
    return match ? Number.parseInt(match[1]) : 0;
  };

  const vendorStats = {
    malicious: parseVendorCount(scanned_output.overall.malicious),
    suspicious: parseVendorCount(scanned_output.overall.suspicious),
    harmless: parseVendorCount(scanned_output.overall.harmless),
    undetected: parseVendorCount(scanned_output.overall.undetected),
    timeout: parseVendorCount(scanned_output.overall.timeout),
  };

  const totalVendors = Object.values(vendorStats).reduce(
    (sum, count) => sum + count,
    0
  );
  const riskScore =
    ((vendorStats.malicious + vendorStats.suspicious) / totalVendors) * 100;

  const pieData = [
    { name: "Harmless", value: vendorStats.harmless, fill: "hsl(142 76% 36%)" },
    {
      name: "Undetected",
      value: vendorStats.undetected,
      fill: "hsl(48 96% 53%)",
    },
    { name: "Malicious", value: vendorStats.malicious, fill: "hsl(0 84% 60%)" },
    {
      name: "Suspicious",
      value: vendorStats.suspicious,
      fill: "hsl(24 70% 56%)",
    },
    { name: "Timeout", value: vendorStats.timeout, fill: "hsl(215 20% 65%)" },
  ].filter((item) => item.value > 0);

  const barData = [
    {
      category: "Harmless",
      count: vendorStats.harmless,
      fill: "hsl(142 76% 36%)",
    },
    {
      category: "Undetected",
      count: vendorStats.undetected,
      fill: "hsl(48 96% 53%)",
    },
    {
      category: "Malicious",
      count: vendorStats.malicious,
      fill: "hsl(0 84% 60%)",
    },
    {
      category: "Suspicious",
      count: vendorStats.suspicious,
      fill: "hsl(24 70% 56%)",
    },
  ];

  const getRiskLevel = (score: number) => {
    if (score === 0)
      return { level: "Low", color: "bg-chart-2", icon: ShieldCheck };
    if (score < 10)
      return { level: "Medium", color: "bg-yellow-500", icon: ShieldAlert };
    return { level: "High", color: "bg-destructive", icon: AlertTriangle };
  };

  const risk = getRiskLevel(riskScore);
  const RiskIcon = risk.icon;

  const getThreatTypeColor = (result: string) => {
    switch (result.toLowerCase()) {
      case "phishing":
        return "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400"
      case "malware":
        return "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
      case "malicious":
        return "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400"
      default:
        return "bg-gray-500/10 border-gray-500/20 text-gray-600 dark:text-gray-400"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // slightly slower stagger for top-to-bottom effect
        delayChildren: 0.1, // shorter initial delay
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -30 }, // start higher for top-to-bottom flow
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6, // slightly slower for smoother appearance
        ease: "easeOut",
      },
    },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.85, y: -20 }, // start slightly above
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="container mx-auto p-4 sm:p-6 space-y-6 text-foreground"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        variants={itemVariants}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {data.title}
          </h1>
          <p className="text-muted-foreground">
            Comprehensive security analysis results
          </p>
        </div>
        
      </motion.div>

      {/* Risk Overview Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        variants={itemVariants}
      >
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-l-4 border-l-primary bg-card h-full">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <RiskIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">
                  Overall Risk
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {risk.level}
              </div>
              <Progress value={riskScore} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {riskScore.toFixed(1)}% risk score based on vendor analysis
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="bg-card h-full">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-sm font-medium">
                  Vendors Analyzed
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totalVendors}
              </div>
              <p className="text-xs text-muted-foreground">
                {vendorStats.harmless} marked as harmless
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="bg-card h-full">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <CardTitle className="text-sm font-medium">
                  Detection Status
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {vendorStats.undetected}
              </div>
              <p className="text-xs text-muted-foreground">
                Undetected by security vendors
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-muted">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="threats" className="text-xs sm:text-sm">
              Threats
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs sm:text-sm">
              Privacy
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm">
              Security
            </TabsTrigger>
            <TabsTrigger value="sharing" className="text-xs sm:text-sm">
              Data Sharing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Vendor Distribution Pie Chart */}
              <motion.div variants={chartVariants}>
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Vendor Analysis Distribution</CardTitle>
                    <CardDescription>Breakdown of security vendor assessments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        harmless: { label: "Harmless", color: "hsl(142 76% 36%)" },
                        undetected: { label: "Undetected", color: "hsl(48 96% 53%)" },
                        malicious: { label: "Malicious", color: "hsl(0 84% 60%)" },
                        suspicious: { label: "Suspicious", color: "hsl(24 70% 56%)" },
                      }}
                      className="h-[250px] sm:h-[300px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius="40%"
                            outerRadius="80%"
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                  <div className="bg-background border border-border rounded-lg p-2 shadow-md">
                                    <p className="text-foreground font-medium">{data.name}</p>
                                    <p className="text-muted-foreground">{data.value} vendors</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Vendor Count Bar Chart */}
              <motion.div variants={chartVariants}>
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Vendor Response Counts</CardTitle>
                    <CardDescription>Number of vendors in each category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        count: { label: "Count", color: "hsl(var(--primary))" },
                      }}
                      className="h-[250px] sm:h-[300px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <XAxis
                            dataKey="category"
                            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis
                            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                          />
                          <ChartTooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-background border border-border rounded-lg p-2 shadow-md">
                                    <p className="text-foreground font-medium">{label}</p>
                                    <p className="text-muted-foreground">{payload[0].value} vendors</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Detailed Statistics */}
            <motion.div variants={itemVariants}>
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Detailed Vendor Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <motion.div
                      className="text-center p-3 sm:p-4 rounded-lg bg-green-500/10 border border-green-500/20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                        {vendorStats.harmless}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Harmless</div>
                    </motion.div>
                    <motion.div
                      className="text-center p-3 sm:p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {vendorStats.undetected}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Undetected</div>
                    </motion.div>
                    <motion.div
                      className="text-center p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                        {vendorStats.malicious}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Malicious</div>
                    </motion.div>
                    <motion.div
                      className="text-center p-3 sm:p-4 rounded-lg bg-orange-500/10 border border-orange-500/20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {vendorStats.suspicious}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Suspicious</div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="threats" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <motion.div variants={itemVariants}>
                <Card className="bg-card h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Flag className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <CardTitle className="text-lg sm:text-xl">Flagged Security Vendors</CardTitle>
                    </div>
                    <CardDescription>Vendors that flagged this resource as potentially harmful</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {scanned_output.flagged_vendors && scanned_output.flagged_vendors.length > 0 ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Flagged:</span>
                          <Badge variant="destructive">{scanned_output.flagged_vendors.length}</Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                          {scanned_output.flagged_vendors.map((vendor, index) => (
                            <motion.div
                              key={index}
                              className="p-4 bg-red-500/5 rounded-lg border border-red-500/10 max-w-[95%]"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <span className="text-sm font-semibold text-foreground">{vendor.vendor_name}</span>
                                </div>
                                <Badge variant="outline" className={`text-xs ${getThreatTypeColor(vendor.result)}`}>
                                  {vendor.result}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Category:{" "}
                                <span className="font-medium text-red-600 dark:text-red-400">{vendor.category}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShieldCheck className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No vendors flagged this resource</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Harmful URLs Card */}
              <motion.div variants={itemVariants}>
                <Card className="bg-card h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Link className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      <CardTitle className="text-lg sm:text-xl">Potentially Harmful URLs</CardTitle>
                    </div>
                    <CardDescription>URLs detected that may pose security risks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {scanned_output.harmful_urls && scanned_output.harmful_urls.length > 0 ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">URLs Detected:</span>
                          <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 dark:text-orange-400">
                            {scanned_output.harmful_urls.length}
                          </Badge>
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {scanned_output.harmful_urls.map((url, index) => (
                            <motion.div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-orange-500/5 rounded border border-orange-500/10"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.01 }}
                            >
                              <ExternalLink className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <code className="text-xs font-mono text-orange-700 dark:text-orange-300 break-all block">
                                  {url}
                                </code>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Potentially malicious or suspicious
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShieldCheck className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No harmful URLs detected</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <motion.div variants={itemVariants}>
              <Card className="bg-card">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg sm:text-xl">{scanned_output.privacy_risk.header}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert className="bg-blue-500/10 border-blue-500/20">
                    <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertTitle className="text-blue-800 dark:text-blue-200">Privacy Assessment</AlertTitle>
                    <AlertDescription className="mt-2 leading-relaxed text-blue-700 dark:text-blue-300">
                      {scanned_output.privacy_risk.body}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <motion.div variants={itemVariants}>
              <Card className="bg-card">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg sm:text-xl">{scanned_output.security.header}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert className="bg-green-500/10 border-green-500/20">
                    <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-800 dark:text-green-200">Security Analysis</AlertTitle>
                    <AlertDescription className="mt-2 leading-relaxed text-green-700 dark:text-green-300">
                      {scanned_output.security.body}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="sharing" className="space-y-4">
            <motion.div variants={itemVariants}>
              <Card className="bg-card">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg sm:text-xl">{scanned_output.data_sharing.header}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert className="bg-purple-500/10 border-purple-500/20">
                    <Share2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <AlertTitle className="text-purple-800 dark:text-purple-200">Data Sharing Analysis</AlertTitle>
                    <AlertDescription className="mt-2 leading-relaxed text-purple-700 dark:text-purple-300">
                      {scanned_output.data_sharing.body}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

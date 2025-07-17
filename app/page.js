'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Github,
  Star,
  GitPullRequest,
  BarChart3,
  Zap,
  Shield,
  Check,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  User,
  Settings,
  Sparkles,
  Code2,
  Layers,
} from "lucide-react"
import Link from "next/link"
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-500 rounded-full filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-white/10 backdrop-blur-md bg-white/5 relative z-10">
        <Link className="flex items-center justify-center hover:opacity-75 transition-all duration-300 transform hover:scale-105" href="/">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mr-3">
            <Github className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white">Sami-O</span>
        </Link>
        <nav className="ml-auto flex gap-6 sm:gap-8">
          <Link className="text-sm font-medium hover:text-purple-300 text-white/80 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-purple-300 text-white/80 transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:text-purple-300 text-white/80 transition-colors" href="#about">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-3 ml-6">
          {session ? (
            <>
              <Link href="/dashboards">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-white hover:bg-white/10 border-white/20">
                  <Settings className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => signOut()}
                className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10"
              >
                <User className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-6">
                <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered GitHub Analysis
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
                  Unlock Deep Insights from Any{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                    GitHub Repository
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-white/80 text-lg md:text-xl leading-relaxed">
                  Get comprehensive summaries, track stars, discover cool facts, monitor pull requests, and stay updated
                  with version changes - all in one powerful dashboard.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {session ? (
                  <Link href="/dashboards">
                    <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    size="lg" 
                    className="h-12 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                    onClick={() => signIn('google')}
                  >
                    Start Analyzing <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="lg" className="h-12 px-8 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                  View Demo
                </Button>
              </div>

              {/* Enhanced Dashboard Preview */}
              <div className="w-full max-w-5xl mt-12">
                <div className="relative">
                  {/* Floating elements */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg animate-bounce delay-1000 opacity-80"></div>
                  <div className="absolute -top-2 -right-8 w-6 h-6 bg-gradient-to-br from-green-400 to-blue-400 rounded-full animate-bounce delay-2000 opacity-80"></div>
                  <div className="absolute -bottom-6 left-8 w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full animate-bounce delay-500 opacity-80"></div>
                  
                  <div className="rounded-2xl border border-white/20 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-8 relative overflow-hidden">
                    {/* Stats overlay */}
                    <div className="absolute top-4 right-4 flex gap-3">
                      <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        416 Live Visitors
                      </div>
                      <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        1.7M Unique
                      </div>
                    </div>
                    
                    <div className="text-center space-y-6">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg">
                          <Github className="h-8 w-8 text-white" />
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                          <Code2 className="h-6 w-6 text-white" />
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-lg flex items-center justify-center shadow-lg animate-pulse delay-500">
                          <Layers className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold text-white">Sami-O Dashboard</h3>
                      <p className="text-white/70 max-w-md mx-auto">
                        Comprehensive GitHub repository analysis with AI-powered insights, star tracking, and more.
                      </p>
                      
                      {/* Mini chart visualization */}
                      <div className="flex justify-center mt-6">
                        <div className="flex items-end space-x-1 h-12">
                          {[40, 60, 35, 80, 45, 75, 55, 90, 65].map((height, i) => (
                            <div
                              key={i}
                              className="w-3 bg-gradient-to-t from-purple-400 to-pink-400 rounded-sm animate-pulse"
                              style={{ height: `${height}%`, animationDelay: `${i * 100}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 relative">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center justify-center space-y-8 text-center mb-16">
              <Badge variant="outline" className="border-white/20 text-white bg-white/5 backdrop-blur-sm">Features</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
                Everything You Need to Understand GitHub Repositories
              </h2>
              <p className="max-w-[900px] text-white/70 text-lg leading-relaxed">
                Our AI-powered platform provides comprehensive insights that help developers, project managers, and
                teams make informed decisions.
              </p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 max-w-6xl mx-auto">
              <div className="space-y-8">
                {[
                  { icon: FileText, title: "Smart Repository Summaries", desc: "Get AI-generated summaries that capture the essence, purpose, and key features of any repository." },
                  { icon: Star, title: "Star Tracking & Analytics", desc: "Monitor star growth, identify trending patterns, and understand repository popularity over time." },
                  { icon: Zap, title: "Cool Facts Discovery", desc: "Uncover interesting statistics, contributor insights, and unique repository characteristics." }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-4 group">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-400/20 border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-7 w-7 text-purple-300" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                      <p className="text-white/70">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-8">
                {[
                  { icon: GitPullRequest, title: "Important PR Monitoring", desc: "Stay updated with the latest significant pull requests and their impact on the project." },
                  { icon: TrendingUp, title: "Version Update Alerts", desc: "Get notified about new releases, version changes, and breaking updates automatically." },
                  { icon: BarChart3, title: "Advanced Analytics", desc: "Comprehensive dashboards with charts, graphs, and detailed metrics for deep analysis." }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-4 group">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-400/20 border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-7 w-7 text-blue-300" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                      <p className="text-white/70">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-8 text-center mb-16">
              <Badge variant="outline" className="border-white/20 text-white bg-white/5 backdrop-blur-sm">Pricing</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">Choose Your Plan</h2>
              <p className="max-w-[900px] text-white/70 text-lg leading-relaxed">
                Start free and scale as you grow. All plans include our core features with different usage limits.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              {/* Free Tier */}
              <Card className="relative bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Free</CardTitle>
                  <CardDescription className="text-white/70">Perfect for getting started</CardDescription>
                  <div className="text-4xl font-bold text-white">
                    $0<span className="text-base font-normal text-white/60">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {["5 repository analyses per month", "Basic summaries and insights", "Star tracking", "Email support"].map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-4 w-4 text-green-400 mr-3" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {session ? (
                    <Link href="/dashboards" className="w-full">
                      <Button className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20" variant="outline">
                        Access Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20" 
                      variant="outline"
                      onClick={() => signIn('google')}
                    >
                      Get Started Free
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Pro Tier */}
              <Card className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30 backdrop-blur-xl transform scale-105 shadow-2xl">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-pink-400 text-white border-0">Most Popular</Badge>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Pro</CardTitle>
                  <CardDescription className="text-white/70">For serious developers and teams</CardDescription>
                  <div className="text-4xl font-bold text-white">
                    $19<span className="text-base font-normal text-white/60">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {["100 repository analyses per month", "Advanced AI insights and cool facts", "PR monitoring and alerts", "Version update notifications", "Priority support", "API access"].map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-4 w-4 text-green-400 mr-3" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {session ? (
                    <Link href="/dashboards" className="w-full">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0">Access Dashboard</Button>
                    </Link>
                  ) : (
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0"
                      onClick={() => signIn('google')}
                    >
                      Start Pro Trial
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Enterprise Tier */}
              <Card className="relative bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Enterprise</CardTitle>
                  <CardDescription className="text-white/70">For large teams and organizations</CardDescription>
                  <div className="text-4xl font-bold text-white">
                    $99<span className="text-base font-normal text-white/60">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {["Unlimited repository analyses", "Custom AI models and insights", "Advanced analytics dashboard", "Team collaboration features", "24/7 dedicated support", "Custom integrations"].map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-4 w-4 text-green-400 mr-3" />
                        <span className="text-white/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20" variant="outline">
                    Contact Sales
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
                Ready to Analyze Your First Repository?
              </h2>
              <p className="max-w-[600px] text-white/70 text-lg leading-relaxed">
                Join thousands of developers who trust Sami-O for their GitHub repository insights.
              </p>
              <div className="w-full max-w-md space-y-4">
                <div className="flex gap-3">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm" 
                  />
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0">
                    Get Started
                  </Button>
                </div>
                <p className="text-xs text-white/50">
                  Start with our free tier. No credit card required.{" "}
                  <Link href="/terms" className="underline underline-offset-2 hover:text-white/70">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                { icon: Github, value: "10K+", label: "Repositories Analyzed", gradient: "from-purple-400 to-pink-400" },
                { icon: Shield, value: "99.9%", label: "Uptime Guarantee", gradient: "from-blue-400 to-indigo-400" },
                { icon: Clock, value: "<5s", label: "Average Analysis Time", gradient: "from-green-400 to-teal-400" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center space-y-6 text-center group">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-white">{stat.value}</h3>
                    <p className="text-white/70">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 w-full border-t border-white/10 backdrop-blur-md bg-white/5 relative z-10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/50">© 2024 Sami-O Github Analyzer. All rights reserved.</p>
            <nav className="flex gap-6">
              {["Terms of Service", "Privacy Policy", "Contact"].map((link, i) => (
                <Link key={i} className="text-xs hover:text-white/70 text-white/50 transition-colors" href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}>
                  {link}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

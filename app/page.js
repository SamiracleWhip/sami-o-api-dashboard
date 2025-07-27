// Purple theme styling applied throughout - force update
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
  Menu,
  X,
  Play,
  Edit3,
  BookOpen,
  Copy,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiResponse, setApiResponse] = useState(null)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)
  const [jsonPayload, setJsonPayload] = useState(`{
  "githubUrl": "https://github.com/langchain-ai/langchain"
}`)

  const handleApiRequest = async () => {
    setIsLoading(true)
    setError(null)
    setApiResponse(null)

    try {
      if (!apiKey) {
        throw new Error('API key is required. Please sign up to get your free API key.')
      }

      const payload = JSON.parse(jsonPayload)
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setApiResponse(data)
    } catch (err) {
      console.error('API Request failed:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const generateTestApiKey = async () => {
    setIsGeneratingKey(true)
    try {
      const response = await fetch('/api/create-test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error('Failed to generate test API key')
      }

      const data = await response.json()
      setApiKey(data.apiKey)
      setError(null)
    } catch (err) {
      console.error('Failed to generate test key:', err)
      setError('Failed to generate test API key. Please try signing up for a free account.')
    } finally {
      setIsGeneratingKey(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-purple-500 rounded-full filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-blue-500 rounded-full filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-48 h-48 md:w-96 md:h-96 bg-indigo-500 rounded-full filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-white/10 backdrop-blur-md bg-white/5 relative z-10">
        <Link className="flex items-center justify-center hover:opacity-75 transition-all duration-300 transform hover:scale-105" href="/">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mr-3">
            {/* Custom Baby Icon */}
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Baby head */}
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
              {/* Baby body */}
              <path d="M8 12 C8 16 16 16 16 12" stroke="currentColor" strokeWidth="2" fill="none"/>
              {/* Baby arms */}
              <path d="M6 10 L4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18 10 L20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              {/* Baby legs */}
              <path d="M10 16 L10 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M14 16 L14 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              {/* Baby eyes */}
              <circle cx="10" cy="7" r="0.5" fill="currentColor"/>
              <circle cx="14" cy="7" r="0.5" fill="currentColor"/>
              {/* Baby smile */}
              <path d="M10 9 Q12 11 14 9" stroke="currentColor" strokeWidth="1" fill="none"/>
            </svg>
          </div>
          <span className="font-bold text-lg md:text-xl text-white">Sami-O</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="ml-auto hidden md:flex gap-6 lg:gap-8">
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
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3 ml-6">
          {session ? (
            <>
              <Link href="/dashboards">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-purple-200 hover:bg-purple-500/20 hover:text-purple-100">
                  <Settings className="h-4 w-4" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-200/80 font-medium">
                  {session.user?.name || session.user?.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => signOut()}
                  className="flex items-center gap-2 border-purple-400/40 text-purple-200 hover:bg-purple-500/20 hover:text-purple-100"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline">Sign Out</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm" className="text-purple-200 hover:bg-purple-500/20 hover:text-purple-100">
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden ml-auto p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-b border-white/10 z-50">
          <nav className="px-4 py-4 space-y-4">
            <Link 
              className="block text-white/80 hover:text-purple-300 transition-colors py-2" 
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              className="block text-white/80 hover:text-purple-300 transition-colors py-2" 
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              className="block text-white/80 hover:text-purple-300 transition-colors py-2" 
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 border-t border-white/10 space-y-3">
              {session ? (
                <>
                  <div className="px-3 py-2">
                    <span className="text-sm text-purple-200/80 font-medium">
                      {session.user?.name || session.user?.email}
                    </span>
                  </div>
                  <Link href="/dashboards" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-purple-200 hover:bg-purple-500/20 hover:text-purple-100">
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="w-full justify-start border-purple-400/40 text-purple-200 hover:bg-purple-500/20 hover:text-purple-100"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-purple-200 hover:bg-purple-500/20 hover:text-purple-100">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="w-full py-8 md:py-12 lg:py-20 xl:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-6 md:space-y-8 text-center">
              <div className="space-y-4 md:space-y-6">
                <Badge variant="secondary" className="mb-4 md:mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered GitHub Analysis
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight px-2">
                  Unlock Deep Insights from Any{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                    GitHub Repository
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-white/80 text-base md:text-lg lg:text-xl leading-relaxed px-4">
                  Get comprehensive summaries, track stars, discover cool facts, monitor pull requests, and stay updated
                  with version changes - all in one powerful dashboard.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center px-4 w-full sm:w-auto">
                {session ? (
                  <Link href="/dashboards" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-12 px-6 md:px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 transform hover:scale-105 transition-all duration-300 shadow-2xl">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto h-12 px-6 md:px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                    onClick={() => signIn('google')}
                  >
                    Start Analyzing <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-6 md:px-8 bg-purple-900/20 border-purple-400/40 text-purple-200 hover:bg-purple-500/20 hover:text-purple-100 backdrop-blur-sm">
                  View Demo
                </Button>
              </div>

              {/* Enhanced Dashboard Preview */}
              <div className="w-full max-w-5xl mt-8 md:mt-12 px-4">
                <div className="relative">
                  {/* Floating elements - hidden on small screens */}
                  <div className="hidden md:block absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg animate-bounce delay-1000 opacity-80"></div>
                  <div className="hidden md:block absolute -top-2 -right-8 w-6 h-6 bg-gradient-to-br from-green-400 to-blue-400 rounded-full animate-bounce delay-2000 opacity-80"></div>
                  <div className="hidden md:block absolute -bottom-6 left-8 w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full animate-bounce delay-500 opacity-80"></div>
                  
                  <div className="rounded-xl md:rounded-2xl border border-white/20 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-4 md:p-8 relative overflow-hidden">
                    {/* Stats overlay - responsive positioning */}
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 flex gap-2 md:gap-3">
                      <div className="bg-green-500/20 text-green-300 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        <span className="hidden sm:inline">416 Live Visitors</span>
                        <span className="sm:hidden">416 Live</span>
                      </div>
                      <div className="bg-blue-500/20 text-blue-300 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        <span className="hidden sm:inline">1.7M Unique</span>
                        <span className="sm:hidden">1.7M</span>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-4 md:space-y-6">
                      <div className="flex items-center justify-center space-x-2 md:space-x-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                          {/* Custom Baby Icon */}
                          <svg className="h-6 w-6 md:h-8 md:w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Baby head */}
                            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                            {/* Baby body */}
                            <path d="M8 12 C8 16 16 16 16 12" stroke="currentColor" strokeWidth="2" fill="none"/>
                            {/* Baby arms */}
                            <path d="M6 10 L4 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M18 10 L20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            {/* Baby legs */}
                            <path d="M10 16 L10 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M14 16 L14 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            {/* Baby eyes */}
                            <circle cx="10" cy="7" r="0.5" fill="currentColor"/>
                            <circle cx="14" cy="7" r="0.5" fill="currentColor"/>
                            {/* Baby smile */}
                            <path d="M10 9 Q12 11 14 9" stroke="currentColor" strokeWidth="1" fill="none"/>
                          </svg>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                          <Code2 className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-md md:rounded-lg flex items-center justify-center shadow-lg animate-pulse delay-500">
                          <Layers className="h-4 w-4 md:h-5 md:w-5 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl md:text-2xl font-semibold text-white">Sami-O Dashboard</h3>
                      <p className="text-white/70 max-w-md mx-auto text-sm md:text-base px-4">
                        Comprehensive GitHub repository analysis with AI-powered insights, star tracking, and more.
                      </p>
                      
                      {/* Mini chart visualization */}
                      <div className="flex justify-center mt-4 md:mt-6">
                        <div className="flex items-end space-x-1 h-8 md:h-12">
                          {[40, 60, 35, 80, 45, 75, 55, 90, 65].map((height, i) => (
                            <div
                              key={i}
                              className="w-2 md:w-3 bg-gradient-to-t from-purple-400 to-pink-400 rounded-sm animate-pulse"
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
        <section id="features" className="w-full py-16 md:py-20 lg:py-32 relative">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 text-center mb-12 md:mb-16">
              <Badge variant="outline" className="border-white/20 text-white bg-white/5 backdrop-blur-sm">Features</Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-white px-4">
                Everything You Need to Understand GitHub Repositories
              </h2>
              <p className="max-w-[900px] text-white/70 text-base md:text-lg leading-relaxed px-4">
                Our AI-powered platform provides comprehensive insights that help developers, project managers, and
                teams make informed decisions.
              </p>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 max-w-6xl mx-auto">
              <div className="space-y-6 md:space-y-8">
                {[
                  { icon: FileText, title: "Smart Repository Summaries", desc: "Get AI-generated summaries that capture the essence, purpose, and key features of any repository." },
                  { icon: Star, title: "Star Tracking & Analytics", desc: "Monitor star growth, identify trending patterns, and understand repository popularity over time." },
                  { icon: Zap, title: "Cool Facts Discovery", desc: "Uncover interesting statistics, contributor insights, and unique repository characteristics." }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3 md:space-x-4 group px-4 lg:px-0">
                    <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-400/20 border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <feature.icon className="h-6 w-6 md:h-7 md:w-7 text-purple-300" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg md:text-xl font-bold text-white">{feature.title}</h3>
                      <p className="text-white/70 text-sm md:text-base">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6 md:space-y-8">
                {[
                  { icon: GitPullRequest, title: "Important PR Monitoring", desc: "Stay updated with the latest significant pull requests and their impact on the project." },
                  { icon: TrendingUp, title: "Version Update Alerts", desc: "Get notified about new releases, version changes, and breaking updates automatically." },
                  { icon: BarChart3, title: "Advanced Analytics", desc: "Comprehensive dashboards with charts, graphs, and detailed metrics for deep analysis." }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3 md:space-x-4 group px-4 lg:px-0">
                    <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-400/20 border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <feature.icon className="h-6 w-6 md:h-7 md:w-7 text-blue-300" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg md:text-xl font-bold text-white">{feature.title}</h3>
                      <p className="text-white/70 text-sm md:text-base">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive API Demo Section */}
        <section className="w-full py-16 md:py-20 lg:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 text-center mb-8">
              <Badge variant="outline" className="border-white/20 text-white bg-white/5 backdrop-blur-sm">Live API Demo</Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-white px-4">
                Try Our GitHub Summarizer API
              </h2>
              <p className="max-w-[900px] text-white/70 text-base md:text-lg leading-relaxed px-4">
                Test our AI-powered GitHub analysis API. Sign up for free to get your API key and start analyzing repositories.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex items-center gap-2 border-purple-400/40 text-purple-200 hover:bg-purple-500/20 hover:text-purple-100">
                  <BookOpen className="h-4 w-4" />
                  Documentation
                </Button>
                {!session && (
                  <Button 
                    onClick={() => signIn('google')} 
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0"
                  >
                    Get Free API Key
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
              {/* Request Panel */}
              <Card className="h-fit bg-white/5 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-purple-100">
                      <Play className="h-5 w-5 text-purple-400" />
                      API Request
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-1 border-purple-400/40 text-purple-200 hover:bg-purple-500/20 hover:text-purple-100"
                      >
                        <Edit3 className="h-3 w-3" />
                        {isEditing ? 'Preview' : 'Edit'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(jsonPayload)}
                        className="flex items-center gap-1 border-purple-400/40 text-purple-200 hover:bg-purple-500/20 hover:text-purple-100"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-purple-300/80">
                    POST /api/github-summarizer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-purple-100">API Key:</label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key (smo-...)"
                        className="flex-1 bg-purple-900/20 border-purple-400/40 text-purple-100 placeholder:text-purple-300/60 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400/50"
                      />
                      <Button
                        onClick={generateTestApiKey}
                        disabled={isGeneratingKey}
                        size="sm"
                        variant="outline"
                        className="shrink-0 border-purple-400/40 text-purple-200 hover:bg-purple-500/20 hover:text-purple-100"
                      >
                        {isGeneratingKey ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            Generating...
                          </>
                        ) : (
                          'Generate Test Key'
                        )}
                      </Button>
                    </div>
                    {!session && !apiKey && (
                      <div className="mt-2 p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                        <p className="text-xs text-blue-200">
                          <strong>Need an API key?</strong> Try our test key generator above or sign up for free to get your personal API key.
                        </p>
                        <Button 
                          onClick={() => signIn('google')} 
                          size="sm"
                          className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-xs"
                        >
                          Get Free API Key
                        </Button>
                      </div>
                    )}
                    {session && !apiKey && (
                      <div className="mt-2 p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
                        <p className="text-xs text-green-200">
                          <strong>Welcome back!</strong> Use the test key generator above or go to your dashboard for your personal API keys.
                        </p>
                        <Link href="/dashboards">
                          <Button 
                            size="sm"
                            className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-xs"
                          >
                            Go to Dashboard
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-purple-100">Request Body:</label>
                    {isEditing ? (
                      <textarea
                        value={jsonPayload}
                        onChange={(e) => setJsonPayload(e.target.value)}
                        className="w-full h-32 p-3 text-sm font-mono bg-purple-900/30 border border-purple-400/40 text-purple-100 placeholder:text-purple-300/60 rounded-lg resize-none focus:border-purple-400 focus:ring-purple-400/50"
                        placeholder="Enter JSON payload..."
                      />
                    ) : (
                      <pre className="w-full h-32 p-3 text-sm font-mono bg-purple-900/30 border border-purple-400/40 text-purple-100 rounded-lg overflow-auto">
                        {jsonPayload}
                      </pre>
                    )}
                    {apiKey && (
                      <p className="text-xs text-purple-300/70 mt-2">
                        Your API key: <span className="font-mono bg-purple-800/30 px-2 py-1 rounded-md text-purple-200">{apiKey}</span>
                      </p>
                    )}
                    {error && (
                      <p className="text-xs text-red-300 mt-2">{error}</p>
                    )}
                  </div>
                  <Button 
                    onClick={handleApiRequest} 
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Send Request
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Response Panel */}
              <Card className="h-fit bg-white/5 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-purple-100">
                      <BarChart3 className="h-5 w-5 text-green-400" />
                      API Response
                    </CardTitle>
                    {apiResponse && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(apiResponse, null, 2))}
                        className="flex items-center gap-1 border-purple-400/40 text-purple-200 hover:bg-purple-500/20 hover:text-purple-100"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                    )}
                  </div>
                  <CardDescription className="text-purple-300/80">
                    {apiResponse ? `Status: 200 OK` : error ? `Error` : 'Ready to receive response'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="min-h-32">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                          <span className="text-sm text-purple-200/80">Analyzing repository...</span>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                        <p className="text-sm text-red-300 font-medium">Error:</p>
                        <p className="text-sm text-red-200">{error}</p>
                      </div>
                    ) : apiResponse ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
                          <p className="text-sm font-medium text-green-300">Repository Summary:</p>
                          <div className="text-sm text-green-200 mt-1 whitespace-pre-wrap leading-relaxed">
                            {apiResponse.summary || 'Summary not available'}
                          </div>
                        </div>
                        {apiResponse.repository && (
                          <div className="p-3 bg-purple-500/20 border border-purple-400/30 rounded-lg">
                            <p className="text-sm font-medium text-purple-300">Repository Info:</p>
                            <div className="text-sm text-purple-200 mt-1 space-y-1">
                              <p><strong>Name:</strong> {apiResponse.repository.name}</p>
                              <p><strong>Stars:</strong> {apiResponse.repository.stars?.toLocaleString() || 'N/A'}</p>
                              <p><strong>Language:</strong> {apiResponse.repository.language || 'Not specified'}</p>
                              {apiResponse.repository.latest_release && (
                                <p><strong>Latest Release:</strong> {apiResponse.repository.latest_release.tag_name}</p>
                              )}
                            </div>
                          </div>
                        )}
                        <pre className="w-full p-3 text-xs font-mono bg-purple-900/30 border border-purple-400/40 text-purple-100 rounded-lg overflow-auto max-h-40">
                          {JSON.stringify(apiResponse, null, 2)}
                        </pre>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 text-purple-300/60">
                        <div className="text-center">
                          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Send a request to see the API response</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-16 md:py-20 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 text-center mb-12 md:mb-16">
              <Badge variant="outline" className="border-white/20 text-white bg-white/5 backdrop-blur-sm">Pricing</Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-white px-4">Choose Your Plan</h2>
              <p className="max-w-[900px] text-white/70 text-base md:text-lg leading-relaxed px-4">
                Start free and scale as you grow. All plans include our core features with different usage limits.
              </p>
            </div>
            
            <div className="grid gap-6 md:gap-8 md:grid-cols-3 max-w-6xl mx-auto">
              {/* Free Tier */}
              <Card className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30 backdrop-blur-xl transform scale-105 shadow-2xl">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-pink-400 text-white border-0">Most Popular</Badge>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl md:text-2xl text-white">Free</CardTitle>
                  <CardDescription className="text-white/70">Perfect for getting started</CardDescription>
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    $0<span className="text-base font-normal text-white/60">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <ul className="space-y-2 md:space-y-3">
                    {["5 repository analyses per month", "Basic summaries and insights", "Star tracking", "Email support"].map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-white/80 text-sm md:text-base">{feature}</span>
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
                      Get Started Free
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Pro Tier */}
              <Card className="relative bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <Badge className="absolute -top-3 right-3 bg-orange-500 text-white border-0 text-xs">Coming Soon</Badge>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl md:text-2xl text-white">Pro</CardTitle>
                  <CardDescription className="text-white/70">For serious developers and teams</CardDescription>
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    $19<span className="text-base font-normal text-white/60">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <ul className="space-y-2 md:space-y-3">
                    {["100 repository analyses per month", "Advanced AI insights and cool facts", "PR monitoring and alerts", "Version update notifications", "Priority support", "API access"].map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-white/80 text-sm md:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-purple-900/20 border-purple-400/40 text-purple-200 hover:bg-purple-500/20 hover:text-purple-100 cursor-not-allowed opacity-75" variant="outline" disabled>
                    Coming Soon
                  </Button>
                </CardFooter>
              </Card>

              {/* Enterprise Tier */}
              <Card className="relative bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <Badge className="absolute -top-3 right-3 bg-orange-500 text-white border-0 text-xs">Coming Soon</Badge>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl md:text-2xl text-white">Enterprise</CardTitle>
                  <CardDescription className="text-white/70">For large teams and organizations</CardDescription>
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    $99<span className="text-base font-normal text-white/60">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <ul className="space-y-2 md:space-y-3">
                    {["Unlimited repository analyses", "Custom AI models and insights", "Advanced analytics dashboard", "Team collaboration features", "24/7 dedicated support", "Custom integrations"].map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-white/80 text-sm md:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-purple-900/20 border-purple-400/40 text-purple-200 hover:bg-purple-500/20 hover:text-purple-100 cursor-not-allowed opacity-75" variant="outline" disabled>
                    Coming Soon
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-20 lg:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-white px-4">
                Ready to Analyze Your First Repository?
              </h2>
              <p className="max-w-[600px] text-white/70 text-base md:text-lg leading-relaxed px-4">
                Join thousands of developers who trust Sami-O for their GitHub repository insights.
              </p>
              <div className="w-full max-w-md space-y-4 px-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm" 
                  />
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 w-full sm:w-auto">
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
        <section className="w-full py-16 md:py-20 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 md:gap-12 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                { icon: Github, value: "10K+", label: "Repositories Analyzed", gradient: "from-purple-400 to-pink-400" },
                { icon: Shield, value: "99.9%", label: "Uptime Guarantee", gradient: "from-blue-400 to-indigo-400" },
                { icon: Clock, value: "<5s", label: "Average Analysis Time", gradient: "from-green-400 to-teal-400" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center space-y-4 md:space-y-6 text-center group">
                  <div className={`flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl md:text-4xl font-bold text-white">{stat.value}</h3>
                    <p className="text-white/70 text-sm md:text-base">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 md:py-8 w-full border-t border-white/10 backdrop-blur-md bg-white/5 relative z-10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/50 text-center sm:text-left">© 2024 Sami-O Github Analyzer. All rights reserved.</p>
            <nav className="flex flex-wrap gap-4 md:gap-6 justify-center sm:justify-end">
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

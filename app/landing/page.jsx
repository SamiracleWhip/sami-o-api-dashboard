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
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Github className="h-6 w-6 mr-2" />
          <span className="font-bold text-xl">Sami-O</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#about">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2 ml-4">
          <Link href="/auth/signin">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-8 md:py-16 lg:py-24 xl:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-4">
                  <Zap className="w-3 h-3 mr-1" />
                  AI-Powered GitHub Analysis
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Unlock Deep Insights from Any <span className="text-primary">GitHub Repository</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Get comprehensive summaries, track stars, discover cool facts, monitor pull requests, and stay updated
                  with version changes - all in one powerful dashboard.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/">
                  <Button size="lg" className="h-11 px-8">
                    Start Analyzing <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="h-11 px-8 bg-transparent">
                  View Demo
                </Button>
              </div>
              <div className="w-full max-w-4xl mt-8">
                <div className="rounded-lg border shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 flex items-center justify-center min-h-[400px]">
                  <div className="text-center space-y-4">
                    <Github className="h-24 w-24 mx-auto text-muted-foreground" />
                    <h3 className="text-2xl font-semibold">Sami-O Dashboard</h3>
                    <p className="text-muted-foreground max-w-md">
                      Comprehensive GitHub repository analysis with AI-powered insights, star tracking, and more.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline">Features</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need to Understand GitHub Repositories
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered platform provides comprehensive insights that help developers, project managers, and
                  teams make informed decisions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Smart Repository Summaries</h3>
                      <p className="text-muted-foreground">
                        Get AI-generated summaries that capture the essence, purpose, and key features of any
                        repository.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Star Tracking & Analytics</h3>
                      <p className="text-muted-foreground">
                        Monitor star growth, identify trending patterns, and understand repository popularity over time.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Cool Facts Discovery</h3>
                      <p className="text-muted-foreground">
                        Uncover interesting statistics, contributor insights, and unique repository characteristics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <GitPullRequest className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Important PR Monitoring</h3>
                      <p className="text-muted-foreground">
                        Stay updated with the latest significant pull requests and their impact on the project.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Version Update Alerts</h3>
                      <p className="text-muted-foreground">
                        Get notified about new releases, version changes, and breaking updates automatically.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Advanced Analytics</h3>
                      <p className="text-muted-foreground">
                        Comprehensive dashboards with charts, graphs, and detailed metrics for deep analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline">Pricing</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose Your Plan</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start free and scale as you grow. All plans include our core features with different usage limits.
                </p>
              </div>
            </div>
            <div className="grid gap-6 mt-12 md:grid-cols-3 md:gap-8">
              {/* Free Tier */}
              <Card className="relative border-primary">
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">Most Popular</Badge>
                <CardHeader>
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="text-4xl font-bold">
                    $0<span className="text-base font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">5 repository analyses per month</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Basic summaries and insights</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Star tracking</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Email support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/auth/signin" className="w-full">
                    <Button className="w-full">
                      Get Started Free
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Pro Tier */}
              <Card className="relative">
                <Badge className="absolute -top-2 right-3 bg-orange-500 text-white border-0 text-xs">Coming Soon</Badge>
                <CardHeader>
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <CardDescription>For serious developers and teams</CardDescription>
                  <div className="text-4xl font-bold">
                    $19<span className="text-base font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">100 repository analyses per month</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Advanced AI insights and cool facts</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">PR monitoring and alerts</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Version update notifications</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">API access</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-transparent cursor-not-allowed opacity-75" variant="outline" disabled>
                    Coming Soon
                  </Button>
                </CardFooter>
              </Card>

              {/* Enterprise Tier */}
              <Card className="relative">
                <Badge className="absolute -top-2 right-3 bg-orange-500 text-white border-0 text-xs">Coming Soon</Badge>
                <CardHeader>
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription>For large teams and organizations</CardDescription>
                  <div className="text-4xl font-bold">
                    $99<span className="text-base font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Unlimited repository analyses</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Custom AI models and insights</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Advanced analytics dashboard</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Team collaboration features</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">24/7 dedicated support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Custom integrations</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-transparent cursor-not-allowed opacity-75" variant="outline" disabled>
                    Coming Soon
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Analyze Your First Repository?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of developers who trust Sami-O for their GitHub repository insights.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex gap-2">
                  <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1" />
                  <Button type="submit">Get Started</Button>
                </form>
                <p className="text-xs text-muted-foreground">
                  Start with our free tier. No credit card required.{" "}
                  <Link href="/terms" className="underline underline-offset-2">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Github className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold">10K+</h3>
                  <p className="text-muted-foreground">Repositories Analyzed</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold">99.9%</h3>
                  <p className="text-muted-foreground">Uptime Guarantee</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold">{"<5s"}</h3>
                  <p className="text-muted-foreground">Average Analysis Time</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 Sami-O Github Analyzer. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/terms">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="/contact">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  )
} 
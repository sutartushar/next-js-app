'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Search, Brain, BarChart3, Sparkles, Lock } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Keen</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </a>
            <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition">
              Demo
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
              Pricing
            </a>
          </div>
          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-primary/90">
              Try Demo <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center space-y-8">
          <Badge className="mx-auto" variant="secondary">
            <Sparkles className="w-3 h-3 mr-2" />
            AI-Powered Document Intelligence
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground text-balance">
            Unlock Intelligence in Your Documents
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Experience the future of document analysis. Semantic search, AI-generated insights, and knowledge graphs—all in one intelligent platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Explore Demo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Search,
              title: 'Semantic Search',
              description: 'Find exactly what you need using AI-powered vector search, not just keywords.',
            },
            {
              icon: Brain,
              title: 'AI Insights',
              description: 'Automatic summarization, entity extraction, and topic modeling of your documents.',
            },
            {
              icon: BarChart3,
              title: 'Knowledge Graphs',
              description: 'Visualize relationships between documents and discover hidden connections.',
            },
          ].map((feature) => (
            <div key={feature.title} className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition">
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-card/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">Everything you need for intelligent document management</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Multi-Workspace Support',
                description: 'Organize documents into separate workspaces with team collaboration features.',
              },
              {
                title: 'Real-time Analytics',
                description: 'Track search trends, popular documents, and workspace activity in real-time.',
              },
              {
                title: 'Advanced Filtering',
                description: 'Filter by tags, sentiment, topics, and custom metadata for precise discovery.',
              },
              {
                title: 'Enterprise Security',
                description: 'Role-based access control and end-to-end encryption for your data.',
              },
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, React, and modern AI. Powered by Vercel.</p>
        </div>
      </footer>
    </div>
  )
}

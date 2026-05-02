'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const searchTrendData = [
  { date: 'Mon', searches: 240, insights: 80 },
  { date: 'Tue', searches: 320, insights: 95 },
  { date: 'Wed', searches: 280, insights: 85 },
  { date: 'Thu', searches: 380, insights: 120 },
  { date: 'Fri', searches: 420, insights: 145 },
  { date: 'Sat', searches: 240, insights: 60 },
  { date: 'Sun', searches: 180, insights: 40 },
]

const topicsData = [
  { name: 'AI & Automation', value: 28, color: '#5856d6' },
  { name: 'Cloud Computing', value: 22, color: '#ff5722' },
  { name: 'Data Science', value: 18, color: '#4caf50' },
  { name: 'Security', value: 15, color: '#ffc107' },
  { name: 'Other', value: 17, color: '#9e9e9e' },
]

const documentMetricsData = [
  { category: 'Reports', indexed: 89, analyzed: 78 },
  { category: 'Articles', indexed: 156, analyzed: 142 },
  { category: 'Whitepapers', indexed: 45, analyzed: 41 },
  { category: 'Case Studies', indexed: 67, analyzed: 61 },
  { category: 'Presentations', indexed: 34, analyzed: 28 },
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-2">Insights and trends from your document intelligence platform</p>
            </div>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Last 7 Days
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Searches', value: '2,240', change: '+12.5%', icon: '🔍' },
            { label: 'Documents Indexed', value: '391', change: '+8.2%', icon: '📄' },
            { label: 'Insights Generated', value: '549', change: '+23.1%', icon: '⚡' },
            { label: 'Avg. Response Time', value: '245ms', change: '-5.3%', icon: '⏱️' },
          ].map((metric) => (
            <Card key={metric.label} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{metric.icon}</div>
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {metric.change}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Search Trends */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="font-semibold text-lg mb-6">Search Activity & Insights</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={searchTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="searches" stroke="#5856d6" strokeWidth={2} dot={{ fill: '#5856d6' }} />
                <Line type="monotone" dataKey="insights" stroke="#ff5722" strokeWidth={2} dot={{ fill: '#ff5722' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Topics Distribution */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Document Topics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topicsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#5856d6"
                  dataKey="value"
                >
                  {topicsData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Document Metrics */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-6">Document Processing by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={documentMetricsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="category" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="indexed" fill="#5856d6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="analyzed" fill="#ff5722" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Insights Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <h3 className="font-semibold text-lg mb-4">Quick Insights</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Search volume increased 12.5% week-over-week, with peak activity on Fridays</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>AI & Automation topics dominate at 28% of all documents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Average response time improved by 5.3% with optimized indexing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Articles represent the largest document category at 156 indexed items</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
            <h3 className="font-semibold text-lg mb-4">Recommendations</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">→</span>
                <span>Consider creating specialized collections for high-frequency topics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">→</span>
                <span>Schedule batch indexing during off-peak hours to improve performance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">→</span>
                <span>Leverage knowledge graph to surface cross-topic relationships</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">→</span>
                <span>Monitor emerging topics to stay ahead of market trends</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  )
}

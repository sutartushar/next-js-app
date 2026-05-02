'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Search,
  Upload,
  Zap,
  TrendingUp,
  FileText,
  Tag,
  ChevronRight,
  Filter,
  Plus,
  Brain,
  BarChart3,
} from 'lucide-react'

// Mock data
const mockDocuments = [
  {
    id: '1',
    title: 'Q4 2024 Market Analysis Report',
    preview: 'Comprehensive analysis of market trends and competitive landscape...',
    tags: ['market', 'analysis', 'Q4'],
    relevance: 0.92,
    date: '2024-12-15',
  },
  {
    id: '2',
    title: 'AI Innovation Strategy Document',
    preview: 'Strategic initiatives for AI integration and machine learning applications...',
    tags: ['AI', 'strategy', 'innovation'],
    relevance: 0.88,
    date: '2024-12-10',
  },
  {
    id: '3',
    title: 'Customer Feedback Summary 2024',
    preview: 'Aggregated customer insights and satisfaction metrics across all regions...',
    tags: ['feedback', 'customer', 'analytics'],
    relevance: 0.85,
    date: '2024-12-08',
  },
]

const mockSearchResults = [
  {
    id: 'r1',
    title: 'Market Trends in Digital Transformation',
    snippet: '...digital transformation has accelerated significantly in recent years. Companies investing in AI and automation...',
    relevance: 0.94,
  },
  {
    id: 'r2',
    title: 'Enterprise AI Implementation Guide',
    snippet: '...successfully implement AI systems in enterprise environments. Key considerations include data quality, infrastructure...',
    relevance: 0.89,
  },
  {
    id: 'r3',
    title: 'Future of Work Report 2025',
    snippet: '...remote work adoption continues to shape organizational strategies. New collaboration tools and AI assistants...',
    relevance: 0.84,
  },
]

const mockAnalytics = [
  { label: 'Total Documents', value: '247', icon: FileText, color: 'text-primary' },
  { label: 'Searches Today', value: '1,240', icon: Search, color: 'text-accent' },
  { label: 'Insights Generated', value: '89', icon: Zap, color: 'text-yellow-500' },
  { label: 'Avg. Relevance', value: '89%', icon: TrendingUp, color: 'text-green-500' },
]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('documents')
  const [isSearching, setIsSearching] = useState(false)
  const [documents, setDocuments] = useState(mockDocuments)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => setIsSearching(false), 600)
  }

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredSearchResults = mockSearchResults.filter((result) =>
    result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUpload = () => {
    if (!uploadTitle.trim()) return

    setIsUploading(true)
    setTimeout(() => {
      const newDoc = {
        id: String(documents.length + 1),
        title: uploadTitle,
        preview: 'Newly uploaded document. Analysis and insights will be generated automatically...',
        tags: ['new', 'uploaded'],
        relevance: 0.95,
        date: new Date().toISOString().split('T')[0],
      }
      setDocuments([newDoc, ...documents])
      setUploadTitle('')
      setUploadFile(null)
      setShowUploadModal(false)
      setIsUploading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-xl">Keen</h1>
                <p className="text-xs text-muted-foreground">Document Intelligence Platform</p>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowUploadModal(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Ask Keen anything about your documents..."
                className="pl-10 py-2 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching} className="bg-primary hover:bg-primary/90">
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            <Button variant="outline">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {mockAnalytics.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-border">
          {['documents', 'search', 'insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-medium text-sm transition ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Documents</h2>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Workspace
              </Button>
            </div>

            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <Card key={doc.id} className="p-6 hover:border-primary/50 transition cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition mb-2">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{doc.preview}</p>
                      <div className="flex gap-2 flex-wrap">
                        {doc.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-primary">{Math.round(doc.relevance * 100)}%</div>
                      <p className="text-xs text-muted-foreground">Relevance</p>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition mt-2" />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No documents found matching your search.</p>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Search Results</h2>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? `Results for "${searchQuery}"` : 'Semantic search powered by AI embeddings'}
              </p>
            </div>

            {filteredSearchResults.length > 0 ? (
              filteredSearchResults.map((result) => (
                <Card key={result.id} className="p-6 hover:border-primary/50 transition cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition mb-2">{result.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{result.snippet}</p>
                    </div>
                    <div className="text-right ml-4 flex flex-col items-end">
                      <div className="text-2xl font-bold text-accent">{Math.round(result.relevance * 100)}%</div>
                      <p className="text-xs text-muted-foreground">Match</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No search results found. Try different keywords.</p>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">AI-Generated Insights</h2>
              <p className="text-sm text-muted-foreground">Automatic summaries, entities, and topics from your documents</p>
            </div>

            <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="flex gap-4">
                <Zap className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Top Insights</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">→</span>
                      <span>AI and automation are key themes across 89% of documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">→</span>
                      <span>Market analysis shows 23% YoY growth in digital transformation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">→</span>
                      <span>Customer satisfaction metrics improved across all regions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1">→</span>
                      <span>Emerging topics: Generative AI, Data Privacy, Cloud Migration</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: 'Entities Extracted', value: '127', icon: Brain },
                { label: 'Topics Identified', value: '34', icon: Tag },
                { label: 'Sentiment Score', value: 'Positive', icon: TrendingUp },
              ].map((item) => (
                <Card key={item.label} className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <item.icon className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </div>
                  <p className="text-2xl font-bold">{item.value}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Upload Document</h2>
                <p className="text-sm text-muted-foreground">Add a new document to your workspace</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Document Title</label>
                  <Input
                    placeholder="Enter document title..."
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    disabled={isUploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">File</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      id="file-input"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      disabled={isUploading}
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">
                        {uploadFile ? uploadFile.name : 'Drag and drop or click to select'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, TXT supported</p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowUploadModal(false)
                    setUploadTitle('')
                    setUploadFile(null)
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleUpload}
                  disabled={isUploading || !uploadTitle.trim()}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

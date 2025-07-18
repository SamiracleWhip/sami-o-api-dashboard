import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { summarizeRepository } from './chain'

// Helper function to validate API key
async function validateApiKey(apiKey) {
  if (!apiKey) {
    return { valid: false, error: 'API key is required', status: 400 }
  }

  try {
    // Query the database to check if the API key exists and is active
    // Also get user information
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select(`
        id, 
        name, 
        status, 
        api_key, 
        usage_count, 
        usage_limit, 
        permissions,
        user_id,
        users!inner(id, name, email)
      `)
      .eq('api_key', apiKey)
      .eq('status', 'active')
      .single()

    if (error) {
      // If no matching record found
      if (error.code === 'PGRST116') {
        return { valid: false, error: 'Invalid API key', status: 401 }
      }
      
      console.error('Database error during API key validation:', error)
      return { valid: false, error: 'Database error occurred', status: 500 }
    }

    if (!data) {
      return { valid: false, error: 'Invalid API key', status: 401 }
    }

    // Check usage limit
    if (data.usage_count >= data.usage_limit) {
      return { valid: false, error: 'API key usage limit exceeded', status: 429 }
    }

    // Update usage count
    await supabaseAdmin
      .from('api_keys')
      .update({ 
        usage_count: data.usage_count + 1,
        last_used: new Date().toISOString()
      })
      .eq('id', data.id)

    return { 
      valid: true, 
      keyInfo: {
        id: data.id,
        name: data.name,
        permissions: data.permissions,
        userId: data.user_id,
        user: data.users
      }
    }
  } catch (error) {
    console.error('API key validation error:', error)
    return { valid: false, error: 'Internal server error', status: 500 }
  }
}

// Helper function to extract GitHub repo info from URL
function parseGitHubUrl(url) {
  const githubUrlPattern = /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/?$/
  const match = url.match(githubUrlPattern)
  
  if (!match) {
    return null
  }
  
  return {
    owner: match[1],
    repo: match[2]
  }
}

// Helper function to fetch GitHub repository data
async function fetchGitHubRepoData(owner, repo) {
  try {
    // Fetch repository information
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Sami-O-API-Dashboard'
      }
    })

    if (!repoResponse.ok) {
      if (repoResponse.status === 404) {
        throw new Error('Repository not found')
      }
      throw new Error(`GitHub API error: ${repoResponse.status}`)
    }

    const repoData = await repoResponse.json()

    // Fetch README content
    let readmeContent = null
    try {
      const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Sami-O-API-Dashboard'
        }
      })

      if (readmeResponse.ok) {
        const readmeData = await readmeResponse.json()
        readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8')
      }
    } catch (error) {
      console.log('README not found or inaccessible')
    }

    // Fetch recent commits
    let recentCommits = []
    try {
      const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Sami-O-API-Dashboard'
        }
      })

      if (commitsResponse.ok) {
        recentCommits = await commitsResponse.json()
      }
    } catch (error) {
      console.log('Could not fetch commits')
    }

    return {
      repository: repoData,
      readme: readmeContent,
      recentCommits: recentCommits.map(commit => ({
        sha: commit.sha.substring(0, 7),
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date
      }))
    }
  } catch (error) {
    throw error
  }
}

// Helper function to generate repository summary
async function generateSummary(repoData) {
  console.log('Generating summary for:', repoData.repository.name)
  
  const { repository, readme, recentCommits } = repoData
  
  // Get AI-powered README summary
  let aiSummary
  try {
    console.log('Calling summarizeRepository...')
    aiSummary = await summarizeRepository(readme)
    console.log('AI Summary result:', aiSummary)
  } catch (error) {
    console.error('Error in summarizeRepository:', error)
    // Fallback summary
    aiSummary = {
      summary: 'Failed to generate AI summary',
      cool_facts: ['An error occurred while analyzing the repository']
    }
  }
  
  const summary = {
    name: repository.name,
    fullName: repository.full_name,
    description: repository.description || 'No description provided',
    language: repository.language || 'Not specified',
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    openIssues: repository.open_issues_count,
    size: repository.size,
    createdAt: repository.created_at,
    updatedAt: repository.updated_at,
    defaultBranch: repository.default_branch,
    isPrivate: repository.private,
    topics: repository.topics || [],
    license: repository.license?.name || 'No license specified',
    homepage: repository.homepage || null,
    hasReadme: !!readme,
    readmeSummary: aiSummary.summary,
    coolFacts: aiSummary.cool_facts,
    recentActivity: recentCommits.length > 0 ? {
      totalCommits: recentCommits.length,
      latestCommit: recentCommits[0],
      commits: recentCommits
    } : null,
    metrics: {
      activityScore: calculateActivityScore(repository, recentCommits),
      popularityScore: calculatePopularityScore(repository)
    }
  }

  return summary
}

// Helper functions for calculating scores
function calculateActivityScore(repository, recentCommits) {
  // Simple scoring based on recent activity and repo age
  const daysAgo = (new Date() - new Date(repository.updated_at)) / (1000 * 60 * 60 * 24)
  const commitsScore = Math.min(recentCommits.length * 10, 50)
  const freshnessScore = Math.max(0, 50 - daysAgo * 2)
  return Math.round(commitsScore + freshnessScore)
}

function calculatePopularityScore(repository) {
  // Simple scoring based on stars, forks, and watchers
  const starsScore = Math.min(repository.stargazers_count / 100, 60)
  const forksScore = Math.min(repository.forks_count / 50, 30)
  const watchersScore = Math.min(repository.watchers_count / 100, 10)
  return Math.round(starsScore + forksScore + watchersScore)
}

// POST - Summarize GitHub repository
export async function POST(request) {
  try {
    console.log('POST /api/github-summarizer called')
    
    const body = await request.json()
    const { githubUrl } = body
    console.log('Request body:', body)

    // Get API key from header
    const apiKey = request.headers.get('x-api-key')
    console.log('API Key provided:', !!apiKey)

    // Validate API key
    const validation = await validateApiKey(apiKey)
    if (!validation.valid) {
      console.log('API key validation failed:', validation.error)
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status }
      )
    }

    // Validate GitHub URL
    if (!githubUrl) {
      return NextResponse.json(
        { error: 'GitHub URL is required' },
        { status: 400 }
      )
    }

    const repoInfo = parseGitHubUrl(githubUrl)
    if (!repoInfo) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL format. Please provide a valid GitHub repository URL.' },
        { status: 400 }
      )
    }

    console.log('Parsed repo info:', repoInfo)

    // Fetch repository data
    let repoData
    try {
      console.log('Fetching GitHub repo data...')
      repoData = await fetchGitHubRepoData(repoInfo.owner, repoInfo.repo)
      console.log('Successfully fetched repo data')
    } catch (error) {
      console.error('Error fetching GitHub data:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch repository data' },
        { status: error.message === 'Repository not found' ? 404 : 500 }
      )
    }

    // Generate summary
    console.log('Generating summary...')
    const summary = await generateSummary(repoData)
    console.log('Summary generated successfully')

    return NextResponse.json({
      success: true,
      summary,
      apiKeyInfo: {
        name: validation.keyInfo.name,
        permissions: validation.keyInfo.permissions,
        user: {
          id: validation.keyInfo.userId,
          name: validation.keyInfo.user.name,
          email: validation.keyInfo.user.email
        }
      },
      requestedUrl: githubUrl,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in POST /api/github-summarizer:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}

// GET - Get endpoint information
export async function GET() {
  try {
    return NextResponse.json({
      endpoint: '/api/github-summarizer',
      description: 'Summarize GitHub repositories with API key authentication',
      methods: ['POST'],
      authentication: {
        type: 'header',
        header: 'x-api-key',
        description: 'Provide your API key in the x-api-key header'
      },
      requiredFields: ['githubUrl'],
      example: {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'smo-your-api-key-here'
        },
        body: {
          githubUrl: 'https://github.com/owner/repository'
        }
      },
      curlExample: 'curl -X POST http://localhost:3005/api/github-summarizer -H "Content-Type: application/json" -H "x-api-key: smo-your-api-key-here" -d \'{"githubUrl": "https://github.com/owner/repository"}\'',
      features: [
        'Repository metadata extraction',
        'AI-powered README content summarization',
        'Interesting project facts extraction',
        'Recent commit history',
        'Activity and popularity scoring',
        'API key validation and usage tracking',
        'User-specific API key management'
      ]
    })
  } catch (error) {
    console.error('Error in GET /api/github-summarizer:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}


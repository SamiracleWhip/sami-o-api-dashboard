import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { summarizeRepository, generateUnifiedSummary } from './chain'
import { validateApiKey, generateRateLimitHeaders, createRateLimitResponse } from '@/lib/api-auth'

// Simple in-memory cache for GitHub API responses (5 minute TTL)
const githubCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCacheKey(owner, repo) {
  return `${owner}/${repo}`
}

function getCachedData(key) {
  const cached = githubCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

function setCachedData(key, data) {
  githubCache.set(key, {
    data,
    timestamp: Date.now()
  })
}

// Local fallback function for unified summary
function generateFallbackUnifiedSummary(repositoryData) {
  console.log('Using fallback unified summarization')
  
  const summary = []
  
  // Project overview
  summary.push(`${repositoryData.name} is a ${repositoryData.language || 'software'} project`)
  if (repositoryData.description) {
    summary.push(`that ${repositoryData.description.toLowerCase()}`)
  }
  summary.push('.')
  
  // Statistics
  summary.push(`This repository has ${repositoryData.stars?.toLocaleString() || '0'} stars, ${repositoryData.forks?.toLocaleString() || '0'} forks, and ${repositoryData.watchers?.toLocaleString() || '0'} watchers.`)
  
  // Language and license
  if (repositoryData.language) {
    summary.push(`It is primarily written in ${repositoryData.language}.`)
  }
  if (repositoryData.license && repositoryData.license !== 'No license specified') {
    summary.push(`The project is licensed under ${repositoryData.license}.`)
  }
  
  // Topics
  if (repositoryData.topics && repositoryData.topics.length > 0) {
    summary.push(`Key topics include: ${repositoryData.topics.join(', ')}.`)
  }
  
  // Latest release
  if (repositoryData.latestRelease) {
    summary.push(`The latest release is ${repositoryData.latestRelease.tag_name}.`)
  }
  
  // README summary
  if (repositoryData.readmeSummary && repositoryData.readmeSummary !== 'No README summary available') {
    summary.push(`According to the README: ${repositoryData.readmeSummary}`)
  }
  
  // Cool facts
  if (repositoryData.coolFacts && repositoryData.coolFacts.length > 0) {
    summary.push(`Notable aspects include: ${repositoryData.coolFacts.join('; ')}.`)
  }
  
  // Recent activity
  if (repositoryData.recentActivity) {
    summary.push(`Recent activity shows ${repositoryData.recentActivity.totalCommits} commits.`)
  }
  
  return summary.join(' ')
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
    // Check cache first
    const cacheKey = getCacheKey(owner, repo)
    const cached = getCachedData(cacheKey)
    if (cached) {
      console.log('Serving from cache for:', owner, repo)
      return cached
    }

    // Make all API calls in parallel for better performance
    const [repoResponse, releaseResponse, readmeResponse, commitsResponse] = await Promise.allSettled([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Sami-O-API-Dashboard'
        }
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Sami-O-API-Dashboard'
        }
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Sami-O-API-Dashboard'
        }
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Sami-O-API-Dashboard'
        }
      })
    ])

    // Process repository data
    if (repoResponse.status === 'rejected' || !repoResponse.value.ok) {
      if (repoResponse.value?.status === 404) {
        throw new Error('Repository not found')
      }
      throw new Error(`GitHub API error: ${repoResponse.value?.status || 'Unknown error'}`)
    }
    const repoData = await repoResponse.value.json()

    // Process latest release
    let latestRelease = null
    if (releaseResponse.status === 'fulfilled' && releaseResponse.value.ok) {
      try {
        latestRelease = await releaseResponse.value.json()
      } catch (error) {
        console.log('Failed to parse release data')
      }
    }

    // Process README content
    let readmeContent = null
    if (readmeResponse.status === 'fulfilled' && readmeResponse.value.ok) {
      try {
        const readmeData = await readmeResponse.value.json()
        readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8')
      } catch (error) {
        console.log('Failed to parse README data')
      }
    }

    // Process recent commits
    let recentCommits = []
    if (commitsResponse.status === 'fulfilled' && commitsResponse.value.ok) {
      try {
        const commitsData = await commitsResponse.value.json()
        recentCommits = commitsData
      } catch (error) {
        console.log('Failed to parse commits data')
      }
    }

    const dataToCache = {
      repository: repoData,
      latestRelease: latestRelease ? {
        tag_name: latestRelease.tag_name,
        name: latestRelease.name,
        published_at: latestRelease.published_at,
        body: latestRelease.body,
        html_url: latestRelease.html_url
      } : null,
      readme: readmeContent,
      recentCommits: recentCommits.map(commit => ({
        sha: commit.sha.substring(0, 7),
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date
      }))
    }
    setCachedData(cacheKey, dataToCache)
    return dataToCache
  } catch (error) {
    throw error
  }
}

// Modified function to generate unified summary
async function generateSummary(repoData) {
  console.log('Generating summary for:', repoData.repository.name)
  
  const { repository, readme, recentCommits } = repoData
  
  // Get AI-powered README summary first (with timeout)
  let aiSummary
  try {
    console.log('Calling summarizeRepository...')
    const summaryPromise = summarizeRepository(readme)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Summary generation timeout')), 8000)
    )
    
    aiSummary = await Promise.race([summaryPromise, timeoutPromise])
    console.log('AI Summary result:', aiSummary)
  } catch (error) {
    console.error('Error in summarizeRepository:', error)
    // Fallback summary
    aiSummary = {
      summary: 'Failed to generate AI summary',
      cool_facts: ['An error occurred while analyzing the repository']
    }
  }
  
  // Prepare repository data for unified summary (optimized)
  const repositoryData = {
    name: repository.name,
    fullName: repository.full_name,
    description: repository.description || 'No description provided',
    language: repository.language || 'Not specified',
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    watchers: repository.watchers_count,
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
    latestRelease: repoData.latestRelease,
    metrics: {
      activityScore: calculateActivityScore(repository, recentCommits),
      popularityScore: calculatePopularityScore(repository)
    }
  }

  // Generate unified natural language summary (with timeout)
  console.log('Generating unified summary...')
  let unifiedSummary
  try {
    const unifiedPromise = generateUnifiedSummary(repositoryData)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Unified summary timeout')), 10000)
    )
    
    unifiedSummary = await Promise.race([unifiedPromise, timeoutPromise])
  } catch (error) {
    console.error('Error generating unified summary:', error)
    unifiedSummary = generateFallbackUnifiedSummary(repositoryData)
  }
  
  return {
    summary: unifiedSummary,
    repository: {
      name: repository.name,
      full_name: repository.full_name,
      description: repository.description,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      watchers: repository.watchers_count,
      language: repository.language,
      created_at: repository.created_at,
      updated_at: repository.updated_at,
      html_url: repository.html_url,
      latest_release: repoData.latestRelease
    }
  }
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
  const startTime = Date.now()
  
  try {
    console.log('POST /api/github-summarizer called')
    
    const body = await request.json()
    const { githubUrl } = body
    console.log('Request body:', body)

    // Get API key from header
    const apiKey = request.headers.get('x-api-key')
    console.log('API Key provided:', !!apiKey)

    // Validate API key and check rate limits
    const validation = await validateApiKey(apiKey)
    if (!validation.valid) {
      console.log('API key validation failed:', validation.error)
      
      const response = createRateLimitResponse(validation)
      return NextResponse.json(response.body, {
        status: response.status,
        headers: response.headers
      })
    }

    // Validate GitHub URL
    if (!githubUrl) {
      return NextResponse.json(
        { error: 'GitHub URL is required' },
        { status: 400 }
      )
    }

    // Parse GitHub URL
    const repoInfo = parseGitHubUrl(githubUrl)
    if (!repoInfo) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL format. Please use: https://github.com/owner/repository' },
        { status: 400 }
      )
    }

    // Fetch repository data
    console.log('Fetching repository data...')
    const fetchStartTime = Date.now()
    const repoData = await fetchGitHubRepoData(repoInfo.owner, repoInfo.repo)
    const fetchTime = Date.now() - fetchStartTime
    console.log(`Repository data fetched in ${fetchTime}ms`)

    // Generate summary
    console.log('Generating summary...')
    const summaryStartTime = Date.now()
    const summary = await generateSummary(repoData)
    const summaryTime = Date.now() - summaryStartTime
    console.log(`Summary generated in ${summaryTime}ms`)

    // Add rate limit headers to successful response
    const responseHeaders = generateRateLimitHeaders(validation.keyInfo)
    
    // Add performance headers
    const totalTime = Date.now() - startTime
    responseHeaders['X-Response-Time'] = `${totalTime}ms`
    responseHeaders['X-Fetch-Time'] = `${fetchTime}ms`
    responseHeaders['X-Summary-Time'] = `${summaryTime}ms`

    return NextResponse.json({
      success: true,
      summary: summary.summary,
      repository: summary.repository,
      apiKeyInfo: {
        name: validation.keyInfo.name,
        permissions: validation.keyInfo.permissions,
        user: {
          id: validation.keyInfo.userId,
          name: validation.keyInfo.user.name,
          email: validation.keyInfo.user.email
        },
        usage: {
          limit: validation.keyInfo.usageLimit,
          used: validation.keyInfo.usageCount,
          remaining: Math.max(0, validation.keyInfo.usageLimit - validation.keyInfo.usageCount)
        }
      },
      requestedUrl: githubUrl,
      timestamp: new Date().toISOString(),
      performance: {
        totalTime: `${totalTime}ms`,
        fetchTime: `${fetchTime}ms`,
        summaryTime: `${summaryTime}ms`
      }
    }, {
      headers: responseHeaders
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
      description: 'Summarize GitHub repositories with unified natural language summaries',
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
        'Unified natural language repository summaries',
        'Repository metadata extraction',
        'Stars, forks, and watchers count',
        'Latest release information',
        'AI-powered README content analysis',
        'Interesting project facts integration',
        'Recent commit history analysis',
        'Activity and popularity scoring',
        'API key validation and usage tracking',
        'User-specific API key management'
      ],
      responseFormat: {
        success: 'boolean',
        summary: 'string (natural language summary combining all repository information)',
        repository: 'object (repository metadata)',
        apiKeyInfo: 'object (API key usage information)',
        requestedUrl: 'string',
        timestamp: 'string'
      }
    })
  } catch (error) {
    console.error('Error in GET /api/github-summarizer:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}


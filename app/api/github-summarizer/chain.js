import { z } from 'zod'

// Define the output schema using Zod
const summarySchema = z.object({
  summary: z.string().describe('A clear, technical summary (100-300 words) explaining what the project does, key technologies used, target audience, and main features'),
  cool_facts: z.array(z.string()).describe('3-5 specific, interesting facts about the project such as unique features, performance metrics, integrations, or architecture decisions')
})

// Helper function to create summarization chain
async function createSummarizationChain() {
  const { ChatOpenAI } = await import('@langchain/openai')
  const { ChatPromptTemplate } = await import('@langchain/core/prompts')

  // Initialize the LLM with structured output and optimized settings
  const llm = new ChatOpenAI({
    model: 'gpt-3.5-turbo',
    temperature: 0.1,
    maxTokens: 200, // Reduced for faster generation
    timeout: 8000 // 8 second timeout
  })

  // Bind the structured output schema to the model
  const structuredLlm = llm.withStructuredOutput(summarySchema, {
    name: 'github_summary'
  })

  // Create prompt template with more explicit instructions
  const promptTemplate = ChatPromptTemplate.fromTemplate(`
    You are an expert software engineer analyzing a GitHub repository. Based on the README content below, provide a concise technical summary and interesting facts.

    README Content:
    {readmeContent}

    Instructions:
    1. SUMMARY: Write a clear, technical summary (80-150 words) that explains:
       - What the project does and its main purpose
       - Key technologies and frameworks used
       - Target audience or use cases
       - Main features or capabilities
       
    2. COOL FACTS: List 2-3 specific, interesting facts about this project such as:
       - Unique technical features or innovations
       - Performance metrics or capabilities
       - Notable integrations or dependencies
       - Interesting architecture decisions
       - Community stats or adoption
       - Specific use cases or industries it serves
       
    Make the summary informative and the facts genuinely interesting - avoid generic statements.
    Keep responses concise for faster processing.
    
    Return your response in the exact format specified by the schema.
  `)

  // Create the chain by piping prompt to structured LLM
  return promptTemplate.pipe(structuredLlm)
}

// Enhanced fallback function for better text summarization
function fallbackSummarization(readmeContent) {
  console.log('Using fallback summarization')
  
  if (!readmeContent) {
    return {
      summary: 'No README content available to summarize.',
      cool_facts: ['No repository content was available for analysis.']
    }
  }

  // Clean and process the content
  let cleanContent = readmeContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, '')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleanContent.length < 20) {
    return {
      summary: 'README contains minimal readable content after removing formatting.',
      cool_facts: ['Repository has documentation but limited descriptive text was found.']
    }
  }

  // Extract meaningful sentences
  const sentences = cleanContent
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 200)
    .slice(0, 10)

  // Create summary from first few sentences
  const summary = sentences.slice(0, 3).join('. ') + '.'

  // Generate facts based on content analysis
  const facts = generateFactsFromContent(cleanContent)

  return {
    summary: summary || 'This repository contains code and documentation.',
    cool_facts: facts
  }
}

// Helper function to generate facts from content
function generateFactsFromContent(content) {
  const facts = []
  const lowerContent = content.toLowerCase()

  // Technology detection
  const technologies = []
  if (lowerContent.includes('react')) technologies.push('React')
  if (lowerContent.includes('node') || lowerContent.includes('nodejs')) technologies.push('Node.js')
  if (lowerContent.includes('typescript')) technologies.push('TypeScript')
  if (lowerContent.includes('javascript')) technologies.push('JavaScript')
  if (lowerContent.includes('python')) technologies.push('Python')
  if (lowerContent.includes('docker')) technologies.push('Docker')
  if (lowerContent.includes('kubernetes')) technologies.push('Kubernetes')
  if (lowerContent.includes('mongodb')) technologies.push('MongoDB')
  if (lowerContent.includes('postgresql') || lowerContent.includes('postgres')) technologies.push('PostgreSQL')
  if (lowerContent.includes('redis')) technologies.push('Redis')

  if (technologies.length > 0) {
    facts.push(`Built with ${technologies.join(', ')} technology stack`)
  }

  // Feature detection
  if (lowerContent.includes('api') || lowerContent.includes('rest')) {
    facts.push('Provides API functionality for external integrations')
  }
  if (lowerContent.includes('authentication') || lowerContent.includes('auth')) {
    facts.push('Includes authentication and security features')
  }
  if (lowerContent.includes('test') || lowerContent.includes('testing')) {
    facts.push('Includes comprehensive testing suite')
  }
  if (lowerContent.includes('deploy') || lowerContent.includes('deployment')) {
    facts.push('Has deployment and production-ready configuration')
  }

  // Add generic facts if we don't have enough specific ones
  if (facts.length < 3) {
    facts.push('Repository includes comprehensive documentation')
    facts.push('Designed for scalability and maintainability')
    facts.push('Open source project with community contributions')
  }

  return facts.slice(0, 5)
}

// New function to generate unified natural language summary
async function createUnifiedSummaryChain() {
  const { ChatOpenAI } = await import('@langchain/openai')
  const { ChatPromptTemplate } = await import('@langchain/core/prompts')

  // Initialize the LLM with optimized settings for speed
  const llm = new ChatOpenAI({
    model: 'gpt-3.5-turbo', // Using the faster model
    temperature: 0.1, // Lower temperature for faster, more consistent responses
    maxTokens: 300, // Limit tokens for faster generation
    timeout: 10000 // 10 second timeout
  })

  // Create prompt template for unified summary
  const promptTemplate = ChatPromptTemplate.fromTemplate(`
    You are an expert software engineer creating a concise, natural language summary of a GitHub repository. 
    
    Based on the repository information provided, write a clear, focused summary (150-250 words) that includes:
    
    1. **Project Overview**: What the project does and its main purpose
    2. **Key Technologies**: Primary programming language and main frameworks
    3. **Repository Stats**: Stars, forks, and other relevant metrics
    4. **Notable Features**: 2-3 most interesting or unique aspects
    5. **Recent Activity**: Latest release or development status
    
    Repository Information:
    - Name: {name}
    - Description: {description}
    - Language: {language}
    - Stars: {stars}
    - Forks: {forks}
    - Watchers: {watchers}
    - Created: {createdAt}
    - Updated: {updatedAt}
    - License: {license}
    - Topics: {topics}
    - Latest Release: {latestRelease}
    - README Summary: {readmeSummary}
    - Cool Facts: {coolFacts}
    - Recent Activity: {recentActivity}
    
    Write a concise, engaging summary that captures the essence of this repository. 
    Format the response with proper paragraphs and line breaks for readability.
    Use double line breaks between sections for clear separation.
    Be direct and avoid unnecessary details. Focus on what makes this repository valuable and interesting.
    Keep it under 250 words and make every sentence count.
  `)

  return promptTemplate.pipe(llm)
}

// Function to generate unified summary
export async function generateUnifiedSummary(repositoryData) {
  console.log('Generating unified summary...')
  
  // Check if OpenAI API key is available
  const openaiApiKey = process.env.OPENAI_API_KEY
  if (!openaiApiKey || (!openaiApiKey.startsWith('sk-') && !openaiApiKey.startsWith('sk-proj-'))) {
    console.log('Invalid or missing OpenAI API key, using fallback')
    return generateFallbackUnifiedSummary(repositoryData)
  }

  try {
    console.log('Attempting to use OpenAI for unified summary...')
    const chain = await createUnifiedSummaryChain()
    
    // Prepare the data for the prompt
    const promptData = {
      name: repositoryData.name || 'Unknown',
      description: repositoryData.description || 'No description available',
      language: repositoryData.language || 'Not specified',
      stars: repositoryData.stars?.toLocaleString() || '0',
      forks: repositoryData.forks?.toLocaleString() || '0',
      watchers: repositoryData.watchers?.toLocaleString() || '0',
      createdAt: repositoryData.createdAt ? new Date(repositoryData.createdAt).toLocaleDateString() : 'Unknown',
      updatedAt: repositoryData.updatedAt ? new Date(repositoryData.updatedAt).toLocaleDateString() : 'Unknown',
      license: repositoryData.license || 'Not specified',
      topics: repositoryData.topics?.join(', ') || 'None',
      latestRelease: repositoryData.latestRelease ? 
        `${repositoryData.latestRelease.tag_name} (${new Date(repositoryData.latestRelease.published_at).toLocaleDateString()})` : 
        'No releases found',
      readmeSummary: repositoryData.readmeSummary || 'No README summary available',
      coolFacts: repositoryData.coolFacts?.join('; ') || 'No additional facts available',
      recentActivity: repositoryData.recentActivity ? 
        `${repositoryData.recentActivity.totalCommits} recent commits` : 
        'No recent activity data'
    }
    
    const result = await chain.invoke(promptData)
    console.log('Unified summary generated successfully')
    return result.content
  } catch (error) {
    console.error('OpenAI unified summary failed:', error.message)
    console.log('Falling back to text-based summary')
    return generateFallbackUnifiedSummary(repositoryData)
  }
}

// Fallback function for unified summary
function generateFallbackUnifiedSummary(repositoryData) {
  console.log('Using fallback unified summarization')
  
  const sections = []
  
  // Project overview
  let overview = `${repositoryData.name} is a ${repositoryData.language || 'software'} project`
  if (repositoryData.description) {
    overview += ` that ${repositoryData.description.toLowerCase()}`
  }
  overview += '.'
  sections.push(overview)
  
  // Statistics
  const stats = `This repository has ${repositoryData.stars?.toLocaleString() || '0'} stars, ${repositoryData.forks?.toLocaleString() || '0'} forks, and ${repositoryData.watchers?.toLocaleString() || '0'} watchers.`
  sections.push(stats)
  
  // Technology and license info
  const techInfo = []
  if (repositoryData.language) {
    techInfo.push(`It is primarily written in ${repositoryData.language}.`)
  }
  if (repositoryData.license && repositoryData.license !== 'No license specified') {
    techInfo.push(`The project is licensed under ${repositoryData.license}.`)
  }
  if (techInfo.length > 0) {
    sections.push(techInfo.join(' '))
  }
  
  // Topics
  if (repositoryData.topics && repositoryData.topics.length > 0) {
    sections.push(`Key topics include: ${repositoryData.topics.join(', ')}.`)
  }
  
  // Latest release
  if (repositoryData.latestRelease) {
    sections.push(`The latest release is ${repositoryData.latestRelease.tag_name}.`)
  }
  
  // README summary
  if (repositoryData.readmeSummary && repositoryData.readmeSummary !== 'No README summary available') {
    sections.push(`According to the README: ${repositoryData.readmeSummary}`)
  }
  
  // Cool facts
  if (repositoryData.coolFacts && repositoryData.coolFacts.length > 0) {
    sections.push(`Notable aspects include: ${repositoryData.coolFacts.join('; ')}.`)
  }
  
  // Recent activity
  if (repositoryData.recentActivity) {
    sections.push(`Recent activity shows ${repositoryData.recentActivity.totalCommits} commits.`)
  }
  
  // Join sections with double line breaks for proper formatting
  return sections.join('\n\n')
}

// Main function to summarize repository
export async function summarizeRepository(readmeContent) {
  console.log('Starting repository summarization...')
  
  // Check if OpenAI API key is available and valid
  const openaiApiKey = process.env.OPENAI_API_KEY
  console.log('OpenAI API key available:', !!openaiApiKey)
  console.log('OpenAI API key format check:', openaiApiKey?.startsWith('sk-') || openaiApiKey?.startsWith('sk-proj-'))

  if (!openaiApiKey || (!openaiApiKey.startsWith('sk-') && !openaiApiKey.startsWith('sk-proj-'))) {
    console.log('Invalid or missing OpenAI API key, using fallback')
    return fallbackSummarization(readmeContent)
  }

  try {
    console.log('Attempting to use OpenAI for summarization...')
    const chain = await createSummarizationChain()
    const result = await chain.invoke({
      readmeContent: readmeContent || 'No README content available'
    })
    
    console.log('OpenAI summarization successful')
    console.log('Structured output result:', result)
    return result
  } catch (error) {
    console.error('OpenAI summarization failed:', error.message)
    
    // Check if it's a billing/quota issue
    if (error.message.includes('billing') || error.message.includes('quota') || error.message.includes('429')) {
      console.log('OpenAI account billing issue detected, using enhanced fallback')
    }
    
    console.log('Falling back to text-based summarization')
    return fallbackSummarization(readmeContent)
  }
}
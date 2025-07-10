import { z } from 'zod'

// Helper function to create summarization chain
async function createSummarizationChain() {
  const { ChatOpenAI } = await import('@langchain/openai')
  const { PromptTemplate } = await import('@langchain/core/prompts')
  const { StructuredOutputParser } = await import('langchain/output_parsers')
  const { RunnableSequence } = await import('@langchain/core/runnables')

  // Initialize the LLM
  const llm = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.1
  })

  // Create output parser
  const parser = StructuredOutputParser.fromNamesAndTypes({
    summary: 'string',
    cool_facts: 'string[]'
  })

  // Create prompt template with more explicit instructions
  const promptTemplate = PromptTemplate.fromTemplate(`
    You are an expert software engineer analyzing a GitHub repository. Based on the README content below, provide a detailed technical summary and interesting facts.

    README Content:
    {readmeContent}

    Instructions:
    1. SUMMARY: Write a clear, technical summary (100-300 words) that explains:
       - What the project does and its main purpose
       - Key technologies and frameworks used
       - Target audience or use cases
       - Main features or capabilities
       
    2. COOL FACTS: List 3-5 specific, interesting facts about this project such as:
       - Unique technical features or innovations
       - Performance metrics or capabilities
       - Notable integrations or dependencies
       - Interesting architecture decisions
       - Community stats or adoption
       - Specific use cases or industries it serves
       
    Make the summary informative and the facts genuinely interesting - avoid generic statements.
    
    \${parser.getFormatInstructions()}
  `)

  // Create the chain
  return RunnableSequence.from([
    promptTemplate,
    llm,
    parser
  ])
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
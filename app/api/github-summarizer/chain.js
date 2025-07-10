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
    temperature: 0.7
  })

  // Create output parser
  const parser = StructuredOutputParser.fromNamesAndTypes({
    summary: 'string',
    cool_facts: 'string[]'
  })

  // Create prompt template
  const promptTemplate = PromptTemplate.fromTemplate(`
    Summarize this GitHub repository based on its README content:
    {readmeContent}
    
    Provide a concise summary and list interesting facts about the project.
    
    ${parser.getFormatInstructions()}
  `)

  // Create the chain
  return RunnableSequence.from([
    promptTemplate,
    llm,
    parser
  ])
}

// Fallback function for simple text summarization
function fallbackSummarization(readmeContent) {
  if (!readmeContent) {
    return {
      summary: 'No README content available to summarize.',
      cool_facts: ['No repository content was available for analysis.']
    }
  }

  // Clean the README content
  let cleanContent = readmeContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleanContent.length === 0) {
    return {
      summary: 'README contains only formatting elements.',
      cool_facts: ['Repository has a README but no readable content was found.']
    }
  }

  // Extract first few sentences for summary
  const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 20)
  const summary = sentences.slice(0, 3).join('. ').substring(0, 400)

  // Generate simple facts
  const facts = []
  if (cleanContent.toLowerCase().includes('install')) {
    facts.push('Project includes installation instructions')
  }
  if (cleanContent.toLowerCase().includes('api')) {
    facts.push('This appears to be an API or includes API functionality')
  }
  if (cleanContent.toLowerCase().includes('framework') || cleanContent.toLowerCase().includes('library')) {
    facts.push('This is a framework or library project')
  }
  if (cleanContent.toLowerCase().includes('open source')) {
    facts.push('This is an open source project')
  }
  if (cleanContent.toLowerCase().includes('react') || cleanContent.toLowerCase().includes('vue') || cleanContent.toLowerCase().includes('angular')) {
    facts.push('This appears to be a frontend framework project')
  }
  if (cleanContent.toLowerCase().includes('node') || cleanContent.toLowerCase().includes('express')) {
    facts.push('This appears to be a Node.js project')
  }
  if (facts.length === 0) {
    facts.push('Repository contains documentation and code')
  }

  return {
    summary: summary || 'Repository contains code and documentation.',
    cool_facts: facts.slice(0, 3) // Limit to 3 facts
  }
}

// Define strict schema for repository summary
const summarySchema = z.object({
  summary: z.string()
    .min(10, 'Summary must be at least 10 characters')
    .max(1000, 'Summary must not exceed 1000 characters'),
  cool_facts: z.array(z.string())
    .min(1, 'Must include at least one cool fact')
    .max(5, 'Cannot exceed 5 cool facts')
    .refine(facts => facts.every(fact => fact.length >= 10 && fact.length <= 200), {
      message: 'Each fact must be between 10 and 200 characters'
    })
})

// Helper function to check if OpenAI API key is valid
function isValidOpenAiApiKey(apiKey) {
  return apiKey && 
         typeof apiKey === 'string' && 
         (apiKey.startsWith('sk-') || apiKey.startsWith('sk-proj-')) &&
         apiKey !== 'sk-proj-your-actual-api-key-here' &&
         apiKey.length > 20
}

// Main function to summarize repository
export async function summarizeRepository(readmeContent) {
  // Check if OpenAI API key is available and valid
  const openaiApiKey = process.env.OPENAI_API_KEY
  const hasValidApiKey = isValidOpenAiApiKey(openaiApiKey)

  if (!hasValidApiKey) {
    console.log('OpenAI API key not available or invalid format (should start with sk-), using fallback summarization')
    return fallbackSummarization(readmeContent)
  }

  try {
    const chain = await createSummarizationChain()
    const result = await chain.invoke({
      readmeContent: readmeContent.substring(0, 4000) // Limit content to avoid token limits
    })

    // Validate result against schema
    const validatedResult = summarySchema.parse(result)
    return validatedResult
  } catch (error) {
    console.error('Error in summarization chain:', error)
    
    // Check if it's an authentication error
    if (error.message && error.message.includes('401')) {
      console.log('OpenAI authentication failed - API key may be invalid')
    }
    
    // Fallback to simple summarization on error
    console.log('Falling back to simple summarization due to error')
    return fallbackSummarization(readmeContent)
  }
} 
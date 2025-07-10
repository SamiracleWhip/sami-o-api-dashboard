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

// Helper function to validate summary output
function validateSummaryOutput(output) {
  try {
    return {
      isValid: true,
      data: summarySchema.parse(output)
    }
  } catch (error) {
    return {
      isValid: false,
      error: error.errors?.[0]?.message || 'Invalid summary format'
    }
  }
}

// Helper function to summarize repository
export async function summarizeRepository(readmeContent) {
  try {
    if (!readmeContent) {
      return {
        summary: 'No README content available to summarize.',
        cool_facts: ['No repository content was available for analysis.']
      }
    }

    const chain = await createSummarizationChain()
    const result = await chain.invoke({
      readmeContent
    })

    const validated = validateSummaryOutput(result)
    if (!validated.isValid) {
      throw new Error(validated.error)
    }

    return validated.data
  } catch (error) {
    console.error('Error summarizing repository:', error)
    return {
      summary: 'Failed to generate summary.',
      cool_facts: ['An error occurred while analyzing the repository.']
    }
  }
} 
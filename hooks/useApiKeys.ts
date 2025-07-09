import { useState, useEffect, useCallback } from 'react'

interface ApiKey {
  id: string;
  name: string;
  description: string;
  permissions: string;
  status: string;
  key_type: string;
  usage_limit: number;
  api_key: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
  last_used: string | null;
}

interface CreateApiKeyData {
  name: string;
  description?: string;
  permissions?: string;
  status?: string;
  keyType: string;
  usageLimit: string;
}

interface UpdateApiKeyData {
  name?: string;
  description?: string;
  permissions?: string;
  status?: string;
  keyType?: string;
  usageLimit?: string;
}

interface SearchParams {
  search?: string;
  status?: string;
  permission?: string;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all API keys
  const fetchApiKeys = useCallback(async (searchParams: SearchParams = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/api-keys?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch API keys')
      }

      const data = await response.json()
      setApiKeys(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error fetching API keys:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create new API key
  const createApiKey = useCallback(async (keyData: CreateApiKeyData) => {
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(keyData),
      })

      if (!response.ok) {
        throw new Error('Failed to create API key')
      }

      const newKey = await response.json()
      setApiKeys(prev => [newKey, ...prev])
      return newKey
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error creating API key:', err)
      throw err
    }
  }, [])

  // Update API key
  const updateApiKey = useCallback(async (id: string, updates: UpdateApiKeyData) => {
    try {
      const response = await fetch('/api/api-keys', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      })

      if (!response.ok) {
        throw new Error('Failed to update API key')
      }

      const updatedKey = await response.json()
      setApiKeys(prev => prev.map(key => key.id === id ? updatedKey : key))
      return updatedKey
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error updating API key:', err)
      throw err
    }
  }, [])

  // Delete API key
  const deleteApiKey = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/api-keys?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete API key')
      }

      setApiKeys(prev => prev.filter(key => key.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error deleting API key:', err)
      throw err
    }
  }, [])

  // Bulk delete API keys
  const bulkDeleteApiKeys = useCallback(async (ids: string[]) => {
    try {
      const response = await fetch(`/api/api-keys?ids=${ids.join(',')}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete API keys')
      }

      setApiKeys(prev => prev.filter(key => !ids.includes(key.id)))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error deleting API keys:', err)
      throw err
    }
  }, [])

  // Regenerate API key
  const regenerateApiKey = useCallback(async (id: string) => {
    try {
      const response = await fetch('/api/api-keys/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error('Failed to regenerate API key')
      }

      const updatedKey = await response.json()
      setApiKeys(prev => prev.map(key => key.id === id ? updatedKey : key))
      return updatedKey
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error regenerating API key:', err)
      throw err
    }
  }, [])

  // Bulk update status
  const bulkUpdateStatus = useCallback(async (ids: string[], status: string) => {
    try {
      const promises = ids.map(id => updateApiKey(id, { status }))
      await Promise.all(promises)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error updating API key statuses:', err)
      throw err
    }
  }, [updateApiKey])

  // Load API keys on mount
  useEffect(() => {
    fetchApiKeys()
  }, [fetchApiKeys])

  return {
    apiKeys,
    loading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    bulkDeleteApiKeys,
    regenerateApiKey,
    bulkUpdateStatus,
  }
} 
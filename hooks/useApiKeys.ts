import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface ApiKey {
  id: string;
  user_id: string;
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
}

interface UpdateApiKeyData {
  name?: string;
  description?: string;
  permissions?: string;
  status?: string;
  keyType?: string;
}

interface SearchParams {
  search?: string;
  status?: string;
  permission?: string;
}

export function useApiKeys() {
  const { data: session } = useSession()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to get headers
  const getHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
    }
  }, [])

  // Fetch all API keys for the current user
  const fetchApiKeys = useCallback(async (searchParams: SearchParams = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/users/me/api-keys?${params}`, {
        headers: getHeaders(),
        credentials: 'include'
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to access your API keys')
        }
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
  }, [getHeaders])

  // Create new API key for the current user
  const createApiKey = useCallback(async (keyData: CreateApiKeyData) => {
    try {
      const response = await fetch('/api/users/me/api-keys', {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(keyData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to create API keys')
        }
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
  }, [getHeaders])

  // Update API key (user can only update their own keys)
  const updateApiKey = useCallback(async (id: string, updates: UpdateApiKeyData) => {
    try {
      const response = await fetch(`/api/users/me/api-keys/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to update API keys')
        }
        if (response.status === 403) {
          throw new Error('You can only update your own API keys')
        }
        if (response.status === 404) {
          throw new Error('API key not found')
        }
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
  }, [getHeaders])

  // Delete API key (user can only delete their own keys)
  const deleteApiKey = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/users/me/api-keys/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to delete API keys')
        }
        if (response.status === 403) {
          throw new Error('You can only delete your own API keys')
        }
        if (response.status === 404) {
          throw new Error('API key not found')
        }
        throw new Error('Failed to delete API key')
      }

      setApiKeys(prev => prev.filter(key => key.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error deleting API key:', err)
      throw err
    }
  }, [getHeaders])

  // Bulk delete API keys (user can only delete their own keys)
  const bulkDeleteApiKeys = useCallback(async (ids: string[]) => {
    try {
      const promises = ids.map(id => deleteApiKey(id))
      await Promise.all(promises)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error deleting API keys:', err)
      throw err
    }
  }, [deleteApiKey])

  // Regenerate API key (user can only regenerate their own keys)
  const regenerateApiKey = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/users/me/api-keys/${id}/regenerate`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to regenerate API keys')
        }
        if (response.status === 403) {
          throw new Error('You can only regenerate your own API keys')
        }
        if (response.status === 404) {
          throw new Error('API key not found')
        }
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
  }, [getHeaders])

  // Bulk update status (user can only update their own keys)
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
    if (session) {
      fetchApiKeys()
    }
  }, [fetchApiKeys, session])

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
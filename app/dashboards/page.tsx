'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Clipboard, Check, Search, RefreshCw, AlertCircle, CheckCircle, XCircle, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useApiKeys } from '@/hooks/useApiKeys';
import Sidebar from '@/components/Sidebar';

// Types
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

interface FormData {
  name: string;
  description: string;
  permissions: string;
  status: string;
  keyType: string;
  usageLimit: string;
}

// Header Component
const DashboardHeader = ({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) => (
  <div className="lg:hidden bg-gray-800 border-b border-gray-700 px-4 py-3">
    <div className="flex items-center justify-between">
      <button
        onClick={() => setSidebarOpen(true)}
        className="p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-700 touch-manipulation"
      >
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">SM</span>
        </div>
        <span className="text-lg font-semibold text-white">Sami-O</span>
      </div>
      <div className="w-10" />
    </div>
  </div>
);

// Page Header Component
const PageHeader = ({ apiKeys }: { apiKeys: ApiKey[] }) => (
  <div className="mb-6 md:mb-8">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
      <div>
        <nav className="text-xs md:text-sm text-gray-400 mb-2">
          <Link href="/" className="hover:text-gray-300">Pages</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">Overview</span>
        </nav>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Overview</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Operational</span>
        </div>
      </div>
    </div>

    {/* Gradient Card */}
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 text-white relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-700/20 backdrop-blur-sm"></div>
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-4">
          <div>
            <p className="text-xs md:text-sm font-medium opacity-90 mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              CURRENT PLAN
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
              Researcher
            </h2>
          </div>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all border border-white/30 shadow-lg text-sm md:text-base touch-manipulation">
            📋 <span className="hidden sm:inline">Manage Plan</span><span className="sm:hidden">Plan</span>
          </button>
        </div>
        
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-base md:text-lg font-semibold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              API Usage
            </h3>
            <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
              <span className="text-xs font-bold">?</span>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-xs md:text-sm mb-1">
              <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Plan</span>
              <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                {apiKeys.filter(k => k.status === 'active').length * 100} / 1,000 Credits
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 md:h-3 border border-white/30 shadow-inner">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 md:h-3 rounded-full transition-all duration-300 shadow-md" 
                style={{ width: `${Math.min((apiKeys.filter(k => k.status === 'active').length * 100) / 1000 * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 md:w-6 md:h-6 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-full shadow-sm"></div>
          </div>
          <span className="text-xs md:text-sm opacity-90" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            {apiKeys.filter(k => k.status === 'active').length} active API key{apiKeys.filter(k => k.status === 'active').length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// API Keys Table Component
const ApiKeysTable = ({ 
  filteredKeys, 
  selectedKeys, 
  visibleKeys, 
  copiedKey,
  onToggleSelection,
  onToggleVisibility,
  onCopyKey,
  onEdit,
  onRegenerate,
  onDelete
}: {
  filteredKeys: ApiKey[];
  selectedKeys: Set<string>;
  visibleKeys: Set<string>;
  copiedKey: string | null;
  onToggleSelection: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onCopyKey: (key: string, id: string) => void;
  onEdit: (key: ApiKey) => void;
  onRegenerate: (id: string) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">NAME</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">TYPE</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">USAGE</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">KEY</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">OPTIONS</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700">
        {filteredKeys.map((key) => (
          <tr key={key.id} className="hover:bg-gray-700/50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedKeys.has(key.id)}
                  onChange={() => onToggleSelection(key.id)}
                  className="mr-3 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-sm font-medium text-white">{key.name}</div>
                  {key.description && (
                    <div className="text-xs text-gray-400">{key.description}</div>
                  )}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                {key.key_type || key.permissions}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
              {key.usage_count || 0}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono bg-gray-700 px-2 py-1 rounded text-gray-300">
                  {visibleKeys.has(key.id) ? key.api_key : key.api_key.substring(0, 8) + '-***************************'}
                </code>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleVisibility(key.id)}
                  className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                  title={visibleKeys.has(key.id) ? "Hide" : "Show"}
                >
                  {visibleKeys.has(key.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => onCopyKey(key.api_key, key.id)}
                  className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                  title="Copy"
                >
                  {copiedKey === key.id ? <Check size={16} className="text-green-400" /> : <Clipboard size={16} />}
                </button>
                <button
                  onClick={() => onEdit(key)}
                  className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onRegenerate(key.id)}
                  className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  onClick={() => onDelete(key.id)}
                  className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Form Fields Component
const FormFields = ({ formData, onFormDataChange, onSubmit, onCancel }: {
  formData: FormData;
  onFormDataChange: (updater: (prev: FormData) => FormData) => void;
  onSubmit: (e: React.FormEvent, updatedFormData?: FormData) => void;
  onCancel: () => void;
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const usageInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (nameInputRef.current && nameInputRef.current.value !== formData.name) {
      nameInputRef.current.value = formData.name;
    }
    if (usageInputRef.current && usageInputRef.current.value !== formData.usageLimit) {
      usageInputRef.current.value = formData.usageLimit;
    }
  }, [formData.name, formData.usageLimit]);

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    onFormDataChange(prev => ({ ...prev, [field]: value }));
  }, [onFormDataChange]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const currentName = nameInputRef.current?.value || formData.name;
    const currentUsageLimit = usageInputRef.current?.value || formData.usageLimit;
    const updatedFormData = { ...formData, name: currentName, usageLimit: currentUsageLimit };
    onSubmit(e, updatedFormData);
  }, [onSubmit, formData]);

  return (
    <div className="p-4 md:p-6">
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Create a new API key</h2>
        <p className="text-sm md:text-base text-gray-600">Enter a name and limit for the new API key.</p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
            Key Name — <span className="text-gray-500 font-normal">A unique name to identify this key</span>
          </label>
          <input
            ref={nameInputRef}
            type="text"
            defaultValue={formData.name}
            placeholder="Enter any name you want"
            className="w-full p-3 md:p-4 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
            required
          />
        </div>

        <div>
          <label className="block text-sm md:text-base font-medium text-gray-700 mb-3">
            Key Type — <span className="text-gray-500 font-normal">Choose the environment for this key</span>
          </label>
          <div className="space-y-3">
            {['development', 'production'].map((type) => (
              <div 
                key={type}
                className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-all touch-manipulation ${
                  formData.keyType === type 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleInputChange('keyType', type)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    formData.keyType === type 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {formData.keyType === type && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm md:text-base font-medium text-gray-900 capitalize">{type}</span>
                      <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 flex-shrink-0">
                        <span>{type === 'development' ? '🔧' : '🚀'}</span>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">
                      {type === 'development' 
                        ? 'Rate limited to 100 requests/minute' 
                        : 'No rate limit (250 req/min default)'
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
            Limit monthly usage*
          </label>
          <input
            ref={usageInputRef}
            type="number"
            defaultValue={formData.usageLimit}
            placeholder="1000"
            className="w-full p-3 md:p-4 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            required
          />
          <p className="text-xs md:text-sm text-gray-500 mt-2">
            * You can set a monthly limit to prevent unexpected charges
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 md:py-4 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium touch-manipulation text-sm md:text-base"
          >
            Create
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-3 md:py-4 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium touch-manipulation text-sm md:text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, children }: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">API Key</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 touch-manipulation"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Notification Component
const Notification = ({ notification }: {
  notification: { message: string; type: 'success' | 'error' | 'delete' } | null;
}) => {
  if (!notification) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
        notification.type === 'success'
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      }`}>
        {notification.type === 'success' || notification.type === 'delete' ? (
          <CheckCircle size={20} />
        ) : (
          <XCircle size={20} />
        )}
        <span className="font-medium">{notification.message}</span>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const { apiKeys, loading, error, createApiKey, updateApiKey, deleteApiKey, regenerateApiKey, bulkDeleteApiKeys, bulkUpdateStatus, fetchApiKeys } = useApiKeys();
  
  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'delete' } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    permissions: 'read',
    status: 'active',
    keyType: 'development',
    usageLimit: '1000'
  });

  // Computed values
  const filteredKeys = apiKeys.filter(key =>
    key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const showNotification = (message: string, type: 'success' | 'error' | 'delete' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFormDataChange = useCallback((updater: (prev: FormData) => FormData) => {
    setFormData(updater);
  }, []);

  const handleCreate = async (e: React.FormEvent, updatedFormData?: FormData) => {
    e.preventDefault();
    const dataToUse = updatedFormData || formData;
    
    try {
      await createApiKey({
        name: dataToUse.name,
        description: dataToUse.description,
        permissions: dataToUse.permissions,
        status: dataToUse.status,
        keyType: dataToUse.keyType,
        usageLimit: dataToUse.usageLimit
      });
      
      showNotification('API key created successfully!');
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '', permissions: 'read', status: 'active', keyType: 'development', usageLimit: '1000' });
    } catch (error) {
      showNotification('Failed to create API key', 'error');
    }
  };

  const handleEdit = (key: ApiKey) => {
    setEditingKey(key);
    setFormData({
      name: key.name,
      description: key.description || '',
      permissions: key.permissions,
      status: key.status,
      keyType: key.key_type || 'development',
      usageLimit: key.usage_limit?.toString() || '1000'
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent, updatedFormData?: FormData) => {
    e.preventDefault();
    if (!editingKey) return;
    
    const dataToUse = updatedFormData || formData;
    
    try {
      await updateApiKey(editingKey.id, {
        name: dataToUse.name,
        description: dataToUse.description,
        permissions: dataToUse.permissions,
        status: dataToUse.status,
        keyType: dataToUse.keyType,
        usageLimit: dataToUse.usageLimit
      });
      
      showNotification('API key updated successfully!');
      setIsEditModalOpen(false);
      setEditingKey(null);
      setFormData({ name: '', description: '', permissions: 'read', status: 'active', keyType: 'development', usageLimit: '1000' });
    } catch (error) {
      showNotification('Failed to update API key', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    
    try {
      await deleteApiKey(id);
      showNotification('API key deleted successfully!', 'delete');
    } catch (error) {
      showNotification('Failed to delete API key', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedKeys.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedKeys.size} API key(s)?`)) return;
    
    try {
      await bulkDeleteApiKeys(Array.from(selectedKeys));
      showNotification(`${selectedKeys.size} API key(s) deleted successfully!`, 'delete');
      setSelectedKeys(new Set());
    } catch (error) {
      showNotification('Failed to delete API keys', 'error');
    }
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedKeys.size === 0) return;
    
    try {
      await bulkUpdateStatus(Array.from(selectedKeys), newStatus);
      showNotification(`${selectedKeys.size} API key(s) ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      setSelectedKeys(new Set());
    } catch (error) {
      showNotification('Failed to update API keys', 'error');
    }
  };

  const toggleKeySelection = (keyId: string) => {
    const newSelected = new Set(selectedKeys);
    if (newSelected.has(keyId)) {
      newSelected.delete(keyId);
    } else {
      newSelected.add(keyId);
    }
    setSelectedKeys(newSelected);
  };

  const handleRegenerateKey = async (id: string) => {
    if (!confirm('Are you sure you want to regenerate this API key? The old key will no longer work.')) return;
    
    try {
      await regenerateApiKey(id);
      showNotification('API key regenerated successfully!');
    } catch (error) {
      showNotification('Failed to regenerate API key', 'error');
    }
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = async (key: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(keyId);
      showNotification('API key copied to clipboard!');
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      showNotification('Failed to copy API key', 'error');
    }
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="flex items-center gap-2 text-white">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading API keys...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Error Loading API Keys</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => fetchApiKeys()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-64 flex flex-col overflow-hidden">
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 overflow-y-auto bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
            <PageHeader apiKeys={apiKeys} />

            {/* API Keys Section */}
            <div className="bg-gray-800 rounded-xl md:rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
              {/* Search and Actions Header */}
              <div className="p-4 md:p-6 border-b border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">API Keys</h2>
                    <p className="text-gray-400 text-sm md:text-base">Manage your API keys and access tokens</p>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium touch-manipulation w-full sm:w-auto justify-center"
                  >
                    <Plus size={16} />
                    <span>Create API Key</span>
                  </button>
                </div>

                {/* Search and Bulk Actions */}
                <div className="mt-4 md:mt-6 flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search API keys..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 md:py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-sm md:text-base"
                    />
                  </div>

                  {selectedKeys.size > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleBulkDelete}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium touch-manipulation"
                      >
                        <Trash2 size={14} />
                        Delete ({selectedKeys.size})
                      </button>
                      <button
                        onClick={() => handleBulkStatusChange('active')}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium touch-manipulation"
                      >
                        <CheckCircle size={14} />
                        Activate
                      </button>
                      <button
                        onClick={() => handleBulkStatusChange('inactive')}
                        className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm font-medium touch-manipulation"
                      >
                        <XCircle size={14} />
                        Deactivate
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Table Content */}
              {filteredKeys.length === 0 && apiKeys.length === 0 ? (
                <div className="px-4 md:px-6 py-8 md:py-12 text-center text-gray-400">
                  <p className="mb-4 text-sm md:text-base">No API keys found. Create your first API key to get started.</p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors touch-manipulation"
                  >
                    Create API Key
                  </button>
                </div>
              ) : filteredKeys.length === 0 ? (
                <div className="px-4 md:px-6 py-6 md:py-8 text-center text-gray-400">
                  <p className="text-sm md:text-base">No API keys match your search.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {/* Mobile Card View - Hidden on larger screens */}
                  <div className="lg:hidden">
                    {filteredKeys.map((key) => (
                      <div key={key.id} className="border-b border-gray-700 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedKeys.has(key.id)}
                              onChange={() => toggleKeySelection(key.id)}
                              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <div>
                              <h3 className="font-medium text-white text-sm">{key.name}</h3>
                              <p className="text-xs text-gray-400 mt-1">{key.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(key)}
                              className="p-2 text-gray-400 hover:text-blue-400 transition-colors touch-manipulation"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(key.id)}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors touch-manipulation"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Status</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              key.status === 'active' 
                                ? 'bg-green-900 text-green-300' 
                                : 'bg-red-900 text-red-300'
                            }`}>
                              {key.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Type</span>
                            <span className="text-xs text-gray-300">{key.key_type}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Usage</span>
                            <span className="text-xs text-gray-300">{key.usage_count} / {key.usage_limit}</span>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={visibleKeys.has(key.id) ? key.api_key : '••••••••••••••••'}
                                readOnly
                                className="flex-1 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded text-xs font-mono"
                              />
                              <button
                                onClick={() => toggleKeyVisibility(key.id)}
                                className="p-2 text-gray-400 hover:text-gray-300 transition-colors touch-manipulation"
                              >
                                {visibleKeys.has(key.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                              <button
                                onClick={() => copyToClipboard(key.api_key, key.id)}
                                className="p-2 text-gray-400 hover:text-gray-300 transition-colors touch-manipulation"
                              >
                                {copiedKey === key.id ? <Check size={16} /> : <Clipboard size={16} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View - Hidden on smaller screens */}
                  <div className="hidden lg:block">
                    <table className="w-full">
                      <thead className="bg-gray-750">
                        <tr>
                          <th className="px-6 py-4 text-left">
                            <input
                              type="checkbox"
                              checked={selectedKeys.size === filteredKeys.length && filteredKeys.length > 0}
                              onChange={() => {
                                const allChecked = selectedKeys.size === filteredKeys.length && filteredKeys.length > 0;
                                if (allChecked) {
                                  setSelectedKeys(new Set());
                                } else {
                                  setSelectedKeys(new Set(filteredKeys.map(k => k.id)));
                                }
                              }}
                              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">API Key</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usage</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {filteredKeys.map((key) => (
                          <tr key={key.id} className="hover:bg-gray-750 transition-colors">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedKeys.has(key.id)}
                                onChange={() => toggleKeySelection(key.id)}
                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-white">{key.name}</div>
                                <div className="text-sm text-gray-400">{key.description}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 max-w-xs">
                                <input
                                  type="text"
                                  value={visibleKeys.has(key.id) ? key.api_key : '••••••••••••••••'}
                                  readOnly
                                  className="flex-1 px-3 py-1 bg-gray-700 text-white border border-gray-600 rounded text-sm font-mono min-w-0"
                                />
                                <button
                                  onClick={() => toggleKeyVisibility(key.id)}
                                  className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                                >
                                  {visibleKeys.has(key.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                                <button
                                  onClick={() => copyToClipboard(key.api_key, key.id)}
                                  className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                                >
                                  {copiedKey === key.id ? <Check size={14} /> : <Clipboard size={14} />}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                key.status === 'active' 
                                  ? 'bg-green-900 text-green-300' 
                                  : 'bg-red-900 text-red-300'
                              }`}>
                                {key.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">{key.key_type}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{key.usage_count} / {key.usage_limit}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEdit(key)}
                                  className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleRegenerateKey(key.id)}
                                  className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                                >
                                  <RefreshCw size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(key.id)}
                                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals with mobile optimization */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <div className="p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <FormFields 
            formData={formData} 
            onFormDataChange={handleFormDataChange} 
            onSubmit={handleCreate} 
            onCancel={() => setIsCreateModalOpen(false)} 
          />
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <FormFields 
            formData={formData} 
            onFormDataChange={handleFormDataChange} 
            onSubmit={handleUpdate} 
            onCancel={() => setIsEditModalOpen(false)} 
          />
        </div>
      </Modal>

      {/* Notification with mobile positioning */}
      {notification && (
        <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50">
          <div className={`p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-600' :
            notification.type === 'error' ? 'bg-red-600' : 'bg-orange-600'
          } text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {notification.type === 'success' && <CheckCircle size={20} />}
                {notification.type === 'error' && <AlertCircle size={20} />}
                {notification.type === 'delete' && <Trash2 size={20} />}
                <span className="text-sm md:text-base">{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-white hover:text-gray-200 transition-colors touch-manipulation"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
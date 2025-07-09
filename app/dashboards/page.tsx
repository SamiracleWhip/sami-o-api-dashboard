'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Clipboard, Check, Search, RefreshCw, AlertCircle, CheckCircle, XCircle, Menu } from 'lucide-react';
import Link from 'next/link';
import { useApiKeys } from '@/hooks/useApiKeys';
import Sidebar from '@/components/Sidebar';

// Types
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
        className="p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-700"
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
  <div className="mb-8">
    <div className="flex items-center justify-between mb-6">
      <div>
        <nav className="text-sm text-gray-400 mb-2">
          <Link href="/" className="hover:text-gray-300">Pages</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">Overview</span>
        </nav>
        <h1 className="text-4xl font-bold text-white">Overview</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Operational</span>
        </div>
      </div>
    </div>

    {/* Gradient Card */}
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-700/20 backdrop-blur-sm"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium opacity-90 mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              CURRENT PLAN
            </p>
            <h2 className="text-4xl font-bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
              Researcher
            </h2>
          </div>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium transition-all border border-white/30 shadow-lg">
            📋 Manage Plan
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-semibold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              API Usage
            </h3>
            <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
              <span className="text-xs font-bold">?</span>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Plan</span>
              <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                {apiKeys.filter(k => k.status === 'active').length * 100} / 1,000 Credits
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 border border-white/30 shadow-inner">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300 shadow-md" 
                style={{ width: `${Math.min((apiKeys.filter(k => k.status === 'active').length * 100) / 1000 * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
            <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
          </div>
          <span className="text-sm font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            Pay as you go
          </span>
          <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
            <span className="text-xs font-bold">?</span>
          </div>
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
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Create a new API key</h2>
        <p className="text-sm text-gray-600">Enter a name and limit for the new API key.</p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Name — <span className="text-gray-500 font-normal">A unique name to identify this key</span>
          </label>
          <input
            ref={nameInputRef}
            type="text"
            defaultValue={formData.name}
            placeholder="Enter any name you want"
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Key Type — <span className="text-gray-500 font-normal">Choose the environment for this key</span>
          </label>
          <div className="space-y-3">
            {['development', 'production'].map((type) => (
              <div 
                key={type}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.keyType === type 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleInputChange('keyType', type)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    formData.keyType === type 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {formData.keyType === type && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 capitalize">{type}</span>
                      <div className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                        <span>{type === 'development' ? '🔧' : '🚀'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Limit monthly usage*
          </label>
          <input
            ref={usageInputRef}
            type="number"
            defaultValue={formData.usageLimit}
            placeholder="1000"
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            * You can set a monthly limit to prevent unexpected charges
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">API Key</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>
        {children}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageHeader apiKeys={apiKeys} />

            {/* API Keys Section */}
            <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-white">API Keys</h2>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="w-6 h-6 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  {selectedKeys.size > 0 && (
                    <div className="flex gap-2 items-center">
                      <span className="text-sm text-gray-400">{selectedKeys.size} selected</span>
                      <button
                        onClick={() => handleBulkStatusChange('active')}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => handleBulkStatusChange('inactive')}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 text-sm text-gray-400">
                The key is used to authenticate your requests to the{' '}
                <span className="text-blue-400 underline cursor-pointer hover:text-blue-300">Research API</span>
                . To learn more, see the{' '}
                <span className="text-blue-400 underline cursor-pointer hover:text-blue-300">documentation</span>
                {' '}page.
              </div>

              {apiKeys.length > 0 && (
                <div className="px-6 pb-4">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search API keys..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {filteredKeys.length === 0 && apiKeys.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-400">
                  <p className="mb-4">No API keys found. Create your first API key to get started.</p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create API Key
                  </button>
                </div>
              ) : filteredKeys.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-400">
                  <p>No API keys match your search.</p>
                </div>
              ) : (
                <ApiKeysTable
                  filteredKeys={filteredKeys}
                  selectedKeys={selectedKeys}
                  visibleKeys={visibleKeys}
                  copiedKey={copiedKey}
                  onToggleSelection={toggleKeySelection}
                  onToggleVisibility={toggleKeyVisibility}
                  onCopyKey={copyToClipboard}
                  onEdit={handleEdit}
                  onRegenerate={handleRegenerateKey}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <FormFields 
          formData={formData} 
          onFormDataChange={handleFormDataChange} 
          onSubmit={handleCreate} 
          onCancel={() => setIsCreateModalOpen(false)} 
        />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <FormFields 
          formData={formData} 
          onFormDataChange={handleFormDataChange} 
          onSubmit={handleUpdate} 
          onCancel={() => setIsEditModalOpen(false)} 
        />
      </Modal>

      <Notification notification={notification} />
    </div>
  );
} 
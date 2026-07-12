'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CreateDriverSchema, CreateDriverInput } from '@/lib/validators/driver';

export function AddDriverForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<CreateDriverInput>>({
    name: '',
    licenseNumber: '',
    licenseCategory: 'LMV',
    licenseExpiryDate: '',
    contactNumber: '',
    safetyScore: 100,
    status: 'AVAILABLE'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? Number(value) : value 
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');
    
    // Validate with Zod
    const parsed = CreateDriverSchema.safeParse(formData);
    if (!parsed.success) {
      const newErrors: Record<string, string> = {};
      parsed.error.errors.forEach(err => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      
      if (data.success) {
        onSuccess();
      } else {
        setServerError(data.error || 'Failed to create driver');
      }
    } catch (err) {
      setServerError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && (
        <div className="rounded-md bg-red-500/15 p-3 text-sm text-red-400 border border-red-500/20">
          {serverError}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="Name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          error={errors.name} 
        />
        <Input 
          label="License Number" 
          name="licenseNumber" 
          value={formData.licenseNumber} 
          onChange={handleChange} 
          error={errors.licenseNumber} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select 
          label="Category" 
          name="licenseCategory" 
          value={formData.licenseCategory} 
          onChange={handleChange}
          error={errors.licenseCategory}
          options={[
            { label: 'LMV (Light Motor Vehicle)', value: 'LMV' },
            { label: 'HMV (Heavy Motor Vehicle)', value: 'HMV' }
          ]}
        />
        <Input 
          label="Expiry Date" 
          name="licenseExpiryDate" 
          type="date" 
          value={formData.licenseExpiryDate} 
          onChange={handleChange} 
          error={errors.licenseExpiryDate} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="Contact Number" 
          name="contactNumber" 
          value={formData.contactNumber} 
          onChange={handleChange} 
          error={errors.contactNumber} 
        />
        <Input 
          label="Safety Score (0-100)" 
          name="safetyScore" 
          type="number" 
          min="0" 
          max="100" 
          value={formData.safetyScore} 
          onChange={handleChange} 
          error={errors.safetyScore} 
        />
      </div>

      <Select 
        label="Status" 
        name="status" 
        value={formData.status} 
        onChange={handleChange}
        error={errors.status}
        options={[
          { label: 'Available', value: 'AVAILABLE' },
          { label: 'Off Duty', value: 'OFF_DUTY' },
        ]}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Driver'}
        </Button>
      </div>
    </form>
  );
}

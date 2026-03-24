'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const expenseSchema = z.object({
  expenseDate: z.string().min(1, 'Datum is verplicht'),
  category: z.enum(['brandstof', 'onderhoud', 'verzekering', 'wegenvignet', 'parkeerkosten', 'telefoon', 'administratie', 'overig']),
  description: z.string().min(2, 'Omschrijving is verplicht'),
  amount: z.number().min(0.01, 'Bedrag moet groter zijn dan 0'),
  vatRate: z.enum(['0', '9', '21']).default('21'),
});

type ExpenseForm = z.infer<typeof expenseSchema>;

const CATEGORIES = [
  { value: 'brandstof', label: 'Brandstof' },
  { value: 'onderhoud', label: 'Onderhoud' },
  { value: 'verzekering', label: 'Verzekering' },
  { value: 'wegenvignet', label: 'Wegenvignet' },
  { value: 'parkeerkosten', label: 'Parkeerkosten' },
  { value: 'telefoon', label: 'Telefoon' },
  { value: 'administratie', label: 'Administratie' },
  { value: 'overig', label: 'Overig' },
];

export default function NewExpensePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExpenseForm>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expenseDate: new Date().toISOString().split('T')[0],
      vatRate: '21',
    },
  });

  const amount = watch('amount') || 0;
  const vatRate = watch('vatRate') || '21';
  const vatAmount = amount * (Number(vatRate) / 100);

  const mutation = useMutation({
    mutationFn: async (data: ExpenseForm) => {
      await api.post('/expenses', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Kost toegevoegd!');
      router.push('/dashboard/kosten');
    },
    onError: () => {
      toast.error('Kon kost niet toevoegen');
    },
  });

  const onSubmit = (data: ExpenseForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nieuwe kost</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Datum</label>
          <input
            type="date"
            {...register('expenseDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          {errors.expenseDate && (
            <p className="mt-1 text-sm text-red-600">{errors.expenseDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Categorie</label>
          <select
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Omschrijving</label>
          <input
            type="text"
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Bijv. Tanken Shell"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bedrag (€)</label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">BTW tarief</label>
            <select
              {...register('vatRate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="0">0%</option>
              <option value="9">9%</option>
              <option value="21">21%</option>
            </select>
          </div>
        </div>

        {amount > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Inclusief € {vatAmount.toFixed(2)} BTW
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Bezig...' : 'Kost opslaan'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/kosten')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuleren
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const rideSchema = z.object({
  rideDate: z.string().min(1, 'Datum is verplicht'),
  rideTime: z.string().optional(),
  grossAmount: z.number().min(0.01, 'Bedrag moet groter zijn dan 0'),
  platformCommission: z.number().min(0).default(0),
  platform: z.enum(['uber', 'bolt', 'manual']).default('manual'),
  paymentMethod: z.enum(['cash', 'card', 'tikkie']).default('cash'),
  description: z.string().optional(),
});

type RideForm = z.infer<typeof rideSchema>;

export default function NewRidePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RideForm>({
    resolver: zodResolver(rideSchema),
    defaultValues: {
      rideDate: new Date().toISOString().split('T')[0],
      platform: 'manual',
      paymentMethod: 'cash',
    },
  });

  const grossAmount = watch('grossAmount') || 0;
  const commission = watch('platformCommission') || 0;
  const netAmount = grossAmount - commission;

  const mutation = useMutation({
    mutationFn: async (data: RideForm) => {
      await api.post('/rides', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rides'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Rit toegevoegd!');
      router.push('/dashboard/ritten');
    },
    onError: () => {
      toast.error('Kon rit niet toevoegen');
    },
  });

  const onSubmit = (data: RideForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nieuwe rit</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
        {/* Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Datum</label>
            <input
              type="date"
              {...register('rideDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {errors.rideDate && (
              <p className="mt-1 text-sm text-red-600">{errors.rideDate.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tijd</label>
            <input
              type="time"
              {...register('rideTime')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Platform</label>
          <select
            {...register('platform')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="manual">Handmatig / Straat</option>
            <option value="uber">Uber</option>
            <option value="bolt">Bolt</option>
          </select>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bruto bedrag (€)</label>
            <input
              type="number"
              step="0.01"
              {...register('grossAmount', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {errors.grossAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.grossAmount.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Commissie (€)</label>
            <input
              type="number"
              step="0.01"
              {...register('platformCommission', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Net preview */}
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-800">
            Jij ontvangt: <span className="font-bold text-lg">€ {netAmount.toFixed(2)}</span>
          </p>
        </div>

        {/* Payment method */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Betaalmethode</label>
          <select
            {...register('paymentMethod')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="cash">Contant</option>
            <option value="card">Pin</option>
            <option value="tikkie">Tikkie</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Omschrijving (optioneel)</label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Bijv. Rit naar Schiphol"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Bezig...' : 'Rit opslaan'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard/ritten')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuleren
          </button>
        </div>
      </form>
    </div>
  );
}

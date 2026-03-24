import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/auth.store';

const loginSchema = z.object({
  email: z.string().email('Voer een geldig e-mailadres in'),
  password: z.string().min(6, 'Wachtwoord moet minimaal 6 tekens bevatten'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginScreen({ navigation }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', data);
      await setAuth(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Inloggen mislukt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>TaxiBoek</Text>
        <Text style={styles.subtitle}>Log in op je account</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="E-mailadres"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Wachtwoord"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Inloggen</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Nog geen account? Registreer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 12,
  },
  link: {
    color: '#2563eb',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});

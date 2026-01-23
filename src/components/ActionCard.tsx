import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';
import { ConsoleOutput } from './ConsoleOutput';
import { ChainSelector } from './ChainSelector';
import wdkConfigs from '@/config/chain';

export interface ActionField {
  id: string;
  label?: string;
  type: 'text' | 'number' | 'chain' | 'json';
  placeholder?: string;
  defaultValue?: any;
}

interface Props {
  title: string;
  description?: string;
  fields: ActionField[];
  action: (values: Record<string, any>) => Promise<any>;
  actionLabel?: string;
}

export const ActionCard: React.FC<Props> = ({ 
  title, 
  description, 
  fields, 
  action, 
  actionLabel = 'Run' 
}) => {
  // Initialize state with default values
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach(f => {
      if (f.defaultValue !== undefined) initial[f.id] = f.defaultValue;
      else if (f.type === 'chain') initial[f.id] = Object.keys(wdkConfigs)[0];
      else initial[f.id] = '';
    });
    return initial;
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const handleRun = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      // Process values (e.g. parse JSON)
      const processedValues = { ...formValues };
      fields.forEach(f => {
        if (f.type === 'json' && typeof formValues[f.id] === 'string') {
          try {
            processedValues[f.id] = JSON.parse(formValues[f.id]);
          } catch (e) {
            // Keep as string if parse fails, logic might handle it
          }
        }
      });

      const res = await action(processedValues);
      setResult(res);
    } catch (e: any) {
      setError(e.message || e);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (id: string, value: any) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      <View style={styles.form}>
        {fields.map(field => {
          if (field.type === 'chain') {
            return (
              <ChainSelector
                key={field.id}
                label={field.label}
                selectedChain={formValues[field.id]}
                onSelectChain={(chain) => updateField(field.id, chain)}
              />
            );
          }

          return (
            <View key={field.id} style={styles.fieldContainer}>
              <Text style={styles.label}>{field.label || field.id}</Text>
              <TextInput
                style={[
                  styles.input, 
                  field.type === 'json' && styles.textArea
                ]}
                value={formValues[field.id]}
                onChangeText={(text) => updateField(field.id, text)}
                placeholder={field.placeholder}
                placeholderTextColor={colors.textSecondary}
                keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                multiline={field.type === 'json'}
                numberOfLines={field.type === 'json' ? 4 : 1}
                autoCapitalize="none"
              />
            </View>
          );
        })}
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRun}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.black} />
        ) : (
          <Text style={styles.buttonText}>{actionLabel}</Text>
        )}
      </TouchableOpacity>

      {(result || error) && (
        <ConsoleOutput data={result || error} error={!!error} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  form: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

'use client';

import React from 'react';
import { Sparkles, Plus, RotateCcw } from 'lucide-react';
import { useForm, FieldValues } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateItem, useGetItems } from '@/lib/dynamic-crud';

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  defaultValue?: string;
}

interface Schema {
  tableName: string;
  columns: Column[];
}

interface DesignTheme {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    accent: string;
  };
  style: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant';
}

interface EnhancedDynamicFormProps {
  schema: Schema;
  theme: DesignTheme;
  onSuccess?: () => void;
}

export function EnhancedDynamicForm({ schema, theme, onSuccess }: EnhancedDynamicFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const createItem = useCreateItem(schema.tableName);
  const { refetch: refetchItems } = useGetItems(schema.tableName);

  const getInputType = (columnType: string) => {
    switch (columnType.toLowerCase()) {
      case 'integer':
      case 'int':
      case 'number':
        return 'number';
      case 'boolean':
      case 'bool':
        return 'checkbox';
      case 'timestamp':
      case 'datetime':
        return 'datetime-local';
      case 'date':
        return 'date';
      case 'email':
        return 'email';
      case 'url':
        return 'url';
      case 'tel':
      case 'phone':
        return 'tel';
      case 'text':
      case 'string':
      default:
        return 'text';
    }
  };

  const getThemeClasses = () => {
    const primaryColor = `bg-${theme.colors.primary} hover:bg-${theme.colors.primary}/90`;
    const secondaryColor = `bg-${theme.colors.secondary}`;
    const accentColor = `text-${theme.colors.accent}`;
    
    switch (theme.style) {
      case 'elegant':
        return {
          card: 'bg-gradient-to-br from-white to-gray-50 shadow-xl border-0',
          header: `bg-gradient-to-r from-${theme.colors.primary} to-${theme.colors.accent} text-white`,
          button: `${primaryColor} text-white shadow-lg hover:shadow-xl transition-all duration-300`,
          input: 'border-gray-200 focus:border-purple-400 focus:ring-purple-200',
          label: 'text-gray-700 font-medium'
        };
      case 'modern':
        return {
          card: 'bg-white shadow-lg border border-gray-100',
          header: `bg-${theme.colors.primary} text-white`,
          button: `${primaryColor} text-white rounded-lg hover:scale-105 transition-transform`,
          input: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 rounded-lg',
          label: 'text-gray-600 font-semibold'
        };
      case 'minimal':
        return {
          card: 'bg-white shadow-sm border border-gray-200',
          header: 'bg-gray-50 text-gray-800 border-b',
          button: `${primaryColor} text-white rounded-none hover:bg-gray-800 transition-colors`,
          input: 'border-gray-300 focus:border-gray-500 focus:ring-gray-200 rounded-none',
          label: 'text-gray-500 font-normal'
        };
      default:
        return {
          card: 'bg-white shadow-md',
          header: `bg-${theme.colors.primary} text-white`,
          button: `${primaryColor} text-white`,
          input: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200',
          label: 'text-gray-600'
        };
    }
  };

  const themeClasses = getThemeClasses();

  const renderFormField = (column: Column) => {
    if (column.primaryKey || column.name === 'created_at' || column.name === 'updated_at') {
      return null;
    }

    const inputType = getInputType(column.type);
    const fieldName = column.name;
    const displayName = column.name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    return (
      <div key={fieldName} className="space-y-3">
        <Label 
          htmlFor={fieldName} 
          className={`${themeClasses.label} text-sm flex items-center gap-2`}
        >
          <Sparkles className="h-4 w-4 opacity-60" />
          {displayName}
          {!column.nullable && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {inputType === 'checkbox' ? (
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <Checkbox
              id={fieldName}
              {...register(fieldName)}
              className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
            />
            <Label htmlFor={fieldName} className="text-sm font-normal cursor-pointer">
              {displayName}を有効にする
            </Label>
          </div>
        ) : column.type.toLowerCase() === 'text' && (column.name.includes('description') || column.name.includes('content') || column.name.includes('note')) ? (
          <Textarea
            id={fieldName}
            placeholder={`${displayName}を入力してください...`}
            {...register(fieldName, {
              required: !column.nullable ? `${displayName}は必須です` : false
            })}
            className={`${themeClasses.input} min-h-[100px] transition-all duration-200`}
          />
        ) : (
          <Input
            id={fieldName}
            type={inputType}
            placeholder={`${displayName}を入力してください...`}
            {...register(fieldName, {
              required: !column.nullable ? `${displayName}は必須です` : false,
              valueAsNumber: inputType === 'number' ? true : false
            })}
            className={`${themeClasses.input} transition-all duration-200 hover:border-gray-400`}
          />
        )}
        
        {errors[fieldName] && (
          <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {errors[fieldName]?.message as string}
          </p>
        )}
      </div>
    );
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      await createItem.mutateAsync(data);
      toast.success('データが正常に保存されました！', {
        description: '新しいアイテムが追加されました',
      });
      reset();
      refetchItems();
      onSuccess?.();
    } catch (error) {
      toast.error('データの保存に失敗しました', {
        description: 'もう一度お試しください',
      });
      console.error('Form submission error:', error);
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${themeClasses.card} overflow-hidden`}>
      <CardHeader className={`${themeClasses.header} py-6`}>
        <CardTitle className="text-xl font-semibold flex items-center gap-3">
          <Plus className="h-6 w-6" />
          {schema.tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - 新規作成
        </CardTitle>
        <p className="text-sm opacity-90 mt-2">
          必要な情報を入力して、新しいアイテムを作成してください
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6">
            {schema.columns.map(renderFormField)}
          </div>
          
          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <Button 
              type="submit" 
              disabled={createItem.isPending}
              className={`${themeClasses.button} flex-1 py-3 font-semibold`}
            >
              {createItem.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  保存中...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  保存
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => reset()}
              className="px-8 py-3 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              リセット
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
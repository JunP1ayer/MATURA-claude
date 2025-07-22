'use client';

import React from 'react';
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

interface DynamicFormProps {
  schema: Schema;
  onSuccess?: () => void;
}

export function DynamicForm({ schema, onSuccess }: DynamicFormProps) {
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
      case 'text':
      case 'string':
      default:
        return 'text';
    }
  };

  const renderFormField = (column: Column) => {
    if (column.primaryKey || column.name === 'created_at' || column.name === 'updated_at') {
      return null;
    }

    const inputType = getInputType(column.type);
    const fieldName = column.name;

    return (
      <div key={fieldName} className="space-y-2">
        <Label htmlFor={fieldName} className="text-sm font-medium">
          {column.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          {!column.nullable && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {inputType === 'checkbox' ? (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={fieldName}
              {...register(fieldName)}
            />
            <Label htmlFor={fieldName} className="text-sm font-normal">
              {column.name.replace(/_/g, ' ')}
            </Label>
          </div>
        ) : column.type.toLowerCase() === 'text' && column.name.includes('description') ? (
          <Textarea
            id={fieldName}
            placeholder={`${column.name.replace(/_/g, ' ')}を入力してください`}
            {...register(fieldName, {
              required: !column.nullable ? `${column.name}は必須です` : false
            })}
          />
        ) : (
          <Input
            id={fieldName}
            type={inputType}
            placeholder={`${column.name.replace(/_/g, ' ')}を入力してください`}
            {...register(fieldName, {
              required: !column.nullable ? `${column.name}は必須です` : false,
              valueAsNumber: inputType === 'number' ? true : false
            })}
          />
        )}
        
        {errors[fieldName] && (
          <p className="text-sm text-red-500">
            {errors[fieldName]?.message as string}
          </p>
        )}
      </div>
    );
  };

  const onSubmit = async (data: FieldValues) => {
    try {
      await createItem.mutateAsync(data);
      toast.success('データが正常に保存されました！');
      reset();
      refetchItems();
      onSuccess?.();
    } catch (error) {
      toast.error('データの保存に失敗しました');
      console.error('Form submission error:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {schema.tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - 新規作成
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {schema.columns.map(renderFormField)}
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={createItem.isPending}
              className="flex-1"
            >
              {createItem.isPending ? '保存中...' : '保存'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => reset()}
              className="flex-1"
            >
              リセット
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
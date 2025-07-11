import { useAppStore } from './store';
import { useEffect, useState } from 'react';

type IncomeData = {
  amount: number;
  description: string;
};

const useAppHandlers = () => {
  const { updateIncome, income, isLoading: storeLoading, error } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleIncomeUpdate = async (data: IncomeData) => {
    console.log('handleIncomeUpdate called with data:', data);
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    try {
      await updateIncome(data.amount);
      console.log('updateIncome successful:', income);
      setIsLoading(false);
    } catch (err: any) {
      console.error('updateIncome failed:', err);
      setIsLoading(false);
      setIsError(true);
      setErrorMessage(err.message || 'An unexpected error occurred.');
    }
  };

  const handleReset = () => {
    console.log('handleReset called');
    // Add reset logic here if needed.  Example:  dispatch(resetIncome());
  };

  return {
    handleIncomeUpdate,
    handleReset,
    isLoading,
    isError,
    errorMessage,
    income,
    loading: storeLoading,
    error
  };
};


const useUIHandlers = () => {
  const [inputValue, setInputValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    console.log('Input value changed:', inputValue);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescriptionValue(event.target.value);
    console.log('Description value changed:', descriptionValue);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('handleSubmit called');
    const amount = parseFloat(inputValue);
    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid input amount');
      //Handle error appropriately, e.g., display an error message
      return;
    }
    const data: IncomeData = { amount, description: descriptionValue };
    //Call your update function here
  };

  return {
    inputValue,
    descriptionValue,
    handleInputChange,
    handleDescriptionChange,
    handleSubmit,
    setInputValue,
    setDescriptionValue
  };
};


export { useAppHandlers, useUIHandlers };
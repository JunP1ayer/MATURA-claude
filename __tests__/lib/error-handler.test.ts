import { handleApiError, errorToToast } from '@/lib/error-handler'

describe('error-handler', () => {
  describe('handleApiError', () => {
    it('should handle Error objects', () => {
      const error = new Error('Test error message')
      const result = handleApiError(error)
      
      expect(result).toEqual({
        message: 'Test error message',
        type: 'error',
        code: 'UNKNOWN_ERROR',
        details: error.message,
      })
    })

    it('should handle objects with message property', () => {
      const error = { message: 'Custom error message' }
      const result = handleApiError(error)
      
      expect(result).toEqual({
        message: 'Custom error message',
        type: 'error',
        code: 'UNKNOWN_ERROR',
        details: error.message,
      })
    })

    it('should handle API response errors', () => {
      const error = {
        message: 'API Error',
        status: 404,
        code: 'NOT_FOUND',
      }
      const result = handleApiError(error)
      
      expect(result).toEqual({
        message: 'API Error',
        type: 'error',
        code: 'NOT_FOUND',
        details: error.message,
      })
    })

    it('should handle network errors', () => {
      const error = {
        message: 'Network Error',
        status: 0,
      }
      const result = handleApiError(error)
      
      expect(result).toEqual({
        message: 'ネットワークエラーが発生しました',
        type: 'error',
        code: 'NETWORK_ERROR',
        details: error.message,
      })
    })

    it('should handle unknown errors', () => {
      const error = 'Unknown error'
      const result = handleApiError(error)
      
      expect(result).toEqual({
        message: '予期しないエラーが発生しました',
        type: 'error',
        code: 'UNKNOWN_ERROR',
        details: 'Unknown error',
      })
    })

    it('should handle null/undefined errors', () => {
      const result1 = handleApiError(null)
      const result2 = handleApiError(undefined)
      
      expect(result1).toEqual({
        message: '予期しないエラーが発生しました',
        type: 'error',
        code: 'UNKNOWN_ERROR',
        details: 'Unknown error occurred',
      })
      
      expect(result2).toEqual({
        message: '予期しないエラーが発生しました',
        type: 'error',
        code: 'UNKNOWN_ERROR',
        details: 'Unknown error occurred',
      })
    })
  })

  describe('errorToToast', () => {
    it('should convert error response to toast options', () => {
      const errorResponse = {
        message: 'Test error',
        type: 'error' as const,
        code: 'TEST_ERROR',
        details: 'Test details',
      }
      
      const result = errorToToast(errorResponse)
      
      expect(result).toEqual({
        title: 'Test error',
        description: 'Test details',
        duration: 5000,
        variant: 'destructive',
      })
    })

    it('should handle validation errors with longer duration', () => {
      const errorResponse = {
        message: 'Validation failed',
        type: 'error' as const,
        code: 'VALIDATION_ERROR',
        details: 'Field is required',
      }
      
      const result = errorToToast(errorResponse)
      
      expect(result).toEqual({
        title: 'Validation failed',
        description: 'Field is required',
        duration: 4000,
        variant: 'destructive',
      })
    })

    it('should handle network errors with retry suggestion', () => {
      const errorResponse = {
        message: 'Network error',
        type: 'error' as const,
        code: 'NETWORK_ERROR',
        details: 'Connection failed',
      }
      
      const result = errorToToast(errorResponse)
      
      expect(result).toEqual({
        title: 'Network error',
        description: 'Connection failed',
        duration: 6000,
        variant: 'destructive',
      })
    })

    it('should handle server errors', () => {
      const errorResponse = {
        message: 'Server error',
        type: 'error' as const,
        code: 'SERVER_ERROR',
        details: 'Internal server error',
      }
      
      const result = errorToToast(errorResponse)
      
      expect(result).toEqual({
        title: 'Server error',
        description: 'Internal server error',
        duration: 7000,
        variant: 'destructive',
      })
    })
  })
})
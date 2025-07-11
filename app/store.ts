import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FamilyMember {
  name: string;
  relationship: string;
  income: number;
  deductible: boolean;
}

interface AppState {
  income: number;
  remainingLimit: number;
  familyMembers: FamilyMember[];
  isLoading: boolean;
  error: string | null;
}

interface AppActions {
  updateIncome: (income: number) => void;
  addFamilyMember: (member: Omit<FamilyMember, 'deductible'>) => void;
  updateFamilyMember: (index: number, updates: Partial<FamilyMember>) => void;
  removeFamilyMember: (index: number) => void;
  calculateRemaining: (limit: number) => void;
  toggleDeductible: (index: number) => void;
}


export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      income: 0,
      remainingLimit: 0,
      familyMembers: [],
      isLoading: false,
      error: null,
      updateIncome: (income: number) => {
        console.log('Updating income:', income);
        if (typeof income !== 'number' || income < 0) {
          set({ error: 'Invalid income value' });
          return;
        }
        set({ income, error: null });
        get().calculateRemaining(1000000); //Example limit.  Replace with actual limit.
      },
      addFamilyMember: (member: Omit<FamilyMember, 'deductible'>) => {
        console.log('Adding family member:', member);
        set((state) => ({
          familyMembers: [...state.familyMembers, {...member, deductible: false}],
        }));
        get().calculateRemaining(1000000); //Example limit. Replace with actual limit.
      },
      updateFamilyMember: (index: number, updates: Partial<FamilyMember>) => {
        console.log('Updating family member:', index, updates);
        set((state) => ({
          familyMembers: state.familyMembers.map((member, i) =>
            i === index ? { ...member, ...updates } : member
          ),
        }));
        get().calculateRemaining(1000000); //Example limit. Replace with actual limit.

      },
      removeFamilyMember: (index: number) => {
        console.log('Removing family member:', index);
        set((state) => ({
          familyMembers: state.familyMembers.filter((_, i) => i !== index),
        }));
        get().calculateRemaining(1000000); //Example limit. Replace with actual limit.
      },
      calculateRemaining: (limit: number) => {
        console.log('Calculating remaining limit...');
        set({ isLoading: true, error: null });
        try {
          const totalDeductibleIncome = get().familyMembers.filter(member => member.deductible).reduce((sum, member) => sum + member.income, 0);
          const remaining = limit - get().income - totalDeductibleIncome;
          set({ remainingLimit: remaining, isLoading: false });
        } catch (e) {
          set({ error: 'Error calculating remaining limit', isLoading: false });
          console.error('Error calculating remaining limit:', e);
        }
      },
      toggleDeductible: (index: number) => {
        console.log('Toggling deductible for family member:', index);
        set((state) => ({
          familyMembers: state.familyMembers.map((member, i) =>
            i === index ? { ...member, deductible: !member.deductible } : member
          ),
        }));
        get().calculateRemaining(1000000); //Example limit. Replace with actual limit.
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
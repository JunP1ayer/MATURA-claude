'use client'

import React from 'react'
import { OnboardingFlow, useOnboarding } from '@/components/onboarding/onboarding-flow'
import { motion } from 'framer-motion'
import { pageTransition } from '@/lib/animations'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { showOnboarding, completeOnboarding } = useOnboarding()

  return (
    <>
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
      
      {showOnboarding && (
        <OnboardingFlow onComplete={completeOnboarding} />
      )}
    </>
  )
}
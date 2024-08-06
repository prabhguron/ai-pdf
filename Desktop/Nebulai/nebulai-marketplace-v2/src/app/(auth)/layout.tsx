import PageLayout from '@/components/PageLayout'
import React from 'react'

const ForgotResetPasswordLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <PageLayout noLogin={true}>
        {children}
    </PageLayout>
  )
}

export default ForgotResetPasswordLayout
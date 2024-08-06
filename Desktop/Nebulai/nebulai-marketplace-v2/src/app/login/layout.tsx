import PageLayout from '@/components/PageLayout';
import React from 'react'

const LoginLayout = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
  return (
    <PageLayout noLogin={true}>
        {children}
    </PageLayout>
  )
}

export default LoginLayout
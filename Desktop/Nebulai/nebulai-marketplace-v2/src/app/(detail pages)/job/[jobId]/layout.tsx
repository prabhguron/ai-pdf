import PageLayout from '@/components/PageLayout'
import React from 'react'

const JobDetailsLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <PageLayout>
        {children}
    </PageLayout>
  )
}

export default JobDetailsLayout
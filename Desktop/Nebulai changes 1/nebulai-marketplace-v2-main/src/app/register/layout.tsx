'use client';

import PageLayout from '@/components/PageLayout'
import React from 'react'
import { usePathname } from 'next/navigation';

const RegisterLayout = ({children}:{children: React.ReactNode}) => {
  const pathname = usePathname();
  if(pathname && ["/register/success"].includes(pathname)){
    return (
        <>
            {children}
        </>
    )
  }

  return (
    <PageLayout>
        {children}
    </PageLayout>
  )
}

export default RegisterLayout
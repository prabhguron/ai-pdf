import PostJob from '@/components/company/postJob/PostJob'
import React from 'react'
import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | Post New Job",
  description:
    metaDescription,
};
const PostJobPage = () => {
  return (
    <>
      <PostJob/>
    </>
  )
}

export default PostJobPage
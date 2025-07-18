import React from 'react'
import SubmissionForm  from "@/components/SubmissionForm"

const page = () => {
  return (
    <>
     <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Submit Your Startup</h1>
      </section>
      <SubmissionForm/>
    </>
  )
}

export default page
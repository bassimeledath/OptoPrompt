"use client"

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import OptimizationForm from '@/components/OptimizationForm'
import ResultsDisplay from '@/components/ResultsDisplay'

export default function OptoPrompt() {
  const [file, setFile] = useState<File | null>(null)
  const [maxBootstrappedDemos, setMaxBootstrappedDemos] = useState(0)
  const [maxLabeledDemos, setMaxLabeledDemos] = useState(0)
  const [numCandidatePrograms, setNumCandidatePrograms] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const handleOptimize = () => {
    console.log("Optimizing with:", { file, maxBootstrappedDemos, maxLabeledDemos, numCandidatePrograms })
    setShowResults(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#faf5e5]">
      <Navbar />
      <div className="flex flex-grow">
        <div className="w-1/2 p-6 bg-[#faf5e5]">
          <OptimizationForm
            file={file}
            setFile={setFile}
            maxBootstrappedDemos={maxBootstrappedDemos}
            setMaxBootstrappedDemos={setMaxBootstrappedDemos}
            maxLabeledDemos={maxLabeledDemos}
            setMaxLabeledDemos={setMaxLabeledDemos}
            numCandidatePrograms={numCandidatePrograms}
            setNumCandidatePrograms={setNumCandidatePrograms}
            handleOptimize={handleOptimize}
          />
        </div>
        <div className="w-1/2 p-6 bg-[#faf5e5] flex items-center justify-center">
          <ResultsDisplay showResults={showResults} />
        </div>
      </div>
    </div>
  )
}
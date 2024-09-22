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
  const [results, setResults] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [callId, setCallId] = useState<string | null>(null)

  const handleOptimize = async () => {
    setIsLoading(true)
    const formData = new FormData()
    if (file) formData.append('file', file)
    formData.append('data', JSON.stringify({
      maxBootstrappedDemos,
      maxLabeledDemos,
      numCandidatePrograms
    }))

    console.log("Sending request to server...")

    try {
      const response = await fetch('http://localhost:8000/optimize', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json()
      console.log("Response data:", data)

      if (data.results && data.results.text) {
        setResults(data.results)
        setCallId(data.call_id)
      } else {
        console.error("Unexpected response format:", data)
        setResults([])  // Set to an empty array instead of null
        setCallId(null)
      }
    } catch (error) {
      console.error('Error:', error)
      setResults(null)
      setCallId(null)
    } finally {
      setIsLoading(false)
    }
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
            isLoading={isLoading}
          />
        </div>
        <div className="w-1/2 p-6 bg-[#faf5e5] flex items-center justify-center">
          <ResultsDisplay results={results} isLoading={isLoading} callId={callId} />
        </div>
      </div>
    </div>
  )
}
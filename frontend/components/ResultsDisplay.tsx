import React, { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'

interface ResultsDisplayProps {
    results: any[]
    isLoading: boolean
    callId: string | null
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading, callId }) => {
    const [currentResultIndex, setCurrentResultIndex] = useState(0)

    console.log('callId:', callId) // Add this line to log the callId

    if (isLoading) {
        return (
            <div className="text-gray-500 text-center">
                {/* You can add a loading spinner here if you'd like */}
            </div>
        )
    }

    if (!results || results.length === 0) {
        return (
            <div className="text-gray-500 text-center">
                Click "Optimize" to see results
            </div>
        )
    }

    return (
        <Card className="w-full h-full flex flex-col">
            <CardContent className="p-6 flex-grow flex flex-col">
                <div className="flex-grow overflow-hidden mb-4">
                    <div className="text-left h-[550px] overflow-y-auto bg-gray-100 rounded-md p-4">
                        <pre className="font-mono text-base text-gray-700 whitespace-pre-wrap break-words">
                            <code>{results[currentResultIndex].text}</code>
                        </pre>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="w-1/3 text-left">
                        {currentResultIndex === 0 ? (
                            <span className="text-[#fb882f] font-semibold text-xl">👑 Prompt</span>
                        ) : (
                            <span className="text-[#fb882f] font-semibold text-lg">
                                Prompt ({currentResultIndex + 1}/{results.length})
                            </span>
                        )}
                    </div>
                    <div className="w-1/3 flex justify-center items-center space-x-4">
                        <Button
                            onClick={() => setCurrentResultIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))}
                            className="bg-[#dac5fe] hover:bg-[#c5b0e9] text-[#fb882f] p-2 rounded-full"
                            size="icon"
                        >
                            <ArrowLeft className="w-6 h-6" />
                            <span className="sr-only">Previous</span>
                        </Button>
                        <Button
                            onClick={() => setCurrentResultIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))}
                            className="bg-[#dac5fe] hover:bg-[#c5b0e9] text-[#fb882f] p-2 rounded-full"
                            size="icon"
                        >
                            <ArrowRight className="w-6 h-6" />
                            <span className="sr-only">Next</span>
                        </Button>
                    </div>
                    <div className="w-1/3 flex justify-end">
                        {callId ? (
                            <Link href={`https://wandb.ai/bassimfaizal/weave_dspy_demo/r/call/${callId}`} target="_blank" rel="noopener noreferrer">
                                <Button className="bg-[#dac5ff] hover:bg-[#c5b0e9] font-semibold py-2 px-4">
                                    <Image src="/weave_logo.png" alt="Weave Logo" width={100} height={24} className="mr-2" />
                                </Button>
                            </Link>
                        ) : (
                            <>
                                {console.log('Button disabled: callId is falsy')} {/* Add this line */}
                                <Button className="bg-gray-400 font-semibold py-2 px-4" disabled>
                                    <Image src="/weave_logo.png" alt="Weave Logo" width={100} height={24} className="mr-2" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ResultsDisplay

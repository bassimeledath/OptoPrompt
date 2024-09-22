import React, { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ResultsDisplayProps {
    results: any[]
    isLoading: boolean
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading }) => {
    const [currentResultIndex, setCurrentResultIndex] = useState(0)

    if (isLoading) {
        return (
            <div className="text-gray-500 text-center">

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
                    <div className="text-center h-[550px] overflow-y-auto">
                        <p className="px-2">{results[currentResultIndex].text}</p>
                    </div>
                </div>
                <div className="flex justify-center items-center space-x-4">
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
            </CardContent>
        </Card>
    )
}

export default ResultsDisplay
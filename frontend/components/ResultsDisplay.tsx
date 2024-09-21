import React, { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ResultsDisplayProps {
    showResults: boolean
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ showResults }) => {
    const [currentResultIndex, setCurrentResultIndex] = useState(0)

    // Mock data for results with longer text
    const mockResults = [
        "Optimized result 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Optimized result 2: Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Optimized result 3: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Optimized result 4: Ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    ]

    if (!showResults) {
        return (
            <div className="text-gray-500 text-center">
                Click "Optimize" to see results
            </div>
        )
    }

    return (
        <Card className="w-full h-full flex flex-col">
            <CardContent className="p-6 flex-grow flex flex-col">
                <div className="flex-grow overflow-y-auto mb-4">
                    <div className="text-center">
                        {mockResults[currentResultIndex]}
                    </div>
                </div>
                <div className="flex justify-center items-center space-x-4">
                    <Button
                        onClick={() => setCurrentResultIndex((prev) => (prev > 0 ? prev - 1 : mockResults.length - 1))}
                        className="bg-[#dac5fe] hover:bg-[#c5b0e9] text-[#fb882f] p-2 rounded-full"
                        size="icon"
                    >
                        <ArrowLeft className="w-6 h-6" />
                        <span className="sr-only">Previous</span>
                    </Button>
                    <Button
                        onClick={() => setCurrentResultIndex((prev) => (prev < mockResults.length - 1 ? prev + 1 : 0))}
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
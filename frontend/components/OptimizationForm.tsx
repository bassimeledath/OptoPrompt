import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import FileUpload from './FileUpload'
import LoadingPrompts from './LoadingPrompts'

interface OptimizationFormProps {
    file: File | null
    setFile: (file: File | null) => void
    maxBootstrappedDemos: number
    setMaxBootstrappedDemos: (value: number) => void
    maxLabeledDemos: number
    setMaxLabeledDemos: (value: number) => void
    numCandidatePrograms: number
    setNumCandidatePrograms: (value: number) => void
    handleOptimize: () => void
    isLoading: boolean
}

const OptimizationForm: React.FC<OptimizationFormProps> = ({
    file,
    setFile,
    maxBootstrappedDemos,
    setMaxBootstrappedDemos,
    maxLabeledDemos,
    setMaxLabeledDemos,
    numCandidatePrograms,
    setNumCandidatePrograms,
    handleOptimize,
    isLoading
}) => {
    const [error, setError] = useState<string | null>(null);

    const validateAndOptimize = () => {
        if (!file) {
            setError("Please upload a file.");
            return;
        }
        setError(null);
        handleOptimize();
    };

    return (
        <Card>
            <CardContent className="space-y-4 p-6">
                <FileUpload file={file} setFile={setFile} />
                <div>
                    <Label htmlFor="max-bootstrapped-demos">Max Bootstrapped Demos</Label>
                    <Input
                        id="max-bootstrapped-demos"
                        type="number"
                        value={maxBootstrappedDemos}
                        onChange={(e) => setMaxBootstrappedDemos(parseInt(e.target.value))}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="max-labeled-demos">Max Labeled Demos</Label>
                    <Input
                        id="max-labeled-demos"
                        type="number"
                        value={maxLabeledDemos}
                        onChange={(e) => setMaxLabeledDemos(parseInt(e.target.value))}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="num-candidate-programs">Num Candidate Programs</Label>
                    <Input
                        id="num-candidate-programs"
                        type="number"
                        value={numCandidatePrograms}
                        onChange={(e) => setNumCandidatePrograms(parseInt(e.target.value))}
                        className="mt-1"
                    />
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}

                {isLoading ? (
                    <LoadingPrompts count={numCandidatePrograms} />
                ) : (
                    <Button
                        onClick={validateAndOptimize}
                        className="w-full bg-[#fb882f] hover:bg-[#e77d2e] text-white"
                        disabled={isLoading}
                    >
                        Optimize
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

export default OptimizationForm
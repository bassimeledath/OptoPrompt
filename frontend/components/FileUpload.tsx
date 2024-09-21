import React from 'react'
import { Upload } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FileUploadProps {
    file: File | null
    setFile: (file: File | null) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ file, setFile }) => {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type === "text/csv") {
            setFile(file)
        } else {
            alert("Please upload a valid CSV file")
        }
    }

    return (
        <div>
            <Label htmlFor="file-upload">Upload CSV</Label>
            <div className="flex items-center mt-1">
                <Input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="sr-only"
                />
                <Label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-white px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 flex items-center"
                >
                    <Upload className="w-4 h-4 mr-2" />
                    {file ? file.name : "Choose file"}
                </Label>
            </div>
        </div>
    )
}

export default FileUpload
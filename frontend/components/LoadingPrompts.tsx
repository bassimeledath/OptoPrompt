import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingPromptsProps {
    count: number;
}

const LoadingPrompts: React.FC<LoadingPromptsProps> = ({ count }) => {
    return (
        <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Testing {count} prompt variations</span>
        </div>
    );
};

export default LoadingPrompts;
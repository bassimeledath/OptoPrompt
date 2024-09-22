import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingPrompts: React.FC = () => {
    return (
        <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Testing several prompt variations</span>
        </div>
    );
};

export default LoadingPrompts;
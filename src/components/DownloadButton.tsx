import React, { useState } from 'react';

const DownloadButton: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/download-database');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'database.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            console.error('Error downloading database:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button className='button px-6 py-1 text-black text-sm cursor-pointer'
            onClick={handleDownload} disabled={loading}>
            {loading ? 'Downloading...' : 'Download Database'}
        </button>
    );
};

export default DownloadButton;
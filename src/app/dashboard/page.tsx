'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Decode JWT and fetch uploaded files
    useEffect(() => {
        const token = localStorage.getItem('zeropass-token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setEmail(payload.email);

            fetch('/api/files/list', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setFiles(data))
                .catch((err) => console.error('❌ Failed to fetch files:', err));
        } catch {
            router.push('/');
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            uploadFile(selected);
        }
    };

    const uploadFile = async (selectedFile: File) => {
        const token = localStorage.getItem('zeropass-token');
        if (!token) {
            setMessage('❌ Missing token');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('token', token);

        setUploading(true);
        setMessage('');

        const res = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        setUploading(false);

        if (res.ok) {
            setMessage('✅ File uploaded successfully!');
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            // Reload file list
            const newFiles = await fetch('/api/files/list', {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.json());

            setFiles(newFiles);
        } else {
            setMessage(`❌ Upload failed: ${data.error}`);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleCancel = () => {
        setFile(null);
        setMessage('⛔ Upload canceled');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold">📁 ZeroPass Drive</h1>
            {email && <p className="mb-4 text-gray-600">Logged in as: {email}</p>}

            <div className="flex flex-col space-y-3 max-w-md">
                <button
                    onClick={handleUploadClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload File'}
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {file && (
                    <div className="text-sm text-gray-700">Selected: {file.name}</div>
                )}

                {file && !uploading && (
                    <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Cancel Upload
                    </button>
                )}

                {message && <p>{message}</p>}
            </div>

            {/* File List */}
            <div className="mt-8 max-w-md">
                <h2 className="text-lg font-semibold mb-2">📂 Your Files</h2>
                {files.length === 0 ? (
                    <p className="text-gray-500">No files uploaded yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {files.map((file) => (
                            <li
                                key={file.id}
                                className="flex justify-between items-center border rounded p-2"
                            >
                                <div className="text-sm">
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                                <a
                                    href={`/uploads/${file.path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    Download
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}

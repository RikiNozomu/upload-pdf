"use client";

import { Files } from "@prisma/client";
import moment from 'moment';

interface ListProps {
    files: Files[];
    offset?: number
}

export default function FilesList({ files }: ListProps) {
    return (
        <div className="max-w-3xl w-full px-4">
            <table className="w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Image ID
                        </th>
                        <th className="px-6 py-3 border-b text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                            S3 URL
                        </th>
                        <th className="px-6 py-3 border-b text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                            Created Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file) => (
                        <tr key={file.image_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 border-b text-sm text-gray-500">
                                {file.image_id}
                            </td>
                            <td className="px-6 py-4 border-b text-sm">
                                <a
                                    href={file.s3_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    View File
                                </a>
                            </td>
                            <td className="px-6 py-4 border-b text-sm text-gray-500 text-right">
                                {moment(file.created_date).local().format('YYYY-MM-DD HH:mm:ss')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
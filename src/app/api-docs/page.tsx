'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    fetch('/api/docs')
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((e) => console.error(e));
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md my-4">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Meta Accounts Center REST API Documentation
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          OpenAPI 3.0 specification for Red Software Full-Stack Developer evaluation.
        </p>
      </div>
      {spec ? <SwaggerUI spec={spec} /> : <p className="text-sm text-gray-400">Loading API documentation...</p>}
    </div>
  );
}

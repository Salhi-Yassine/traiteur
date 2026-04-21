import React, { useState, useEffect } from 'react';
import { runMockDataTests, mockDataHealthCheck } from '@/lib/mockDataTests';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

interface TestRunnerProps {
  autoRun?: boolean;
  showHealthCheck?: boolean;
}

export const MockDataTestRunner: React.FC<TestRunnerProps> = ({
  autoRun = false,
  showHealthCheck = true,
}) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [healthCheck, setHealthCheck] = useState<ReturnType<typeof mockDataHealthCheck> | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const testResults = await runMockDataTests();
      setResults(testResults.results);
    } catch (error) {
      console.error('Test runner failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (autoRun) {
      runTests();
    }
    if (showHealthCheck) {
      setHealthCheck(mockDataHealthCheck());
    }
  }, [autoRun, showHealthCheck]);

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mock Data System Tests</h2>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Running...' : 'Run Tests'}
        </button>
      </div>

      {showHealthCheck && healthCheck && (
        <div className="mb-6 p-4 rounded-md border">
          <h3 className="text-lg font-semibold mb-2">Health Check</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-block w-3 h-3 rounded-full ${healthCheck.healthy ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="font-medium">{healthCheck.healthy ? 'Healthy' : 'Issues Found'}</span>
          </div>

          {healthCheck.issues.length > 0 && (
            <ul className="list-disc list-inside text-red-600 text-sm">
              {healthCheck.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          )}

          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {Object.entries(healthCheck.metrics).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="font-semibold text-gray-900">{value}</div>
                <div className="text-gray-600 capitalize">{key.replace('Count', '')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-lg font-semibold">
              Results: {passedCount} passed, {failedCount} failed
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                {passedCount} ✅
              </span>
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                {failedCount} ❌
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border ${
                  result.passed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                    {result.passed ? '✅' : '❌'}
                  </span>
                  <span className="font-medium">{result.name}</span>
                </div>
                {result.error && (
                  <div className="mt-1 text-sm text-red-600 font-mono">
                    Error: {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !isRunning && (
        <div className="text-center py-8 text-gray-500">
          Click "Run Tests" to validate the mock data system
        </div>
      )}
    </div>
  );
};

export default MockDataTestRunner;
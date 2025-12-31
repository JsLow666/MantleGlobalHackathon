import { useState } from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { useContracts } from '../../hooks/useContracts';
import { useNotifications } from '../../contexts/NotificationContext';
import { apiService, AnalyzeResponse } from '../../services/api';

const SubmitNewsForm = () => {
  const { account, isVerified } = useWallet();
  const { submitNews } = useContracts();
  const { addNotification } = useNotifications();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!title || !content || !sourceUrl) {
      setError('Please fill all fields');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('🤖 Starting AI analysis...');
      const response = await apiService.analyzeNews({
        title,
        content,
        sourceUrl,
      });

      setAnalysis(response);
      console.log('✅ AI analysis complete:', response.analysis);
    } catch (error: any) {
      console.error('❌ Analysis failed:', error);
      setError(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!analysis) {
      setError('Please analyze first');
      return;
    }

    if (!account) {
      setError('Please connect your wallet');
      return;
    }

    if (!isVerified) {
      setError('Please verify your identity with ZK proof first');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('📝 Submitting news to blockchain...');

      const newsId = await submitNews(
        analysis.blockchain.contentHash,
        title,
        sourceUrl,
        analysis.analysis.score
      );

      console.log('🎉 News submitted successfully! ID:', newsId);

      // Show success notification
      addNotification({
        type: 'success',
        title: 'News Submitted Successfully',
        message: `Your article has been submitted for validation. News ID: ${newsId}`,
        autoHide: true,
        duration: 5000,
      });

      // Reset form
      setTitle('');
      setContent('');
      setSourceUrl('');
      setAnalysis(null);
    } catch (error: any) {
      console.error('❌ Submission failed:', error);
      setError(`Submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!account) {
    return (
      <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 rounded-md p-6">
        <div className="flex items-center space-x-2 text-yellow-800">
          <AlertCircle className="h-5 w-5" />
          <span>Please connect your wallet to submit news.</span>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="max-w-2xl mx-auto bg-orange-50 border border-orange-200 rounded-md p-6">
        <div className="flex items-center space-x-2 text-orange-800">
          <AlertCircle className="h-5 w-5" />
          <span>Please verify your identity with ZK proof before submitting news.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            News Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter news title..."
            maxLength={200}
            disabled={isAnalyzing || isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            News Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the full news article content..."
            maxLength={10000}
            disabled={isAnalyzing || isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source URL
          </label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
            disabled={isAnalyzing || isSubmitting}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {!analysis && (
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !title || !content || !sourceUrl}
            className="w-full btn-primary flex items-center justify-center disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analyzing with AI...
              </>
            ) : (
              'Analyze with AI'
            )}
          </button>
        )}

        {analysis && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-blue-900">AI Analysis Result</h3>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">Ready to submit</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-blue-800">
                <span className="font-medium">Score:</span> {analysis.analysis.score}/100
              </p>
              <p className="text-blue-800">
                <span className="font-medium">Verdict:</span> {analysis.analysis.verdict}
              </p>
              <p className="text-blue-800">
                <span className="font-medium">Confidence:</span> {analysis.analysis.confidence}%
              </p>
              <p className="text-blue-800 text-xs mt-2">
                {analysis.analysis.explanation}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-4 w-full btn-primary flex items-center justify-center disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting to Blockchain...
                </>
              ) : (
                'Submit to Blockchain'
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SubmitNewsForm;
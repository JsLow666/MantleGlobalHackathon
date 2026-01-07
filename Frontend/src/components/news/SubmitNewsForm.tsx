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
      <div className="max-w-2xl mx-auto bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-6 backdrop-blur">
        <div className="flex items-center space-x-2 text-yellow-300">
          <AlertCircle className="h-5 w-5" />
          <span>Please connect your wallet to submit news.</span>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="max-w-2xl mx-auto bg-orange-500/10 border border-orange-400/30 rounded-xl p-6 backdrop-blur">
        <div className="flex items-center space-x-2 text-orange-300">
          <AlertCircle className="h-5 w-5" />
          <span>Please verify your identity with ZK proof before submitting news.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.15)] p-8">
      <form className="space-y-8">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            News Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter news headline…"
            maxLength={200}
            disabled={isAnalyzing || isSubmitting}
            className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            News Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            maxLength={10000}
            disabled={isAnalyzing || isSubmitting}
            placeholder="Paste full article content for AI verification…"
            className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Source URL
          </label>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            disabled={isAnalyzing || isSubmitting}
            placeholder="https://news-source.com/article"
            className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Analyze */}
        {!analysis && (
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !title || !content || !sourceUrl}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-black hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                AI Analyzing…
              </>
            ) : (
              'Analyze with AI'
            )}
          </button>
        )}

        {/* Analysis Result */}
        {analysis && (
          <div className="border border-cyan-400/30 rounded-xl p-6 bg-cyan-500/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-cyan-300">
                AI Validation Result
              </h3>
              <div className="flex items-center space-x-1 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Ready</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="font-medium text-gray-400">Score:</span>{' '}
                {analysis.analysis.score}/100
              </p>
              <p>
                <span className="font-medium text-gray-400">Verdict:</span>{' '}
                {analysis.analysis.verdict}
              </p>
              <p>
                <span className="font-medium text-gray-400">Confidence:</span>{' '}
                {analysis.analysis.confidence}%
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {analysis.analysis.explanation}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-6 w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-black hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting On-chain…
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
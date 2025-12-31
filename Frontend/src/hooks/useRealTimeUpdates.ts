import { useEffect, useCallback, useRef } from 'react';
import { useContracts, VoteType } from './useContracts';
import { Verdict } from '../utils/scoreCalculation';
import { useNotifications } from '../contexts/NotificationContext';

interface RealTimeUpdates {
  onVoteUpdate: (callback: (newsId: number, voter: string, voteType: VoteType, timestamp: number) => void) => () => void;
  onVerdictUpdate: (callback: (newsId: number, verdict: Verdict, finalScore: number, confidence: number, timestamp: number) => void) => () => void;
  onNewsUpdate: (callback: (newsId: number, contentHash: string, submitter: string, aiScore: number, timestamp: number) => void) => () => void;
}

export const useRealTimeUpdates = (): RealTimeUpdates => {
  const { onVoteCast, onVerdictCalculated, onNewsSubmitted } = useContracts();
  const { addNotification } = useNotifications();
  const callbacksRef = useRef<{
    voteCallbacks: Set<(newsId: number, voter: string, voteType: VoteType, timestamp: number) => void>;
    verdictCallbacks: Set<(newsId: number, verdict: Verdict, finalScore: number, confidence: number, timestamp: number) => void>;
    newsCallbacks: Set<(newsId: number, contentHash: string, submitter: string, aiScore: number, timestamp: number) => void>;
  }>({
    voteCallbacks: new Set(),
    verdictCallbacks: new Set(),
    newsCallbacks: new Set(),
  });

  // Set up event listeners
  useEffect(() => {
    console.log('🔄 Setting up real-time event listeners...');

    const voteUnsubscribe = onVoteCast((newsId, voter, voteType, timestamp) => {
      console.log('🗳️ Real-time vote event:', { newsId, voter, voteType, timestamp });

      // Show notification for vote events
      const voteTypeLabel = voteType === VoteType.Real ? 'Real' :
                           voteType === VoteType.Fake ? 'Fake' : 'Uncertain';
      addNotification({
        type: 'info',
        title: 'New Vote Cast',
        message: `Someone voted "${voteTypeLabel}" on news article #${newsId}`,
        autoHide: true,
        duration: 3000,
      });

      callbacksRef.current.voteCallbacks.forEach(callback =>
        callback(newsId, voter, voteType, timestamp)
      );
    });

    const verdictUnsubscribe = onVerdictCalculated((newsId, verdict, finalScore, confidence, timestamp) => {
      console.log('⚖️ Real-time verdict event:', { newsId, verdict, finalScore, confidence, timestamp });

      // Show notification for verdict events
      const verdictLabel = verdict === Verdict.Real ? 'Real' :
                          verdict === Verdict.Fake ? 'Fake' : 'Uncertain';
      addNotification({
        type: 'success',
        title: 'Verdict Reached',
        message: `News article #${newsId} has been determined as "${verdictLabel}" with ${confidence}% confidence`,
        autoHide: true,
        duration: 5000,
      });

      callbacksRef.current.verdictCallbacks.forEach(callback =>
        callback(newsId, verdict, finalScore, confidence, timestamp)
      );
    });

    const newsUnsubscribe = onNewsSubmitted((newsId, contentHash, submitter, aiScore, timestamp) => {
      console.log('📰 Real-time news event:', { newsId, contentHash, submitter, aiScore, timestamp });

      // Show notification for new news events
      addNotification({
        type: 'info',
        title: 'New Article Submitted',
        message: `A new news article has been submitted for validation`,
        autoHide: true,
        duration: 4000,
      });

      callbacksRef.current.newsCallbacks.forEach(callback =>
        callback(newsId, contentHash, submitter, aiScore, timestamp)
      );
    });

    return () => {
      console.log('🔌 Cleaning up real-time event listeners...');
      voteUnsubscribe();
      verdictUnsubscribe();
      newsUnsubscribe();
    };
  }, []); // Remove function dependencies to prevent re-setup/cleanup loops

  const onVoteUpdate = useCallback((callback: (newsId: number, voter: string, voteType: VoteType, timestamp: number) => void) => {
    callbacksRef.current.voteCallbacks.add(callback);
    return () => callbacksRef.current.voteCallbacks.delete(callback);
  }, []);

  const onVerdictUpdate = useCallback((callback: (newsId: number, verdict: Verdict, finalScore: number, confidence: number, timestamp: number) => void) => {
    callbacksRef.current.verdictCallbacks.add(callback);
    return () => callbacksRef.current.verdictCallbacks.delete(callback);
  }, []);

  const onNewsUpdate = useCallback((callback: (newsId: number, contentHash: string, submitter: string, aiScore: number, timestamp: number) => void) => {
    callbacksRef.current.newsCallbacks.add(callback);
    return () => callbacksRef.current.newsCallbacks.delete(callback);
  }, []);

  return {
    onVoteUpdate,
    onVerdictUpdate,
    onNewsUpdate,
  };
};
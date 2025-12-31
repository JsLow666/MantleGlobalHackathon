import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Flag } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface SocialFeaturesProps {
  newsId: string;
  title: string;
}

const SocialFeatures = ({ newsId, title }: SocialFeaturesProps) => {
  const { account } = useWallet();
  const { addNotification } = useNotifications();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleLike = () => {
    if (!account) {
      addNotification({
        type: 'warning',
        title: 'Wallet Required',
        message: 'Please connect your wallet to like articles'
      });
      return;
    }

    setLiked(!liked);
    addNotification({
      type: 'success',
      title: 'Article Liked',
      message: liked ? 'Article unliked' : 'Article liked'
    });
  };

  const handleBookmark = () => {
    if (!account) {
      addNotification({
        type: 'warning',
        title: 'Wallet Required',
        message: 'Please connect your wallet to bookmark articles'
      });
      return;
    }

    setBookmarked(!bookmarked);
    addNotification({
      type: 'success',
      title: 'Bookmark Updated',
      message: bookmarked ? 'Article removed from bookmarks' : 'Article bookmarked'
    });
  };

  const handleShare = (platform: string) => {
    const shareUrl = `${window.location.origin}/news/${newsId}`;
    const shareText = `Check out this article: ${title}`;

    let shareLink = '';

    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        addNotification({
          type: 'success',
          title: 'Link Copied',
          message: 'Link copied to clipboard!'
        });
        setShowShareOptions(false);
        return;
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
      setShowShareOptions(false);
    }
  };

  const handleReport = () => {
    if (!account) {
      addNotification({
        type: 'warning',
        title: 'Wallet Required',
        message: 'Please connect your wallet to report articles'
      });
      return;
    }

    addNotification({
      type: 'info',
      title: 'Article Reported',
      message: 'Article reported. Our team will review it shortly.'
    });
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-t border-gray-200">
      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          liked
            ? 'text-red-600 bg-red-50 hover:bg-red-100'
            : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
        }`}
      >
        <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
        <span className="text-sm font-medium">Like</span>
      </button>

      {/* Comment Button (Placeholder) */}
      <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Comment</span>
      </button>

      {/* Share Button */}
      <div className="relative">
        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        >
          <Share2 className="h-5 w-5" />
          <span className="text-sm font-medium">Share</span>
        </button>

        {showShareOptions && (
          <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-48 z-10">
            <button
              onClick={() => handleShare('twitter')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
            >
              Share on Twitter
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
            >
              Share on Facebook
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
            >
              Share on LinkedIn
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
            >
              Copy Link
            </button>
          </div>
        )}
      </div>

      {/* Bookmark Button */}
      <button
        onClick={handleBookmark}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          bookmarked
            ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
            : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
        }`}
      >
        <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
        <span className="text-sm font-medium">Bookmark</span>
      </button>

      {/* Report Button */}
      <button
        onClick={handleReport}
        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Flag className="h-5 w-5" />
        <span className="text-sm font-medium">Report</span>
      </button>
    </div>
  );
};

export default SocialFeatures;
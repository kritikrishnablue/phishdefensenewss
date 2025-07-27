import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { FaArrowLeft, FaBookmark, FaShare, FaGlobe, FaExternalLinkAlt, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export default function ArticlePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [shared, setShared] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);
  // Use article from location.state if available, otherwise fallback (could fetch by id here)
  const article = location.state?.article || {};

  const handleLike = () => setLiked((v) => !v);
  const handleDislike = () => setDisliked((v) => !v);
  const handleShare = () => setShared(true);
  const handleReadOriginal = () => window.open(article.url, '_blank');

  // Get image
  const imageUrl = article.urlToImage || article.image || '';

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-custom-gray hover:text-teal-400 mb-6 text-base font-medium"
      >
        <FaArrowLeft /> Back to News
      </button>

      {/* Article Image */}
      {imageUrl && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <img src={imageUrl} alt={article.title} className="w-full h-72 object-cover" />
        </div>
      )}

      {/* AI Summary */}
      <div className="bg-[#192132] rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-cyan-400 text-lg">⚡</span>
          <h3 className="text-white font-bold text-lg">AI Summary</h3>
        </div>
        <div className={`text-custom-gray text-base leading-relaxed ${showFullSummary ? '' : 'line-clamp-4'}`}>
          {article.summary || article.description || 'No summary available.'}
        </div>
        {((article.summary && article.summary.length > 200) || (article.description && article.description.length > 200)) && (
          <button
            className="mt-2 text-teal-400 hover:underline text-sm font-medium focus:outline-none"
            onClick={() => setShowFullSummary((v) => !v)}
          >
            {showFullSummary ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Actions Row */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <button
          onClick={handleReadOriginal}
          className="flex items-center gap-2 px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium text-base"
        >
          <FaGlobe /> <FaExternalLinkAlt /> Read Original Article
        </button>
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-base font-medium transition-colors ${liked ? 'bg-teal-500 text-white' : 'text-custom-gray hover:bg-gray-800'}`}
        >
          <FaThumbsUp /> Like
        </button>
        <button
          onClick={handleDislike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-base font-medium transition-colors ${disliked ? 'bg-pink-500 text-white' : 'text-custom-gray hover:bg-gray-800'}`}
        >
          <FaThumbsDown /> Dislike
        </button>
        <button
          onClick={handleShare}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-base font-medium transition-colors ${shared ? 'bg-cyan-500 text-white' : 'text-custom-gray hover:bg-gray-800'}`}
        >
          <FaShare /> Share
        </button>
      </div>
    </div>
  );
} 
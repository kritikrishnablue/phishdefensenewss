import { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import Filters from '../components/Filters';
import { newsAPI, locationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaFire, FaGlobe, FaNewspaper, FaRss, FaChartLine } from 'react-icons/fa';

export default function Home() {
  const [filters, setFilters] = useState({ 
    country: 'us', 
    category: '', 
    source: 'all', 
    q: '' 
  });
  const [articles, setArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('headlines');
  const { isAuthenticated } = useAuth();

  // Load user location on component mount
  useEffect(() => {
    loadUserLocation();
  }, []);

  // Load trending articles
  useEffect(() => {
    loadTrendingArticles();
  }, []);

  // Fetch news when filters change or auth state changes
  useEffect(() => {
    if (activeTab === 'headlines') {
      fetchNews();
    }
    // eslint-disable-next-line
  }, [filters, activeTab, isAuthenticated]);

  const loadUserLocation = async () => {
    try {
      const locationData = await locationAPI.getLocation();
      setUserLocation(locationData.location);
      // Auto-set country based on user location
      if (locationData.location?.country_code) {
        setFilters(prev => ({
          ...prev,
          country: locationData.location.country_code.toLowerCase()
        }));
      }
    } catch (error) {
      console.log('Could not detect user location');
    }
  };

  const loadTrendingArticles = async () => {
    setTrendingLoading(true);
    try {
      const data = await newsAPI.getTrending();
      setTrendingArticles(data.trending || []);
    } catch (error) {
      console.error('Failed to load trending articles:', error);
    } finally {
      setTrendingLoading(false);
    }
  };

  // Fetch personalized or general news
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (isAuthenticated) {
        data = await newsAPI.getPersonalized('all');
        setArticles(data.articles || []);
      } else {
        data = await newsAPI.getNews(filters);
        setArticles(data.articles || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'trending') {
      loadTrendingArticles();
    }
  };

  const trendingTopics = [
    'Tech Layoffs', 'Climate Change', 'Space Exploration', 
    'Cryptocurrency', 'Remote Work', 'Healthcare AI'
  ];

  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Trending Topics Bar */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaFire className="text-orange-500" />
            <span className="font-semibold text-white">Trending:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {trendingTopics.map((topic, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-slate-700 text-gray-300 rounded-full text-sm font-medium hover:bg-slate-600 transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Latest News
              </h1>
              <p className="text-gray-400">
                {articles.length} articles • AI-summarized for quick reading
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
              <p className="text-gray-400">Loading latest news...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center">
                  <span className="text-red-400 text-sm">⚠</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-200">Error Loading News</h3>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {!loading && !error && articles.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaNewspaper className="text-gray-400 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Articles Found</h3>
              <p className="text-gray-400">Try adjusting your filters or check back later.</p>
            </div>
          )}
          
          {!loading && !error && articles.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <div key={article.url || article.title} className={`fade-in stagger-${Math.min(index + 1, 6)}`}>
                  <NewsCard
                    article={article}
                    showStatus={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NewsCard from '../components/NewsCard';
import Filters from '../components/Filters';
import { newsAPI, locationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaFire, FaGlobe, FaNewspaper, FaRss, FaChartLine } from 'react-icons/fa';

export default function Home() {
  const { isDarkMode } = useTheme();
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

  // Handle category changes from sidebar
  useEffect(() => {
    const savedCategory = window.sessionStorage.getItem('selectedCategory');
    if (savedCategory) {
      setFilters(prev => ({ ...prev, category: savedCategory === 'all' ? '' : savedCategory }));
    }

    const handleCategoryChange = (event) => {
      const newCategory = event.detail;
      setFilters(prev => ({ ...prev, category: newCategory === 'all' ? '' : newCategory }));
    };

    window.addEventListener('categoryChanged', handleCategoryChange);
    return () => window.removeEventListener('categoryChanged', handleCategoryChange);
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

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: category
    }));
  };

  const trendingTopics = [
    'Tech Layoffs', 'Climate Change', 'Space Exploration', 
    'Cryptocurrency', 'Remote Work', 'Healthcare AI'
  ];

  return (
    <div className={`min-h-screen theme-transition ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Trending Topics Bar */}
      <motion.div 
        className={`border-b px-6 py-4 theme-transition ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaFire className="text-orange-500" />
            </motion.div>
            <span className={`font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Trending:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {trendingTopics.map((topic, index) => (
              <motion.button
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover-lift ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {topic}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="px-6 py-8">
        {/* Header Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {filters.category ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} News` : 'Latest News'}
              </h1>
              <p className={`${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {articles.length} articles • AI-summarized for quick reading
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                className="flex flex-col items-center justify-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Loading latest news...</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                className={`border rounded-xl p-6 ${
                  isDarkMode 
                    ? 'bg-red-900/20 border-red-800' 
                    : 'bg-red-50 border-red-200'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-red-900' : 'bg-red-100'
                }`}>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`}>⚠</span>
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    isDarkMode ? 'text-red-200' : 'text-red-800'
                  }`}>Error Loading News</h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-red-300' : 'text-red-700'
                  }`}>{error}</p>
                </div>
              </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {!loading && !error && articles.length === 0 && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <FaNewspaper className={`text-xl ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>No Articles Found</h3>
              <p className={`${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Try adjusting your filters or check back later.</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!loading && !error && articles.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {articles.map((article, index) => (
                <motion.div 
                  key={article.url || article.title} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <NewsCard
                    article={article}
                    showStatus={true}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
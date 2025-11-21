import React, { useState, useEffect, useMemo } from 'react';
import { YUKIO_LIST } from './constants';
import { YukioCard } from './components/YukioCard';
import { Heart, Filter, Sparkles, LayoutGrid } from 'lucide-react';

const STORAGE_KEY = 'yukio_owned_list_v2';

const App: React.FC = () => {
  // 1. STATE MANAGEMENT
  const [ownedIds, setOwnedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New filter states
  const [statusFilter, setStatusFilter] = useState<'all' | 'owned' | 'missing'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // 2. LOAD DATA
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setOwnedIds(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setIsLoading(false);
  }, []);

  // 3. SAVE DATA
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ownedIds));
    }
  }, [ownedIds, isLoading]);

  // 4. HANDLERS
  const toggleOwned = (id: string) => {
    setOwnedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 5. COMPUTED VALUES
  const totalItems = YUKIO_LIST.length;
  const ownedCount = ownedIds.length;
  const progressPercentage = Math.round((ownedCount / totalItems) * 100);

  // Get unique categories for the filter dropdown
  const categories = useMemo(() => {
    const cats = new Set(YUKIO_LIST.map(item => item.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, []);

  // Filter logic
  const filteredList = useMemo(() => {
    return YUKIO_LIST.filter(item => {
      // Status Filter
      const isOwned = ownedIds.includes(item.id);
      let matchesStatus = true;
      if (statusFilter === 'owned') matchesStatus = isOwned;
      if (statusFilter === 'missing') matchesStatus = !isOwned;

      // Category Filter
      let matchesCategory = true;
      if (categoryFilter !== 'all') matchesCategory = item.category === categoryFilter;

      return matchesStatus && matchesCategory;
    });
  }, [statusFilter, categoryFilter, ownedIds]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-yukio-dark font-bold animate-pulse">載入中...</div>;
  }

  return (
    <div className="min-h-screen pb-24">
      
      {/* HEADER SECTION */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-yukio-pink/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          
          {/* Top Bar: Logo */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-yukio-pink p-2 rounded-2xl shadow-sm rotate-0">
                <img
    src={`${import.meta.env.BASE_URL}yukio-icon.svg`}
    alt="Yukio Icon"
    className="w-6 h-6"
  />
              </div>
              <h1 className="text-2xl font-black text-yukio-text tracking-tight">
                YUKIO <span className="text-yukio-dark font-normal">收藏圖鑑</span>
              </h1>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-3 items-center justify-between bg-white p-3 rounded-2xl border border-yukio-bg shadow-sm">
             <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full md:w-auto">
                {/* Status Filters */}
                <button 
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${statusFilter === 'all' ? 'bg-yukio-text text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                >
                  全部
                </button>
                <button 
                  onClick={() => setStatusFilter('owned')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1 ${statusFilter === 'owned' ? 'bg-yukio-dark text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                >
                  <Heart className="w-3 h-3 fill-current" /> 已收藏
                </button>
                <button 
                  onClick={() => setStatusFilter('missing')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1 ${statusFilter === 'missing' ? 'bg-yukio-accent text-yukio-text shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                >
                   未收藏
                </button>
             </div>

             {/* Category Dropdown */}
             <div className="relative w-full md:w-auto min-w-[160px]">
               <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yukio-text/50 pointer-events-none" />
               <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full md:w-auto pl-9 pr-8 py-2 rounded-xl bg-yukio-bg text-yukio-text text-sm font-bold border border-transparent focus:border-yukio-dark focus:outline-none appearance-none cursor-pointer"
               >
                 <option value="all">所有系列</option>
                 {categories.map(cat => (
                   <option key={cat} value={cat}>{cat}</option>
                 ))}
               </select>
               <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-yukio-text/50">
                 ▼
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Progress Section */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm border border-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold text-yukio-text mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yukio-dark" />
              你嘅收藏進度
            </h2>
            <p className="text-yukio-text/60 text-sm">
              加油！仲有 <span className="font-bold text-yukio-dark">{totalItems - ownedCount}</span> 隻就儲齊啦！
            </p>
          </div>
          <div className="w-full md:w-1/2">
             <div className="flex justify-between text-xs font-bold text-yukio-text/50 mb-2">
               <span>{ownedCount} / {totalItems}</span>
               <span>{progressPercentage}%</span>
             </div>
             <div className="h-4 w-full bg-yukio-bg rounded-full overflow-hidden shadow-inner">
               <div 
                 className="h-full bg-gradient-to-r from-yukio-pink to-yukio-dark transition-all duration-1000 ease-out rounded-full relative"
                 style={{ width: `${progressPercentage}%` }}
               >
                 <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
               </div>
             </div>
          </div>
        </div>

        {/* Grid */}
        {filteredList.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white inline-flex p-6 rounded-full mb-4 shadow-sm">
              <Filter className="w-12 h-12 text-yukio-bg" />
            </div>
            <p className="text-yukio-text/60 font-medium">搵唔到符合條件嘅 Yukio 喎...</p>
            <button 
              onClick={() => {setStatusFilter('all'); setCategoryFilter('all');}}
              className="mt-4 text-yukio-dark font-bold hover:underline"
            >
              清除篩選
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredList.map((item) => (
              <YukioCard 
                key={item.id} 
                item={item} 
                isOwned={ownedIds.includes(item.id)} 
                onToggle={toggleOwned} 
              />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="text-center text-yukio-text/40 text-xs py-8 font-medium">
        <p>© {new Date().getFullYear()} 👽Y</p>
      </footer>
    </div>
  );
};

export default App;

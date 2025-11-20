import React from 'react';
import { YukioItem } from '../types';
import { Heart, Sparkles } from 'lucide-react';

interface YukioCardProps {
  item: YukioItem;
  isOwned: boolean;
  onToggle: (id: string) => void;
}

/**
 * YukioCard displays a single item.
 * Updated for a girlish, modern look without ID display.
 */
export const YukioCard: React.FC<YukioCardProps> = ({ item, isOwned, onToggle }) => {
  return (
    <div 
      onClick={() => onToggle(item.id)}
      className={`
        relative group cursor-pointer transition-all duration-300 ease-in-out
        rounded-3xl p-3 flex flex-col gap-3 border-2
        hover:shadow-xl hover:-translate-y-1
        ${isOwned 
          ? 'bg-white border-yukio-pink shadow-lg ring-2 ring-yukio-pink/20' 
          : 'bg-white/80 border-white hover:border-yukio-pink/50'
        }
      `}
    >
      {/* Image Placeholder */}
      <div className={`
        w-full aspect-square rounded-2xl overflow-hidden relative bg-gray-50
        transition-all duration-500
      `}>
        <img 
  src={item.imageUrl ?? `https://picsum.photos/seed/${item.id}/300/300`}
  alt={item.name}
  className="w-full h-full object-cover"
/>
        
        {/* Overlay badge when owned */}
        {isOwned && (
          <div className="absolute inset-0 bg-yukio-pink/10 flex items-center justify-center animate-in fade-in duration-300">
             <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-sm">
                <Heart className="w-8 h-8 text-yukio-dark fill-yukio-dark" />
             </div>
          </div>
        )}

        {/* Category Tag (Collection) overlay on image */}
        {item.category && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-white/90 text-yukio-text shadow-sm backdrop-blur-md">
              {item.category}
            </span>
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="text-center flex-grow flex flex-col justify-center">
        <h3 className={`font-bold text-lg leading-tight mb-1 ${isOwned ? 'text-yukio-text' : 'text-gray-400'}`}>
          {item.name}
        </h3>
      </div>

      {/* Interactive Toggle Button */}
      <button 
        className={`
          w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
          ${isOwned 
            ? 'bg-gradient-to-r from-yukio-pink to-yukio-dark text-white shadow-md shadow-yukio-pink/30' 
            : 'bg-gray-100 text-gray-400 hover:bg-yukio-bg hover:text-yukio-dark'
          }
        `}
      >
        {isOwned ? (
          <>
            <Sparkles className="w-4 h-4" />
            已收藏
          </>
        ) : (
          <>
            <span className="w-4 h-4 border-2 border-current rounded-full"></span>
            我有呢隻!
          </>
        )}
      </button>
    </div>
  );
};
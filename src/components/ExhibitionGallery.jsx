import React, { useState } from 'react';
import { Filter, Eye, Sparkles, Heart, Moon, Building2, Mail, PartyPopper, Gift } from 'lucide-react';
import { INVITATIONS_DATA } from '../data/invitations';

export default function ExhibitionGallery({ onNavigate = () => {} }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'همه نمونه‌ها', icon: Sparkles },
    { id: 'wedding', label: 'عروسی و عقد', icon: Heart },
    { id: 'memorial', label: 'ترحیم و یادبود', icon: Moon },
    { id: 'general', label: 'عمومی و گالری', icon: Building2 },
    { id: 'opening', label: 'افتتاحیه تجاری', icon: Mail },
    { id: 'festival', label: 'جشن‌ها و مناسبت‌ها', icon: PartyPopper },
    { id: 'birthday', label: 'تولد و جشن', icon: Gift },
  ];

  const cardsList = Object.values(INVITATIONS_DATA);

  const filteredCards = activeFilter === 'all'
    ? cardsList
    : cardsList.filter((card) => card.category === activeFilter);

  return (
    <section id="gallery" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/10 border border-amber-900/20 text-amber-900 text-xs font-vazir">
          <Filter className="w-3.5 h-3.5 text-amber-700" />
          نمایشگاه تعاملی نمونه کارت‌ها
        </div>
        <h2 className="text-3xl md:text-4xl font-bold font-estedad text-stone-900">
          گالری کامل دعوت‌نامه‌های دیجیتال
        </h2>
        <p className="text-stone-600 text-sm font-vazir">
          با فیلتر بر روی هر دسته‌بندی، کارت‌های اختصاصی مربوطه را به همراه تمامی جزئیات مشاهده فرمایید.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-vazir font-medium transition-all ${
                isActive
                  ? 'bg-amber-900 text-stone-100 shadow-md scale-105'
                  : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300/80 hover:text-stone-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-stone-500'}`} />
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCards.map((card) => {
          const isMemorial = card.category === 'memorial';
          return (
            <div
              key={card.slug}
              className="group bg-[#F6F1E9] rounded-2xl border border-stone-300 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between p-5"
            >
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <img
                  src={card.coverImage}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-vazir font-bold bg-stone-900/80 backdrop-blur text-stone-100">
                  {card.categoryTitle}
                </div>
              </div>

              <div className="space-y-2 text-right mb-6">
                <h3 className="text-xl font-bold font-estedad text-stone-900">
                  {card.title}
                </h3>
                <p className="text-xs font-vazir text-stone-600 line-clamp-2">
                  {card.subtitle}
                </p>
                <div className="pt-2 text-[11px] font-vazir text-stone-500">
                  📍 {card.venue}
                </div>
              </div>

              <button
                onClick={() => onNavigate(card.slug)}
                className="w-full py-2.5 rounded-xl font-vazir font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm group-hover:shadow-md"
                style={{
                  background: isMemorial
                    ? '#687567'
                    : 'linear-gradient(135deg, #B49A70 0%, #E6D5B8 100%)',
                  color: isMemorial ? '#FFF' : '#25231F'
                }}
              >
                <Eye className="w-4 h-4" />
                مشاهده آنلاین کارت ({card.title})
              </button>
            </div>
          );
        })}
      </div>

    </section>
  );
}

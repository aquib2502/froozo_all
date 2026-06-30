import React from 'react';
import { 
  Coffee, GlassWater, IceCream, Dessert, Pizza, Sandwich, 
  ChefHat, Salad, Soup, Cookie, LayoutGrid 
} from 'lucide-react';

const CategoryIcon = ({ name, className = "w-5 h-5", size }) => {
  const normName = (name || '').toLowerCase().trim();

  // Custom inline SVG icons for categories not covered well by default Lucide icons, 
  // or to make them look extra professional and tailored to Froozo.
  
  if (normName.includes('burger')) {
    // Premium Burger SVG
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6H3Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M21 11H3v2h18v-2ZM3 17h18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        <path d="M6 14h12c.5 0 .9.4.9.9v.2c0 .5-.4.9-.9.9H6c-.5 0-.9-.4-.9-.9v-.2c0-.5.4-.9.9-.9Z" fill="currentColor" />
      </svg>
    );
  }

  if (normName.includes('pizza')) {
    return <Pizza className={className} />;
  }

  if (normName.includes('sandwich')) {
    return <Sandwich className={className} />;
  }

  if (normName.includes('beverage') || normName.includes('coffee') || normName.includes('tea')) {
    return <Coffee className={className} />;
  }

  if (normName.includes('mocktail')) {
    return <GlassWater className={className} />;
  }

  if (normName.includes('shake') || normName.includes('ice cream')) {
    return <IceCream className={className} />;
  }

  if (normName.includes('waffle') || normName.includes('pancake')) {
    // Beautiful Custom Waffle SVG
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" fillOpacity="0.1" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    );
  }

  if (normName.includes('dessert')) {
    return <Dessert className={className} />;
  }

  if (normName.includes('wrap')) {
    // Custom Roll/Wrap SVG
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a8 8 0 0 0 8-8V7a4 4 0 0 0-8 0v15Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M12 22a8 8 0 0 0 8-8V7a4 4 0 0 0-8 0v15ZM4 7a4 4 0 0 1 8 0M8 2a5 5 0 0 0-4 5v7c0 2.5 1.5 4.5 4 4.9M12 11h8" />
      </svg>
    );
  }

  if (normName.includes('pasta')) {
    // Beautiful Noodle/Pasta bowl
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12A10 10 0 0 1 2 12h20Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M2 12h20c0 5.5-4.5 10-10 10S2 17.5 2 12ZM12 2v6M8 3v4M16 3v4" />
      </svg>
    );
  }

  if (normName.includes('fry') || normName.includes('fries')) {
    // Custom Fries SVG
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 10h14l-1.5 11h-11L5 10Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M5 10h14l-1.5 11h-11L5 10ZM8 2v8M12 2v8M16 2v8M6 5v5M18 5v5" />
      </svg>
    );
  }

  if (normName.includes('nachos') || normName.includes('cheese')) {
    return <Cookie className={className} />;
  }

  if (normName.includes('maggi') || normName.includes('momo') || normName.includes('noodle') || normName.includes('soup')) {
    return <Soup className={className} />;
  }

  if (normName.includes('starter') || normName.includes('bento')) {
    return <Salad className={className} />;
  }

  if (normName.includes('bread') || normName.includes('bun')) {
    // Sleek Loaf of Bread
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 13c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6v4H3v-4Z" fill="currentColor" fillOpacity="0.1" />
        <path d="M3 13c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6v4H3v-4ZM7 11c1-1.5 2-1.5 3 0M14 11c1-1.5 2-1.5 3 0" />
      </svg>
    );
  }

  if (normName.includes('nanza') || normName.includes('flatbread')) {
    // Sleek Flatbread/Nanza SVG
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="12" rx="10" ry="6" fill="currentColor" fillOpacity="0.1" />
        <ellipse cx="12" cy="12" rx="10" ry="6" />
        <path d="M8 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM16 14.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
      </svg>
    );
  }

  if (normName.includes('all')) {
    return <LayoutGrid className={className} />;
  }

  return <ChefHat className={className} />;
};

export default CategoryIcon;

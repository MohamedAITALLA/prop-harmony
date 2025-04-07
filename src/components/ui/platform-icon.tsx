
import React from 'react';
import { 
  Airbnb, 
  BookOpen, 
  Calendar, 
  ExternalLink, 
  Globe, 
  Home, 
  Hotel, 
  Map 
} from 'lucide-react';

interface PlatformIconProps {
  platform: string;
  size?: number;
  className?: string;
}

export function PlatformIcon({ platform, size = 16, className = '' }: PlatformIconProps) {
  const platformLower = platform.toLowerCase();
  
  switch (platformLower) {
    case 'airbnb':
      return <Airbnb size={size} className={`text-red-500 ${className}`} />;
    case 'booking':
    case 'booking.com':
      return <BookOpen size={size} className={`text-blue-500 ${className}`} />;
    case 'vrbo':
    case 'homeaway':
      return <Home size={size} className={`text-green-500 ${className}`} />;
    case 'expedia':
      return <Map size={size} className={`text-yellow-500 ${className}`} />;
    case 'tripadvisor':
      return <Globe size={size} className={`text-green-700 ${className}`} />;
    case 'google':
    case 'google_calendar':
      return <Calendar size={size} className={`text-blue-400 ${className}`} />;
    case 'ical':
    case 'ics':
      return <ExternalLink size={size} className={`text-gray-500 ${className}`} />;
    default:
      return <Hotel size={size} className={`text-gray-500 ${className}`} />;
  }
}

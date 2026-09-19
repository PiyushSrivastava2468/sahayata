import React from 'react';
import { Phone, Navigation, Share2, Clock, MapPin, User, Shield, HeartPulse, Sparkles, AlertTriangle } from 'lucide-react';
import { CampusResource, ResourceCategory } from '../types';

interface ResourceCardProps {
  resource: CampusResource;
  userCoords: { lat: number; long: number };
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, userCoords }) => {
  const getCategoryBadge = (cat: ResourceCategory) => {
    switch (cat) {
      case 'women_safety':
        return {
          label: "Women's Safety / ICC",
          color: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <Shield className="w-3.5 h-3.5 text-rose-600" />,
        };
      case 'security':
        return {
          label: 'Campus Security & QRT',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'medical':
        return {
          label: 'Medical & Health Desk',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'counseling':
        return {
          label: 'Student Wellness / Counseling',
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <Sparkles className="w-3.5 h-3.5 text-purple-600" />,
        };
      case 'admin':
      default:
        return {
          label: 'Campus Administration',
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <MapPin className="w-3.5 h-3.5 text-blue-600" />,
        };
    }
  };

  const badge = getCategoryBadge(resource.category);

  // Format distance
  const formatDistance = (meters?: number) => {
    if (meters === undefined) return null;
    if (meters < 1000) {
      const walkMinutes = Math.max(1, Math.round(meters / 75)); // ~75m/min walking speed
      return `${meters}m away • ~${walkMinutes} min walk`;
    }
    const km = (meters / 1000).toFixed(1);
    const driveMinutes = Math.max(2, Math.round((meters / 1000) * 3));
    return `${km} km away • ~${driveMinutes} min drive`;
  };

  const distanceText = formatDistance(resource.distance_meters);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.long}&destination=${resource.lat},${resource.long}`;

  const shareResourceWhatsApp = () => {
    const text = `📍 *Campus Safety Hub - ${resource.name}*\nCategory: ${badge.label}\nPhone: ${resource.phone}\nLocation: ${resource.address}\nDirections: ${googleMapsUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className={`flex flex-col justify-between rounded-xl bg-white border ${resource.is_emergency_hub ? 'border-rose-300 shadow-sm' : 'border-slate-200'} p-5 hover:border-slate-300 transition-all`}>
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </span>

          {distanceText && (
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Navigation className="w-3 h-3 text-slate-500" />
              <span>{distanceText}</span>
            </span>
          )}
        </div>

        {/* Resource Name */}
        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-1">
          {resource.name}
        </h4>

        {/* Address */}
        <p className="text-xs sm:text-sm text-slate-600 flex items-start gap-1.5 mb-2.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
          <span>{resource.address}</span>
        </p>

        {/* Details list */}
        <div className="space-y-1 text-xs text-slate-500 pb-3 border-b border-slate-100 mb-3">
          {resource.contact_person && (
            <p className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>In-charge: <strong className="text-slate-700 font-medium">{resource.contact_person}</strong></span>
            </p>
          )}
          <p className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Timings: <strong className="text-slate-700 font-medium">{resource.office_hours}</strong></span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {/* Call */}
        <a
          href={`tel:${resource.phone}`}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call</span>
        </a>

        {/* Navigate */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Navigate</span>
        </a>

        {/* Share */}
        <button
          onClick={shareResourceWhatsApp}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          title="Share contact details on WhatsApp"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { useFestival } from '@/lib/festival-context';
import { useAuth } from '@/lib/auth-context';
import { FestivalEvent } from '@/types';
import {
  CalendarDays,
  PlusCircle,
  Clock,
  MapPin,
  User,
  Sparkles,
  CheckCircle2,
  X,
  Share2,
} from 'lucide-react';

export function EventManager() {
  const { events, addEvent, organization, activeYear } = useFestival();
  const { canManageSettings, user } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('2026-09-14');
  const [time, setTime] = useState('08:30 AM');
  const [location, setLocation] = useState('Gandhi Chowk Pandal');
  const [description, setDescription] = useState('');
  const [organizerInCharge, setOrganizerInCharge] = useState(user?.name || 'Gadam ArunKumar');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) return;

    addEvent({
      eventName,
      date,
      time,
      location,
      description,
      organizerInCharge,
      isCompleted: false,
    });

    setIsAddModalOpen(false);
    setEventName('');
    setDescription('');
  };

  const getWhatsAppShareEvent = (evt: FestivalEvent) => {
    const text = `🙏 *శ్రీ గణేశాయ నమః | SRI GANESH FESTIVAL EVENT INVITATION* 🙏

✨ *${organization.name} (${activeYear})*
🎉 *Event:* ${evt.eventName}
🗓️ *Date:* ${evt.date}
⏰ *Time:* ${evt.time}
📍 *Venue:* ${evt.location}

📝 *Details:* ${evt.description}
👤 *Contact / Incharge:* ${evt.organizerInCharge || organization.organizerName}

_All devotees and colony residents are cordially invited to attend and receive blessings!_
_Powered by Ganesh Seva_`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Festival Program & Events Schedule</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Sthapana, Daily Pujas, Annadanam feasts, Cultural events, and Visarjan Shobhayatra
          </p>
        </div>

        {canManageSettings && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-amber-200" />
            <span>+ Add Festival Event</span>
          </button>
        )}
      </div>

      {/* Events Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((evt, idx) => (
          <div
            key={evt.id}
            className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-orange-100 text-orange-800 text-xs font-black flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="font-extrabold text-gray-900 text-base">{evt.eventName}</h3>
                </div>
                <a
                  href={getWhatsAppShareEvent(evt)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Share Event Invite on WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Invite</span>
                </a>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">{evt.description}</p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs text-gray-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-orange-600" />
                  <span>{evt.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{evt.time}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span className="truncate">{evt.location}</span>
                </div>
              </div>
            </div>

            {evt.organizerInCharge && (
              <div className="mt-4 pt-3 border-t border-dashed border-amber-200 flex items-center justify-between text-[11px] text-gray-500">
                <span>In-charge: <b className="text-gray-800">{evt.organizerInCharge}</b></span>
                <span className="inline-flex items-center gap-1 text-orange-700 font-bold">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Confirmed
                </span>
              </div>
            )}
          </div>
        ))}

        {events.length === 0 && (
          <div className="col-span-2 py-12 text-center text-gray-400 text-xs bg-white rounded-3xl border border-gray-200">
            No events scheduled yet. Click <b>+ Add Festival Event</b> to publish the festival itinerary.
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-amber-200" />
                <h3 className="font-extrabold text-base">Schedule Festival Event</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Event Name *</label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. Grand Annadanam, Laddu Auction, Bhajan Night"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="07:30 PM"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Venue / Location *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Gandhi Chowk Pandal"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Event Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details about program, food menu, chief guests..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Organizer In-Charge</label>
                <input
                  type="text"
                  value={organizerInCharge}
                  onChange={(e) => setOrganizerInCharge(e.target.value)}
                  placeholder="Name of volunteer / member"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-md"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

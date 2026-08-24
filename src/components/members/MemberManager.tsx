'use client';

import React, { useState } from 'react';
import { useFestival } from '@/lib/festival-context';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types';
import {
  Users,
  ShieldCheck,
  PlusCircle,
  Award,
  Phone,
  Mail,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

export function MemberManager() {
  const { members, addMember } = useFestival();
  const { canManageMembers, role } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [memberRole, setMemberRole] = useState<UserRole>('collector');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addMember({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      role: memberRole,
    });

    setIsAddModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'owner':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'admin':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'collector':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Committee Members & Role-Based Access</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage mandal organizers, street collection volunteers, and assigned security roles
          </p>
        </div>

        {canManageMembers && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl festival-saffron-gradient text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-amber-200" />
            <span>+ Add Member / Collector</span>
          </button>
        )}
      </div>

      {/* Permissions Matrix Overview */}
      <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs">
        <h3 className="font-extrabold text-gray-900 text-sm mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-orange-600" />
          Role Permission Security Rules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-red-50/70 rounded-2xl border border-red-200">
            <span className="font-bold text-red-900 block mb-1">👑 Owner</span>
            <p className="text-gray-600 text-[11px]">Full committee ownership, financial audits, settings, and member promotions.</p>
          </div>
          <div className="p-3 bg-orange-50/70 rounded-2xl border border-orange-200">
            <span className="font-bold text-orange-900 block mb-1">🛡️ Admin</span>
            <p className="text-gray-600 text-[11px]">Manage chanda collections, approve expenses, create festival events.</p>
          </div>
          <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200">
            <span className="font-bold text-blue-900 block mb-1">🤝 Collector</span>
            <p className="text-gray-600 text-[11px]">Rapid street entry, issue WhatsApp receipts. Restricted from settings.</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200">
            <span className="font-bold text-gray-900 block mb-1">👁️ Viewer</span>
            <p className="text-gray-600 text-[11px]">Read-only access to transparency board and event schedules.</p>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((mem) => (
          <div
            key={mem.id}
            className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{mem.name}</h3>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${getRoleBadge(
                      mem.role
                    )}`}
                  >
                    {mem.role}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                  {mem.name.slice(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="space-y-1.5 mt-4 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-mono">+91 {mem.phone}</span>
                </div>
                {mem.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{mem.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Collector Performance Stats */}
            <div className="mt-5 pt-3 border-t border-gray-100 bg-amber-50/50 -mx-5 -mb-5 p-4 rounded-b-3xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Funds Collected</span>
                <span className="font-extrabold text-orange-700 text-sm">
                  ₹{mem.totalCollected.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Receipts</span>
                <span className="font-bold text-gray-900">{mem.collectionCount} donors</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-200" />
                <h3 className="font-extrabold text-base">Add Committee Member</h3>
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
                <label className="block text-xs font-bold text-gray-700 mb-1">Member Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Santosh Yadav"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9848056789"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@ganeshseva.org"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Role *</label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="collector">🤝 Collector (Add Chanda, Rapid Entry)</option>
                  <option value="admin">🛡️ Admin (Manage collections & expenses)</option>
                  <option value="owner">👑 Owner (Full permissions)</option>
                  <option value="viewer">👁️ Viewer (Read only)</option>
                </select>
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
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

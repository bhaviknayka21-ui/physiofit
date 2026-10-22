import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Send,
  ExternalLink,
} from 'lucide-react';
import { CONSULTANT_CONTACT } from '../data/seedData';
import { useApp } from '../context/AppContext';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, showToast } = useApp();
  const [topic, setTopic] = useState<'pain' | 'workout' | 'nutrition' | 'general'>('pain');
  const [phoneInput, setPhoneInput] = useState('');
  const [preferredTime, setPreferredTime] = useState('morning');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Consultation request sent to the clinical team!');
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consult-modal-title"
    >
      <div className="relative w-full max-w-xl rounded-2xl bg-[#121720] border border-[#2a3444] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#232c3a] px-6 py-4 bg-[#161d28]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h2 id="consult-modal-title" className="text-lg font-bold text-white tracking-tight">
                Consultant & Admin Contact
              </h2>
              <p className="text-xs text-slate-400">
                Direct clinical support & personalized program advice
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-[#202936] transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Direct Contact Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Direct Phone Call */}
            <a
              href={`tel:${CONSULTANT_CONTACT.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-98 transition-all group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold group-hover:scale-105 transition-transform">
                <Phone className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                  Call Admin / Consultant
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {CONSULTANT_CONTACT.phone}
                </div>
                <div className="text-[10px] text-slate-400">Toll-free / Direct Line</div>
              </div>
            </a>

            {/* Direct WhatsApp Chat */}
            <a
              href={`https://wa.me/${CONSULTANT_CONTACT.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Hello PhysioFit Consultant, I would like guidance on my training program / pain management.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 active:scale-98 transition-all group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500 text-white font-bold group-hover:scale-105 transition-transform">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-green-300 uppercase tracking-wider">
                  WhatsApp Support
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {CONSULTANT_CONTACT.whatsapp}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>Chat directly</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </div>
              </div>
            </a>

            {/* Email Support */}
            <a
              href={`mailto:${CONSULTANT_CONTACT.email}?subject=PhysioFit%20Consultation%20Inquiry`}
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-98 transition-all group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 font-bold group-hover:scale-105 transition-transform">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider">
                  Consultant Email
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {CONSULTANT_CONTACT.email}
                </div>
                <div className="text-[10px] text-slate-400">Response within 2 hours</div>
              </div>
            </a>

            {/* Admin Desk Email */}
            <a
              href={`mailto:${CONSULTANT_CONTACT.adminEmail}?subject=PhysioFit%20Admin%20Inquiry`}
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-[#313c4c] bg-[#171f2b] hover:bg-[#1c2635] active:scale-98 transition-all group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-slate-100 font-bold group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  Admin Office Desk
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {CONSULTANT_CONTACT.adminEmail}
                </div>
                <div className="text-[10px] text-slate-400">Administrative inquiries</div>
              </div>
            </a>
          </div>

          {/* Operational Hours & Clinic Location */}
          <div className="p-4 rounded-xl bg-[#171e29] border border-[#273242] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Consulting Hours:</strong> {CONSULTANT_CONTACT.availableHours}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                <strong>Clinic Center:</strong> {CONSULTANT_CONTACT.clinicAddress}
              </span>
            </div>
          </div>

          {/* Instant Consultation Booking Form */}
          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <div className="flex justify-center text-emerald-400">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h4 className="text-base font-bold text-white">Consultation Request Received!</h4>
              <p className="text-xs text-slate-300">
                Our consultant will review your query and call you back on your registered phone
                number during your preferred time window.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-[#232c3a]">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <span>Request a Fast Callback from Consultant</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  What would you like to discuss?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'pain', label: 'Joint/Back Pain' },
                    { id: 'workout', label: 'Workout Form' },
                    { id: 'nutrition', label: 'Diet & Macros' },
                    { id: 'general', label: 'General Fitness' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTopic(t.id as any)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                        topic === t.id
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold'
                          : 'border-[#2d3747] bg-[#161d28] text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Your Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-[#2a3545] bg-[#141b25] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Preferred Callback Window
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full rounded-xl border border-[#2a3545] bg-[#141b25] px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="morning">Morning (9:00 AM – 12:00 PM)</option>
                    <option value="afternoon">Afternoon (1:00 PM – 4:00 PM)</option>
                    <option value="evening">Evening (5:00 PM – 8:00 PM)</option>
                    <option value="immediate">Immediate / Urgent Call</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Brief description of symptoms or question (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Lower back tightness during squats for 2 weeks..."
                  className="w-full rounded-xl border border-[#2a3545] bg-[#141b25] px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 active:scale-98 transition-all shadow-md shadow-emerald-500/20"
              >
                <Send className="h-4 w-4" />
                <span>Submit Consultation Request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

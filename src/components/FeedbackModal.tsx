import React, { useState } from 'react';
import { X, MessageSquare, Send, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdminFeedback } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { submitFeedback } = useApp();

  const [category, setCategory] = useState<AdminFeedback['category']>('general_feedback');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    submitFeedback(subject.trim(), message.trim(), category);
    setSubject('');
    setMessage('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-[#131821] border border-[#283241] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#242c38] pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Contact Clinical Team & Support</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white border border-[#2b3544]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AdminFeedback['category'])}
              className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="general_feedback">General Feedback & Experience</option>
              <option value="exercise_request">Request New Exercise or Mobility Routine</option>
              <option value="issue">Report a Technical Bug or Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Subject *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Request for Kettlebell Turkish Get-Up"
              className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Message & Clinical Notes *
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your suggestions or details..."
              className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#242c38]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#2d3848] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit to Admin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

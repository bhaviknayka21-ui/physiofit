import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Award,
  Download,
  Flame,
  Dumbbell,
  Ruler,
  CheckCircle2,
  X,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProgressMetric } from '../types';

export const ProgressView: React.FC = () => {
  const {
    currentUser,
    progressMetrics,
    addProgressMetric,
    updateProgressMetric,
    deleteProgressMetric,
    workoutLogs,
    personalRecords,
    badges,
    streak,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'weight' | 'measurements' | 'badges'>('weight');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [metricDate, setMetricDate] = useState(new Date().toISOString().split('T')[0]);
  const [metricWeight, setMetricWeight] = useState<number>(currentUser?.weightKg || 74);
  const [metricChest, setMetricChest] = useState<number | undefined>(undefined);
  const [metricWaist, setMetricWaist] = useState<number | undefined>(undefined);
  const [metricHips, setMetricHips] = useState<number | undefined>(undefined);
  const [metricArms, setMetricArms] = useState<number | undefined>(undefined);
  const [metricThighs, setMetricThighs] = useState<number | undefined>(undefined);
  const [metricNotes, setMetricNotes] = useState('');

  // Weight Trend Chart Data
  const sortedMetrics = [...progressMetrics].sort((a, b) => a.date.localeCompare(b.date));
  const weights = sortedMetrics.map((m) => m.weightKg);
  const minWeight = weights.length > 0 ? Math.floor(Math.min(...weights) - 1) : 60;
  const maxWeight = weights.length > 0 ? Math.ceil(Math.max(...weights) + 1) : 85;

  const handleOpenAdd = () => {
    setEditingId(null);
    setMetricDate(new Date().toISOString().split('T')[0]);
    setMetricWeight(currentUser?.weightKg || 74);
    setMetricChest(undefined);
    setMetricWaist(undefined);
    setMetricHips(undefined);
    setMetricArms(undefined);
    setMetricThighs(undefined);
    setMetricNotes('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (metric: ProgressMetric) => {
    setEditingId(metric.id);
    setMetricDate(metric.date);
    setMetricWeight(metric.weightKg);
    setMetricChest(metric.chestCm);
    setMetricWaist(metric.waistCm);
    setMetricHips(metric.hipsCm);
    setMetricArms(metric.armsCm);
    setMetricThighs(metric.thighsCm);
    setMetricNotes(metric.notes || '');
    setShowAddModal(true);
  };

  const handleSaveMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricWeight || metricWeight <= 0) {
      showToast('Please enter a valid weight in kg');
      return;
    }

    if (editingId) {
      updateProgressMetric(editingId, {
        date: metricDate,
        weightKg: Number(metricWeight),
        chestCm: metricChest ? Number(metricChest) : undefined,
        waistCm: metricWaist ? Number(metricWaist) : undefined,
        hipsCm: metricHips ? Number(metricHips) : undefined,
        armsCm: metricArms ? Number(metricArms) : undefined,
        thighsCm: metricThighs ? Number(metricThighs) : undefined,
        notes: metricNotes.trim() || undefined,
      });
    } else {
      addProgressMetric({
        date: metricDate,
        weightKg: Number(metricWeight),
        chestCm: metricChest ? Number(metricChest) : undefined,
        waistCm: metricWaist ? Number(metricWaist) : undefined,
        hipsCm: metricHips ? Number(metricHips) : undefined,
        armsCm: metricArms ? Number(metricArms) : undefined,
        thighsCm: metricThighs ? Number(metricThighs) : undefined,
        notes: metricNotes.trim() || undefined,
      });
    }

    setShowAddModal(false);
  };

  // Downloadable Progress Report
  const handleDownloadReport = () => {
    const reportData = {
      app: 'PhysioFit — Train Smart. Move Better.',
      generatedDate: new Date().toISOString(),
      athlete: {
        name: currentUser?.name || 'Athlete',
        email: currentUser?.email || 'N/A',
        fitnessGoal: currentUser?.fitnessGoal || 'General Fitness',
        experience: currentUser?.fitnessExperience || 'Beginner',
        currentWeightKg: currentUser?.weightKg || 74,
      },
      summary: {
        totalWorkoutsCompleted: workoutLogs.length,
        activeStreakDays: streak,
        personalRecordsCount: personalRecords.length,
        badgesUnlocked: badges.filter((b) => b.isUnlocked).length,
      },
      bodyWeightHistory: progressMetrics.map((m) => ({
        date: m.date,
        weightKg: m.weightKg,
        chestCm: m.chestCm,
        waistCm: m.waistCm,
        armsCm: m.armsCm,
        notes: m.notes,
      })),
      personalRecords: personalRecords.map((pr) => ({
        exercise: pr.exerciseName,
        weightKg: pr.weightKg,
        reps: pr.reps,
        estimated1RM: pr.estimated1RM,
        date: pr.date,
      })),
      completedWorkouts: workoutLogs.map((log) => ({
        date: log.date,
        program: log.programName,
        durationMin: log.durationMinutes,
        volumeKg: log.volumeKg,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PhysioFit_Progress_Report_${currentUser?.name.replace(/\s+/g, '_') || 'Athlete'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Progress report downloaded successfully!');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header and Download Report */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232b36] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Fitness & Body Progress
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Track weight trends, body circumference measurements, strength records, and milestone badges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 rounded-xl border border-[#2e3745] bg-[#161c24] px-4 py-2 text-xs font-bold text-slate-200 hover:text-white hover:border-emerald-500/40 transition-colors"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            <span>Export Progress Report</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/15"
          >
            <Plus className="h-4 w-4" />
            <span>Log Metric</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#222a36] pb-1 overflow-x-auto">
        {[
          { id: 'weight', label: 'Weight Trend & History' },
          { id: 'measurements', label: 'Body Measurements' },
          { id: 'badges', label: `Milestones & Badges (${badges.filter((b) => b.isUnlocked).length}/${badges.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-[#1a212b]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: WEIGHT TREND & HISTORY */}
      {activeTab === 'weight' && (
        <div className="space-y-6">
          {/* Interactive SVG Weight Trend Chart */}
          <div className="rounded-2xl bg-[#141a22] p-5 border border-[#252f3d] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Weight Progression Curve
                </span>
                <h3 className="text-lg font-bold text-white">Body Weight Over Time</h3>
              </div>
              <span className="text-xs text-slate-400 tabular-nums">
                {sortedMetrics.length} data points recorded
              </span>
            </div>

            {sortedMetrics.length > 1 ? (
              <div className="relative h-60 w-full pt-2">
                <svg
                  className="h-full w-full"
                  viewBox="0 0 800 180"
                >
                  {/* Subtle Grid Lines */}
                  {[30, 80, 130].map((y, idx) => (
                    <line
                      key={idx}
                      x1="40"
                      y1={y}
                      x2="760"
                      y2={y}
                      stroke="#222b37"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  ))}

                  {/* SVG Line path */}
                  {(() => {
                    const paddingLeft = 50;
                    const paddingRight = 750;
                    const usableWidth = paddingRight - paddingLeft;
                    const stepX = usableWidth / (sortedMetrics.length - 1 || 1);
                    const points = sortedMetrics.map((m, idx) => {
                      const x = paddingLeft + idx * stepX;
                      const normY =
                        (m.weightKg - minWeight) / (maxWeight - minWeight || 1);
                      const y = 140 - normY * 100;
                      return { x, y, weight: m.weightKg, date: m.date };
                    });

                    const pathString = points
                      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                      .join(' ');

                    return (
                      <>
                        <path
                          d={pathString}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {points.map((p, idx) => (
                          <g key={idx}>
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r="5"
                              fill="#10b981"
                              stroke="#0d1117"
                              strokeWidth="2.5"
                            />
                            <text
                              x={p.x}
                              y={p.y - 12}
                              textAnchor="middle"
                              fill="#f0f6fc"
                              fontSize="12"
                              fontWeight="700"
                              fontFamily="Plus Jakarta Sans, sans-serif"
                            >
                              {p.weight} kg
                            </text>
                            <text
                              x={p.x}
                              y={165}
                              textAnchor="middle"
                              fill="#94a3b8"
                              fontSize="11"
                              fontWeight="500"
                              fontFamily="Plus Jakarta Sans, sans-serif"
                            >
                              {p.date.slice(5)}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Log at least 2 weight entries to render the progress line chart.
              </div>
            )}
          </div>

          {/* Historical Weight Entries Table */}
          <div className="rounded-2xl bg-[#141a22] border border-[#252f3d] overflow-hidden">
            <div className="p-4 bg-[#161c25] border-b border-[#232b36] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Logged Weight Entries</h3>
              <span className="text-xs text-slate-400">
                Edit or delete past entries at any time
              </span>
            </div>

            <div className="divide-y divide-[#202733]">
              {progressMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="p-4 flex items-center justify-between gap-4 text-xs text-slate-200 hover:bg-[#161e28] transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-base tabular-nums">
                        {metric.weightKg} kg
                      </span>
                      <span className="text-slate-400">({metric.date})</span>
                    </div>
                    {metric.notes && (
                      <p className="text-[11px] text-slate-400 italic">"{metric.notes}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(metric)}
                      className="rounded-lg p-2 text-slate-400 hover:text-white border border-[#2b3544] hover:bg-[#202936] transition-colors"
                      aria-label="Edit entry"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteProgressMetric(metric.id)}
                      className="rounded-lg p-2 text-slate-400 hover:text-rose-400 border border-[#2b3544] hover:bg-rose-500/10 transition-colors"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BODY MEASUREMENTS */}
      {activeTab === 'measurements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progressMetrics
              .filter((m) => m.chestCm || m.waistCm || m.hipsCm || m.armsCm)
              .map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-2xl bg-[#141a22] p-5 border border-[#252f3d] space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#232b36] pb-2 text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                      {metric.date}
                    </span>
                    <span className="text-slate-400 font-semibold">{metric.weightKg} kg</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {metric.chestCm && (
                      <div className="p-2 rounded-lg bg-[#171e27] border border-[#252f3d]">
                        <span className="text-slate-400">Chest:</span>
                        <div className="font-bold text-white tabular-nums">{metric.chestCm} cm</div>
                      </div>
                    )}
                    {metric.waistCm && (
                      <div className="p-2 rounded-lg bg-[#171e27] border border-[#252f3d]">
                        <span className="text-slate-400">Waist:</span>
                        <div className="font-bold text-white tabular-nums">{metric.waistCm} cm</div>
                      </div>
                    )}
                    {metric.hipsCm && (
                      <div className="p-2 rounded-lg bg-[#171e27] border border-[#252f3d]">
                        <span className="text-slate-400">Hips:</span>
                        <div className="font-bold text-white tabular-nums">{metric.hipsCm} cm</div>
                      </div>
                    )}
                    {metric.armsCm && (
                      <div className="p-2 rounded-lg bg-[#171e27] border border-[#252f3d]">
                        <span className="text-slate-400">Arms:</span>
                        <div className="font-bold text-white tabular-nums">{metric.armsCm} cm</div>
                      </div>
                    )}
                  </div>

                  {metric.notes && (
                    <div className="text-[11px] text-slate-300 italic">"{metric.notes}"</div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: MILESTONES & BADGES */}
      {activeTab === 'badges' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-2xl p-5 border transition-all flex items-start gap-4 ${
                  badge.isUnlocked
                    ? 'bg-[#141a22] border-emerald-500/40 shadow-sm'
                    : 'bg-[#12151b] border-[#222a36] opacity-60'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border shrink-0 ${
                    badge.isUnlocked
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-[#1a212b] text-slate-500 border-[#283241]'
                  }`}
                >
                  <Award className="h-6 w-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{badge.title}</h3>
                    {badge.isUnlocked && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {badge.description}
                  </p>
                  {badge.unlockedAt && (
                    <div className="text-[10px] text-emerald-400 font-semibold pt-1">
                      Unlocked on {badge.unlockedAt.slice(0, 10)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Metric Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-[#131821] border border-[#283241] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#242c38] pb-3">
              <h2 className="text-base font-bold text-white">
                {editingId ? 'Edit Measurement Entry' : 'Log Body Weight & Measurements'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white border border-[#2b3544]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMetric} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Entry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={metricDate}
                    onChange={(e) => setMetricDate(e.target.value)}
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="250"
                    required
                    value={metricWeight}
                    onChange={(e) => setMetricWeight(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              {/* Optional Body Circumferences */}
              <div className="pt-2 border-t border-[#232b36]">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Optional Body Measurements (cm)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Chest</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 100"
                      value={metricChest || ''}
                      onChange={(e) =>
                        setMetricChest(e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-2.5 py-1.5 text-xs text-white tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Waist</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 82"
                      value={metricWaist || ''}
                      onChange={(e) =>
                        setMetricWaist(e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-2.5 py-1.5 text-xs text-white tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Hips</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 96"
                      value={metricHips || ''}
                      onChange={(e) =>
                        setMetricHips(e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-2.5 py-1.5 text-xs text-white tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Arms</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 35"
                      value={metricArms || ''}
                      onChange={(e) =>
                        setMetricArms(e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-2.5 py-1.5 text-xs text-white tabular-nums"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Journal / Progress Notes
                </label>
                <input
                  type="text"
                  value={metricNotes}
                  onChange={(e) => setMetricNotes(e.target.value)}
                  placeholder="e.g. Feeling lighter, sleep has been great"
                  className="w-full rounded-xl border border-[#283241] bg-[#161d26] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#242c38]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-[#2d3848] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

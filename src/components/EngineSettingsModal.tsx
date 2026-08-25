import React from 'react';
import { useApp } from '../context/AppContext';
import { PRESET_WEIGHTS, DEFAULT_WEIGHTS } from '../engine/matching';
import { AlgorithmWeights } from '../types';
import { X, Sliders, RotateCcw, Check } from 'lucide-react';

export const EngineSettingsModal: React.FC = () => {
  const { engineModalOpen, setEngineModalOpen, algorithmWeights, setAlgorithmWeights } = useApp();

  if (!engineModalOpen) return null;

  const handlePreset = (presetKey: string) => {
    if (PRESET_WEIGHTS[presetKey]) {
      setAlgorithmWeights(PRESET_WEIGHTS[presetKey].weights);
    }
  };

  const handleSliderChange = (key: keyof AlgorithmWeights, val: number) => {
    // Normalize weights
    const newWeight = val / 100;
    const remaining = 1 - newWeight;
    const currentOthers = (1 - algorithmWeights[key]) || 0.01;

    const updated: AlgorithmWeights = { ...algorithmWeights };
    updated[key] = newWeight;

    // Distribute remaining proportionally to other 3 keys
    (Object.keys(algorithmWeights) as (keyof AlgorithmWeights)[]).forEach((k) => {
      if (k !== key) {
        const ratio = algorithmWeights[k] / currentOthers;
        updated[k] = Math.max(0.05, Math.round(remaining * ratio * 100) / 100);
      }
    });

    setAlgorithmWeights(updated);
  };

  const handleReset = () => {
    setAlgorithmWeights(DEFAULT_WEIGHTS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-[#FFFFFF] dark:bg-[#121216] rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#1A1A1A]/15 dark:border-white/[0.1] space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1A1A1A]/10 dark:border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] border border-[#1A1A1A]/15 dark:border-white/[0.08] text-[#8C7355] dark:text-[#C8A578]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C7355] dark:text-[#C8A578] font-bold">
                Compatibility Engine
              </span>
              <h3 className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                Vector Weight Distribution
              </h3>
            </div>
          </div>

          <button
            onClick={() => setEngineModalOpen(false)}
            className="p-1.5 rounded-lg bg-[#FAF8F5] dark:bg-[#18181F] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.08] text-[#767064] dark:text-[#9E9EA8] hover:text-[#1A1A1A] dark:hover:text-white border border-[#1A1A1A]/10 dark:border-white/[0.08]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explainability note */}
        <p className="text-xs text-[#4A463E] dark:text-[#B8B8C2] leading-relaxed font-sans">
          The ProjectMatch compatibility signal is generated through transparent, weighted multi-vector scoring. Adjust these parameters to calibrate how the engine prioritizes skills overlap versus bandwidth and experience.
        </p>

        {/* Presets */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-[#767064] dark:text-[#82828F] font-bold">
            Calibrated Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(PRESET_WEIGHTS).map(([key, preset]) => {
              const isSelected =
                Math.abs(algorithmWeights.skills - preset.weights.skills) < 0.02 &&
                Math.abs(algorithmWeights.availability - preset.weights.availability) < 0.02;

              return (
                <button
                  key={key}
                  onClick={() => handlePreset(key)}
                  className={`p-3 rounded-lg text-left border transition-all ${
                    isSelected
                      ? 'bg-[#F2ECE1] dark:bg-[#C8A578]/15 border-[#8C7355] dark:border-[#C8A578] text-[#1A1A1A] dark:text-[#F3F3F5] shadow-sm'
                      : 'bg-[#FAF8F5] dark:bg-[#18181F] border-[#1A1A1A]/10 dark:border-white/[0.08] hover:bg-[#EFE8DC] dark:hover:bg-white/[0.06] text-[#38352F] dark:text-[#D4D4D8]'
                  }`}
                >
                  <div className="text-xs font-bold font-mono text-[#1A1A1A] dark:text-[#F3F3F5] flex items-center justify-between">
                    <span>{preset.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#8C7355] dark:text-[#C8A578]" />}
                  </div>
                  <div className="text-[10px] text-[#767064] dark:text-[#82828F] mt-0.5 leading-tight font-sans">
                    {preset.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Vector Sliders */}
        <div className="space-y-4 pt-2">
          {/* Skills Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#38352F] dark:text-[#D4D4D8] font-semibold">Skills Overlap & Proficiency</span>
              <span className="font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                {Math.round(algorithmWeights.skills * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={70}
              value={Math.round(algorithmWeights.skills * 100)}
              onChange={(e) => handleSliderChange('skills', Number(e.target.value))}
              className="w-full accent-[#8C7355] dark:accent-[#C8A578] cursor-pointer"
            />
          </div>

          {/* Availability Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#38352F] dark:text-[#D4D4D8] font-semibold">Weekly Availability Overlap</span>
              <span className="font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                {Math.round(algorithmWeights.availability * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              value={Math.round(algorithmWeights.availability * 100)}
              onChange={(e) => handleSliderChange('availability', Number(e.target.value))}
              className="w-full accent-[#8C7355] dark:accent-[#C8A578] cursor-pointer"
            />
          </div>

          {/* Interests Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#38352F] dark:text-[#D4D4D8] font-semibold">Domain & Mission Interests</span>
              <span className="font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                {Math.round(algorithmWeights.interests * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              value={Math.round(algorithmWeights.interests * 100)}
              onChange={(e) => handleSliderChange('interests', Number(e.target.value))}
              className="w-full accent-[#8C7355] dark:accent-[#C8A578] cursor-pointer"
            />
          </div>

          {/* Experience Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#38352F] dark:text-[#D4D4D8] font-semibold">Seniority & Experience Alignment</span>
              <span className="font-bold text-[#1A1A1A] dark:text-[#F3F3F5]">
                {Math.round(algorithmWeights.experience * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              value={Math.round(algorithmWeights.experience * 100)}
              onChange={(e) => handleSliderChange('experience', Number(e.target.value))}
              className="w-full accent-[#8C7355] dark:accent-[#C8A578] cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#1A1A1A]/10 dark:border-white/[0.08] pt-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-mono text-[#767064] dark:text-[#82828F] hover:text-[#1A1A1A] dark:hover:text-[#F3F3F5] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (45/20/20/15)</span>
          </button>

          <button
            onClick={() => setEngineModalOpen(false)}
            className="btn-shimmer btn-primary-action px-5 py-2 rounded-lg text-xs font-serif font-semibold text-[#F9F7F2] dark:text-[#0A0A0C] bg-[#1A1A1A] dark:bg-[#F3F3F5] hover:bg-[#8C7355] dark:hover:bg-[#C8A578] shadow-sm transition-all"
          >
            Apply Vector Weights
          </button>
        </div>
      </div>
    </div>
  );
};

'use client';
import { useMemo, useState } from 'react';
import type { Playbook, ROIInput } from '@/lib/types';
import { evalROI, formatROIValue } from '@/lib/playbook-helpers';

function initialState(inputs: ROIInput[]): Record<string, number> {
  const s: Record<string, number> = {};
  for (const i of inputs) {
    s[i.id] = typeof i.default === 'number' ? i.default : Number(i.default) || 0;
  }
  return s;
}

export function ROICalculator({ playbook }: { playbook: Playbook }) {
  const roi = playbook.roi;
  const [values, setValues] = useState<Record<string, number>>(
    () => (roi ? initialState(roi.inputs) : {})
  );

  const outputs = useMemo(() => {
    if (!roi) return {} as Record<string, number>;
    return evalROI(roi, values);
  }, [roi, values]);

  if (!roi) return null;

  return (
    <section className="px-6 md:px-10 py-16 border-b border-rule">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-mono text-xs uppercase tracking-caps text-amber mb-8">
          The Math · ROI Calculator
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-rule">
          {/* Inputs */}
          <div className="bg-canvas-2 p-6 md:p-10 flex flex-col gap-6">
            <h3 className="font-mono text-[10px] uppercase tracking-caps text-ink-mute">
              Inputs
            </h3>
            <div className="flex flex-col gap-5">
              {roi.inputs.map((inp) => (
                <label key={inp.id} className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-caps text-ink">
                    {inp.label}
                  </span>
                  {inp.type === 'select' && inp.options ? (
                    <select
                      value={String(values[inp.id] ?? inp.default)}
                      onChange={(e) =>
                        setValues((v) => ({
                          ...v,
                          [inp.id]: Number(e.target.value) || 0,
                        }))
                      }
                      className="bg-canvas border border-rule rounded-sm px-3 py-2 font-mono text-sm text-ink focus:outline-none focus:border-amber"
                    >
                      {inp.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={Number.isFinite(values[inp.id]) ? values[inp.id] : 0}
                      onChange={(e) =>
                        setValues((v) => ({
                          ...v,
                          [inp.id]: Number(e.target.value) || 0,
                        }))
                      }
                      className="bg-canvas border border-rule rounded-sm px-3 py-2 font-mono text-sm text-ink focus:outline-none focus:border-amber"
                    />
                  )}
                </label>
              ))}
            </div>
          </div>
          {/* Outputs */}
          <div className="bg-canvas-2 p-6 md:p-10 flex flex-col gap-6">
            <h3 className="font-mono text-[10px] uppercase tracking-caps text-ink-mute">
              Outputs
            </h3>
            <div className="flex flex-col gap-8">
              {roi.outputs.map((out, i) => {
                const value = outputs[out.id] ?? 0;
                const isPrimary = i === 0;
                return (
                  <div key={out.id} className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-caps text-ink-mute">
                      {out.label}
                    </span>
                    <span
                      className={`font-display leading-none transition-all duration-300 ease-out ${
                        isPrimary
                          ? 'text-5xl md:text-7xl text-amber'
                          : 'text-3xl md:text-4xl text-ink'
                      }`}
                    >
                      {formatROIValue(value, out.format)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

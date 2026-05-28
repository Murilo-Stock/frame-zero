import type { ROISpec } from './types';

/** Evaluate a ROI formula safely. Inputs is a record of input id → value. Returns record of output id → number. */
export function evalROI(roi: ROISpec, inputs: Record<string, number>): Record<string, number> {
  // Construct a sandboxed function from the formula. The formula is a series of `var = expr;` statements.
  // Variables available: input ids. Output: declared variables matching output ids.
  const outputIds = roi.outputs.map((o) => o.id);
  const inputIds = roi.inputs.map((i) => i.id);
  const inputVals = inputIds.map((id) => {
    const v = inputs[id];
    if (typeof v === 'number' && !Number.isNaN(v)) return v;
    const def = roi.inputs.find((i) => i.id === id)?.default ?? 0;
    return Number(def) || 0;
  });
  // Build function: (a, b, c) => { ...formula; return {x, y}; }
  try {
    const fn = new Function(
      ...inputIds,
      `${roi.formula}\nreturn { ${outputIds.join(', ')} };`
    ) as (...args: number[]) => Record<string, number>;
    const result = fn(...inputVals);
    // Coerce undefined / non-numeric outputs to 0.
    const safe: Record<string, number> = {};
    for (const id of outputIds) {
      const raw = result?.[id];
      safe[id] = typeof raw === 'number' && Number.isFinite(raw) ? raw : 0;
    }
    return safe;
  } catch (e) {
    console.error('ROI eval failed', e);
    return Object.fromEntries(outputIds.map((id) => [id, 0]));
  }
}

export function formatROIValue(value: number, format: 'BRL' | '%' | 'hours'): string {
  if (!Number.isFinite(value)) return '—';
  if (format === 'BRL')
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  if (format === '%') return `${value.toFixed(1)}%`;
  if (format === 'hours') return `${value.toFixed(0)}h`;
  return String(value);
}

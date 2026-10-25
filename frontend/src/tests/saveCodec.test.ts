import { describe, expect, it } from 'vitest';
import { compress, decompress } from '@/shared/utils/saveCodec';

describe('save compression', () => {
  it('round-trips game-like JSON, including non-ASCII text', () => {
    const data = { state: { name: 'Ñora Dela Cruz', peso: '₱1.2T', ledger: Array.from({ length: 500 }, (_, i) => ({ id: i, label: `Spending ${i % 7}` })) } };
    const json = JSON.stringify(data);
    const packed = compress(json);
    expect(packed.startsWith('LZ1:')).toBe(true);
    expect(packed.length).toBeLessThan(json.length / 2);
    expect(decompress(packed)).toBe(json);
  });

  it('reads old uncompressed saves unchanged', () => {
    expect(decompress('{"state":{}}')).toBe('{"state":{}}');
  });

  it('handles empty input', () => {
    expect(decompress(compress(''))).toBe('');
  });
});

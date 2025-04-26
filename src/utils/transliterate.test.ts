import { transliterate } from './transliterate';
import * as transliterateModule from './transliterate';

jest.mock('./transliterate', () => {
  const originalModule = jest.requireActual('./transliterate');
  return {
    __esModule: true,
    ...originalModule,
    isEgyptianOrigin: jest.fn()
  };
});

describe('transliterate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should transliterate a simple word without special rules', async () => {
    const [output, rules] = await transliterate('ⲁⲃⲅ');
    expect(output).toBe('abgh'); //ⲁ = a, ⲃ = b (ⲅ is consonant), ⲅ = gh
    expect(rules).toHaveLength(2);
    expect(rules[0].rule).toMatch(/'b'/); //Veeta followed by consonant
    expect(rules[1].rule).toMatch(/'gh'/); //Ghamma default
  });

  it('should apply vowel context rule to ⲃ (Veeta)', async () => {
    const [output, rules] = await transliterate('ⲃⲓ');
    expect(output).toBe('vy'); //ⲃ = v (ⲓ is ee-vowel), ⲓ = y
    expect(rules[0].rule).toMatch(/'v'/); //rule for Veeta
  });

  it('should apply consonant context rule to ⲃ (Veeta)', async () => {
    const [output, rules] = await transliterate('ⲃⲛ');
    expect(output).toBe('bn');
    expect(rules[0].rule).toMatch(/'b'/);
  });

  it('should apply ghamma rule when followed by ⲉ', async () => {
    const [output, rules] = await transliterate('ⲅⲉ');
    expect(output).toBe('ge');
    expect(rules[0].rule).toMatch(/'g'/);
  });

  it('should apply ghamma rule when followed by ⲕ', async () => {
    const [output, rules] = await transliterate('ⲅⲕ');
    expect(output).toBe('nk');
    expect(rules[0].rule).toMatch(/'n'/);
  });

  it('should use default "gh" for ⲅ when no condition matches', async () => {
    const [output, rules] = await transliterate('ⲅⲁ');
    expect(output).toBe('gha');
    expect(rules[0].rule).toMatch(/'gh'/);
  });

  it('should transliterate a simple word without special rules', async () => {
    const [output, rules] = await transliterate('ⲁⲃⲅ');
    expect(output).toBe('abgh'); //ⲃ=b (ⲅ is consonant)
    expect(rules[0].rule).toMatch(/'b'/);
    expect(rules[1].rule).toMatch(/'gh'/);
  });

  it('should apply vowel context rule to ⲃ (Veeta)', async () => {
    const [output, rules] = await transliterate('ⲃⲓ');
    expect(output).toBe('vy'); //ⲓ=y in transliteration logic
    expect(rules[0].rule).toMatch(/'v'/);
  });

  it('should uppercase transliteration for uppercase Coptic letters', async () => {
    const [output] = await transliterate('ⲀⲂⲄ');
    expect(output).toBe('ABGH'); //Ⲃ = B (default), Ⲅ = GH (default)
  });

});

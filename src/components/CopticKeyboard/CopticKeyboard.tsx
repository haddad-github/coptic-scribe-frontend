import React from 'react';

//Props for the virtual Coptic keyboard component
interface CopticKeyboardProps {
  onInsert: (char: string) => void; //callback to insert a character at the cursor position
}

//Layout of Coptic characters, grouped into rows for UI rendering
const copticLayout = [
  ['ⲁ', 'ⲃ', 'ⲅ', 'ⲇ', 'ⲉ', 'ⲍ', 'ⲏ', 'ⲑ', 'ⲓ', 'ⲕ', 'ⲗ', 'ⲙ'],
  ['ⲛ', 'ⲝ', 'ⲟ', 'ⲡ', 'ⲣ', 'ⲥ', 'ⲧ', 'ⲩ', 'ⲫ', 'ⲭ', 'ⲯ', 'ⲱ'],
  ['ϣ', 'ϥ', 'ϧ', 'ϩ', 'ϫ', 'ϭ', 'ⳉ']
];

//Mapping between Latin letters and corresponding Coptic characters
//Used to show the key beneath each character
const transliterationMap: Record<string, string> = {
  a: 'ⲁ', b: 'ⲃ', g: 'ⲅ', d: 'ⲇ', e: 'ⲉ',
  z: 'ⲍ', h: 'ⲏ', y: 'ⲑ', i: 'ⲓ',
  k: 'ⲕ', l: 'ⲗ', m: 'ⲙ', n: 'ⲛ',
  x: 'ⲝ', o: 'ⲟ', p: 'ⲡ', r: 'ⲣ',
  s: 'ⲥ', t: 'ⲧ', u: 'ⲩ', v: 'ⲫ',
  c: 'ⲭ', j: 'ⲯ', w: 'ⲱ',
  q: 'ϣ', f: 'ϥ', '`': 'ϧ',
  '1': 'ϩ', '2': 'ϫ', '3': 'ϭ', '4': 'ⳉ'
};


const CopticKeyboard: React.FC<CopticKeyboardProps> = ({ onInsert }) => {
  return (
    <div className="p-4 mt-6 bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-3xl mx-auto">
      <div className="flex flex-col gap-2 items-center">

        {/* Render the Coptic characters row by row */}
        {copticLayout.map((row, i) => (
        <div key={i} className="flex flex-wrap justify-center gap-2">
          {row.map((char, j) => {
            //Find corresponding Latin character for the tooltip under each key
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const latin = Object.entries(transliterationMap).find(([_, c]) => c === char)?.[0] ?? '';
            return (
              <button
                key={j}
                className="flex flex-col items-center text-lg font-medium bg-gray-50 border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-blue-100 hover:scale-105 hover:shadow-md active:scale-95 transition-all duration-150"
                onClick={() => onInsert(char)}
              >
                <span>{char}</span>
                <span className="text-xs text-gray-500 mt-1">{latin}</span>
              </button>
            );
          })}
        </div>
        ))}

        {/* Special keys: Space, Backspace, Enter */}
        <div className="mt-4 flex gap-3 flex-wrap justify-center">
          <button
            className="text-sm uppercase tracking-wider font-semibold bg-gray-50 border border-gray-300 px-6 py-2 rounded-lg hover:bg-blue-100 hover:scale-105 active:scale-95 transition-all"
            onClick={() => onInsert(' ')}
          >
            Space
          </button>
          <button
            className="text-sm font-semibold bg-gray-50 border border-gray-300 px-4 py-2 rounded-lg hover:bg-red-100 hover:scale-105 active:scale-95 transition-all"
            onClick={() => onInsert('BACKSPACE')}
          >
            ⌫
          </button>
          <button
            className="text-sm font-semibold bg-gray-50 border border-gray-300 px-4 py-2 rounded-lg hover:bg-green-100 hover:scale-105 active:scale-95 transition-all"
            onClick={() => onInsert('ENTER')}
          >
            ↵
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopticKeyboard;

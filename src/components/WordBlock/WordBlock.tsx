import React from 'react';

//Renders a transliteration string with letter-level rule highlighting
//Segments of text that match a rule are underlined and show tooltips on hover
function renderTransliterationWithRules(
  text: string,
  rules: { start: number; length: number; rule: string }[],
  onHoverRule: (rule: string | null) => void
) {
  //Final output array of JSX elements
  const output: React.ReactElement[] = [];

  //Tracks current character index in the string
  let pointer = 0;

  //Loop through the text character by character
  while (pointer < text.length) {
    //Try to find a rule that starts at the current position
    const match = rules.find(r => r.start === pointer);

    if (match) {
      //A rule applies here: extract the matching substring
      const chunk = text.slice(match.start, match.start + match.length);

      //Push a <span> with hover handlers and styling
      output.push(
        <span
          key={pointer}
          className="text-blue-600 underline cursor-pointer"
          onMouseEnter={() => onHoverRule(match.rule)}
          onMouseLeave={() => onHoverRule(null)}
        >
          {chunk}
        </span>
      );

      //Skip over the chunk that was already rendered
      pointer += match.length;
    } else {
      //No rule applies here: render a single normal character
      output.push(<span key={pointer}>{text[pointer]}</span>);
      pointer++;
    }
  }
  //Return the full array of React elements (mixed styled and unstyled spans)
  return output;
}

//Props for the WordBlock component
interface WordBlockProps {
  word: string;
  transliteration?: string;
  englishTranslation?: string;
  arabicTranslation?: string;
  letterRules?: { start: number; length: number; rule: string }[];
  suggestion?: string;
  onSuggestionClick?: () => void;
  wordCategory?: string;
  wordGender?: string;
  greekWord?: string | null;
  copticWordAlt?: string | null;
}

const WordBlock: React.FC<WordBlockProps> = ({
  word,
  transliteration,
  englishTranslation,
  arabicTranslation,
  letterRules,
  suggestion,
  onSuggestionClick,
  wordCategory,
  wordGender,
  greekWord,
  copticWordAlt
}) => {
  //Rule tooltip text
  const [hoveredRule, setHoveredRule] = React.useState<string | null>(null);

  //Show "(?)" confirm
  const [showSuggestionPrompt, setShowSuggestionPrompt] = React.useState(false);

  //Show category/gender/origin
  const [showInfo, setShowInfo] = React.useState(false);

  //Controls hover styling
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={`relative border border-gray-300 p-3 rounded flex flex-col items-center space-y-1 transition-colors duration-200
        ${suggestion === 'No close match found' ? 'bg-red-50' : suggestion ? 'bg-yellow-50' : 'bg-white'}
        ${isHovered ? 'cursor-pointer' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setShowInfo(prev => !prev)}
    >
      {/* Display the original Coptic word with a suggestion indicator if available */}
    <div className="font-bold text-xl flex items-center">
      {word}
      {(() => {
        if (suggestion && suggestion !== 'No close match found') {
          //A valid suggestion => show orange "(?)"
          return (
            <span
              className="ml-2 text-orange-500 hover:text-orange-600 hover:scale-110 transition-transform duration-150"
              style={{ cursor: 'help' }}
              onClick={(e) => {
                e.stopPropagation();
                setShowSuggestionPrompt(true);
              }}
            >
              (?)
            </span>
          );
        } else if (suggestion === 'No close match found') {
          //Specifically "No close match found" => show red "(X)"
          return <span className="ml-2 text-red-500">(X)</span>;
        } else {
          //Suggestion is undefined => recognized dictionary word => show no icon
          return null;
        }
      })()}
    </div>

      {/* Transliteration display (with letter rule hover if available) */}
      <div className="relative">
        {letterRules && transliteration ? (
          renderTransliterationWithRules(transliteration, letterRules, setHoveredRule)
        ) : (
          transliteration
        )}
        {hoveredRule && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 p-2 rounded shadow-md z-50">
            {hoveredRule}
          </div>
        )}
      </div>

      {/* Display the English translation if available */}
      {englishTranslation && (
        <div className="text-green-600 text-l">{englishTranslation}</div>
      )}

      {/* Display the Arabic translation if available */}
      {arabicTranslation && (
        <div className="text-red-600 text-xl">{arabicTranslation}</div>
      )}

      {/* On-click info popup (category/gender/origin) */}
      {showInfo && (
      <div className="mt-2 text-sm text-gray-700 text-center">
        {wordCategory && <div><strong>Category:</strong> {wordCategory}</div>}
        {wordGender && <div><strong>Gender:</strong> {wordGender}</div>}
        <div>
          <strong>Origin:</strong>{' '}
          {greekWord == null && copticWordAlt == null
            ? 'Unknown'
            : greekWord != null
            ? 'Greek'
            : copticWordAlt != null
            ? 'Egyptian'
            : 'Unknown'}
        </div>
      </div>
      )}

      {/* Suggestion confirmation modal */}
      {showSuggestionPrompt && suggestion && suggestion !== 'No close match found' && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 p-2 rounded shadow-lg z-50">
          <p>
            Did you mean <strong>{suggestion}</strong>?
          </p>
          <div className="flex gap-2 mt-2">
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded"
              onClick={() => {
                if (onSuggestionClick) onSuggestionClick();
                setShowSuggestionPrompt(false);
              }}
            >
              Yes
            </button>
            <button
              className="px-2 py-1 bg-gray-300 text-black rounded"
              onClick={() => setShowSuggestionPrompt(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordBlock;

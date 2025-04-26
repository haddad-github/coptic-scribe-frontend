import React, {useEffect, useRef, useState} from 'react';
import Checkbox from '../../Checkbox/Checkbox';
import DropdownButton from '../../DropdownButton/DropdownButton';
import WordBlock from '../../WordBlock/WordBlock';
import TypingLine from '../../TypingLine/TypingLine';
import BookmarkModal from '../../BookmarkModal/BookmarkModal';
import CopticKeyboard from '../../CopticKeyboard/CopticKeyboard';
import SearchDropdown from '../../SearchDropdown/SearchDropdown';

//Import transliteration script
import {fetchDictionaryEntry, transliterate} from '../../../utils/transliterate';

const userApiUrl = process.env.REACT_APP_USER_API_URL;

interface WordData {
  coptic: string;
  transliteration?: string;
  english?: string;
  arabic?: string;
  letterRules?: { start: number; length: number; rule: string }[];
  suggestion?: string; //
  wordCategory?: string;
  wordGender?: string;
  greekWord?: string | null;
  copticWordAlt?: string | null;
}

interface MainPageProps {
  isLoggedIn: boolean;
  token: string | null;
  userEmail: string | null;
  selectedBookmark: any;
}

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

const MainPage: React.FC<MainPageProps> = ({ isLoggedIn, token, userEmail, selectedBookmark}: MainPageProps) => {
  //State for checkbox
  const [showTransliteration, setShowTransliteration] = useState(() => {
    return localStorage.getItem('showTransliteration') !== 'false';
  });
  const [showEnglish, setShowEnglish] = useState(() => {
    return localStorage.getItem('showEnglish') === 'true';
  });
  const [showArabic, setShowArabic] = useState(() => {
    return localStorage.getItem('showArabic') === 'true';
  });

  //State for the user's typed Coptic text
  const [copticText, setCopticText] = useState('');

  //State for the transliterated result
  const [translitResult, setTranslitResult] = useState('');
  const [letterRules, setLetterRules] = useState<{ start: number; length: number; rule: string }[]>([]);

  //Store combined English and Arabic lines for multiples
  const [englishLine, setEnglishLine] = useState('');
  const [arabicLine, setArabicLine] = useState('');

  //State for full dictionary + transliteration data for every word in every line
  const [linesData, setLinesData] = useState<WordData[][]>([]);

  //Ref for the editable Coptic input box (used for keyboard insertion and selection control)
  const typingLineRef = useRef<HTMLDivElement>(null);

  //Whether the virtual Coptic keyboard is visible
  const [showKeyboard, setShowKeyboard] = useState(true);

  //Whether the bookmark saving modal is open
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);

  //Whether to overwrite bookmark dropdown is open
  const [showOverwriteDropdown, setShowOverwriteDropdown] = useState(false);

  //User’s saved bookmarks (fetched from backend)
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  //Whether to show the instruction panel at the top of the page
  const [showInstructions, setShowInstructions] = useState(false);

  //Handler for when user types or pastes text
  const handleTextChange = async (newText: string) => {
    setCopticText(newText);

    //Call transliterator
    const [translit, perLetterRules] = await transliterate(newText);

    //Store the results in states
    setTranslitResult(translit);
    setLetterRules(perLetterRules);

    //Split entire text by newlines => array of lines
    const rawLines = newText.split(/\n/);

    //For each line, split into words
    const allLinesData: WordData[][] = [];

    for (const line of rawLines) {
      const words = line.split(/\s+/).filter(Boolean);

      const thisLineWordData: WordData[] = [];
      for (const w of words) {
        const [wordTranslit, wordLetterRules] = await transliterate(w);
        const entry = await fetchDictionaryEntry(w);

        const isSuggestion = entry && entry.coptic_word_alt === 'SUGGESTION';
        let suggestionText: string | undefined = undefined;

        if (isSuggestion) {
          suggestionText = entry?.coptic_word;
        } else if (!entry) {
          //means the server said "no dictionary entry" AND no suggestion
          suggestionText = 'No close match found';
        } else {
          //word is correct => suggestionText = undefined
        }

        thisLineWordData.push({
          coptic: w,
          transliteration: wordTranslit,
          english: entry ? entry.english_translation : '(No entry)',
          arabic: entry ? entry.arabic_translation : '(No entry)',
          letterRules: wordLetterRules,
          suggestion: suggestionText,
          wordCategory: entry?.word_category,
          wordGender: entry?.word_gender,
          greekWord: entry?.greek_word,
          copticWordAlt: entry?.coptic_word_alt,
        });
      }
      allLinesData.push(thisLineWordData);
    }

    setLinesData(allLinesData);
  };

    //Replaces the oldWord in the copticText with newWord, then re-runs handleTextChange
    const handleSuggestionClick = async (oldWord: string, newWord: string) => {
      //Split the full text into lines
      const lines = copticText.split('\n');
      const updatedLines: string[] = [];

      for (const line of lines) {
        const words = line.split(/\s+/);
        const updatedWords = words.map(w => (w === oldWord ? newWord : w));
        updatedLines.push(updatedWords.join(' '));
      }

      //Rebuild the full text preserving line structure
      const updatedText = updatedLines.join('\n');
      setCopticText(updatedText);
      await handleTextChange(updatedText);
    };

    //Copies a single line of text (Coptic, transliteration, translations) to the clipboard
    const handleCopyLine = async (lineIndex: number) => {
      //Get the corresponding line’s word data
      const line = linesData[lineIndex];
      if (!line) return;

      //Prepare an array to store visible content
      const parts: string[] = [];

      //Always include the Coptic line
      parts.push(line.map(wd => wd.coptic).join(' '));

      //Optionally include transliteration, English, Arabic based on checkboxes
      if (showTransliteration) parts.push(line.map(wd => wd.transliteration ?? '').join(' '));
      if (showEnglish) parts.push(line.map(wd => wd.english ?? '').join(' '));
      if (showArabic) parts.push(line.map(wd => wd.arabic ?? '').join(' '));

      //Join all parts into a single string separated by line breaks
      const fullText = parts.join('\n');

      try {
        //Try copying to clipboard
        await navigator.clipboard.writeText(fullText);
        alert('Line copied to clipboard!');
      } catch (err) {
        //Handle copy errors (e.g., permission denied)
        console.error('Copy failed', err);
        alert('Failed to copy');
      }
    };

    //Handles export of the current translation data as .txt, .csv, or .pdf
    const handleExport = (format: string) => {
      const lines: string[] = [];

      //Step 1: Construct unified text lines from word data
      for (const line of linesData) {
        const copticLine = line.map(w => w.coptic).join(' ');
        const translitLine = line.map(w => w.transliteration || '').join(' ');
        const englishLine = line.map(w => w.english || '').join(' ');
        const arabicLine = line.map(w => w.arabic || '').join(' ');

        //Always include Coptic and transliteration
        lines.push(copticLine);
        lines.push(translitLine);

        //Optionally include translations if checked
        if (showEnglish) lines.push(englishLine);
        if (showArabic) lines.push(arabicLine);

        //Add spacing between each block
        lines.push('');
      }

      //Step 2: Export as .txt
      if (format === 'Text file (.txt)') {
        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'coptic_export.txt';
        a.click();
        URL.revokeObjectURL(url);

      //Step 3: Export as .csv
      } else if (format === 'CSV (.csv)') {
        //Build CSV header
        const csvLines = [['Coptic', 'Transliteration', 'English', 'Arabic']];
        //Build each row of the CSV
        for (const line of linesData) {
          for (const w of line) {
            csvLines.push([
              w.coptic,
              w.transliteration || '',
              showEnglish ? (w.english || '') : '',
              showArabic ? (w.arabic || '') : ''
            ]);
          }
        }

        //Prepare and download UTF-8 CSV file with BOM for Excel
        const csvContent = csvLines.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const utf8Bom = '\uFEFF'; // <-- BOM
        const blob = new Blob([utf8Bom + csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'coptic_export.csv';
        a.click();
        URL.revokeObjectURL(url);

        //Step 4: Export as .pdf
      } else if (format === 'PDF (.pdf)') {
        //Dynamic import to avoid bundling jsPDF
        //@ts-ignore
        import('jspdf').then(jsPDF => {
          const doc = new jsPDF.jsPDF();
          const pageWidth = doc.internal.pageSize.getWidth();

          //Draw centered title at top
          doc.setFontSize(18);
          const title = 'Coptic Scribe';
          const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
          doc.text(title, titleX, 20);

          //Load and draw the logo
          const logo = new Image();
          logo.src = '/main_logo.png'; //must be served from same origin
          logo.onload = () => {
            doc.addImage(logo, 'PNG', 14, 10, 20, 20); //(x, y, width, height)

            //Vertical starting point for content
            let y = 40;
            doc.setFontSize(12);

            //Loop through each text line and draw them on the PDF
            for (const line of linesData) {
              const coptic = line.map(w => w.coptic).join(' ');
              const translit = line.map(w => w.transliteration || '').join(' ');
              const english = showEnglish ? line.map(w => w.english || '').join(' ') : '';
              const arabic = showArabic ? line.map(w => w.arabic || '').join(' ') : '';

              //Only draw non-empty lines
              const linesToWrite = [coptic, translit, english, arabic].filter(Boolean);
              for (const l of linesToWrite) {
                doc.text(l, 14, y);
                y += 8;
              }
              y += 6;
              //If page is full, start a new one
              if (y > 270) {
                doc.addPage();
                y = 20;
              }
            }

            //Download the final PDF
            //@ts-ignore
            doc.save('coptic_export.pdf');
          };
        });
      }
    };

    //Refreshes the list of bookmarks for the current logged-in user
    const refreshBookmarks = async () => {
      try {
        const res = await fetch(`${userApiUrl}/bookmarks/user/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setBookmarks(data);
      } catch (err) {
        console.error('Could not refresh bookmarks', err);
      }
    };

    //When a saved bookmark is selected, populate the main state with its data
    useEffect(() => {
      if (selectedBookmark) {
        //Fallback in case a field is missing in the selected bookmark
        const safeCoptic = selectedBookmark.copticText ?? '';
        const safeTranslit = selectedBookmark.transliteration ?? '';
        const safeEnglish = selectedBookmark.englishTranslation ?? '';
        const safeArabic = selectedBookmark.arabicTranslation ?? '';

        //Update UI states with selected bookmark's content
        setCopticText(safeCoptic);
        setTranslitResult(safeTranslit);
        setEnglishLine(safeEnglish);
        setArabicLine(safeArabic);

        //Re-run full parsing to regenerate word blocks
        handleTextChange(safeCoptic).catch(console.error);
      }
    }, [selectedBookmark]);

    //Initial fetch of bookmarks when user logs in or their email is detected
    useEffect(() => {
      if (isLoggedIn && userEmail) {
        fetch(`${userApiUrl}/bookmarks/user/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => setBookmarks(data))
          .catch(err => console.error('Could not fetch bookmarks', err));
      }
    }, [isLoggedIn, userEmail]);

    //Save checkbox preference for "show transliteration" to localStorage
    useEffect(() => {
      localStorage.setItem('showTransliteration', showTransliteration.toString());
    }, [showTransliteration]);

    //Save checkbox preference for "show English" to localStorage
    useEffect(() => {
      localStorage.setItem('showEnglish', showEnglish.toString());
    }, [showEnglish]);

    //Save checkbox preference for "show Arabic" to localStorage
    useEffect(() => {
      localStorage.setItem('showArabic', showArabic.toString());
    }, [showArabic]);

    //Listens for keyboard events when user types in TypingLine
    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        //Check if focus is inside TypingLine
        const activeEl = document.activeElement;
        const isTypingLineFocused = typingLineRef.current?.contains(activeEl);
        if (!isTypingLineFocused) return;

        const typedChar = e.key;

        //Handle physical Enter key → insert <br> manually instead of newline
        if (typedChar === 'Enter') {
          //bock browser double-line
          e.preventDefault();

          if (typingLineRef.current) {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
              const range = sel.getRangeAt(0);
              const br = document.createElement('br');
              range.insertNode(br);
              range.setStartAfter(br);
              range.setEndAfter(br);
              sel.removeAllRanges();
              sel.addRange(range);

              //Update app state with new input
              handleTextChange(typingLineRef.current.innerText).catch(console.error);
            }
          }
          return;
        }

        //Check if typed character maps to a Coptic letter
        const mappedChar = transliterationMap[typedChar.toLowerCase()];
        if (mappedChar && typingLineRef.current) {
          e.preventDefault(); //Prevent normal input
          typingLineRef.current.focus();

          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const textNode = document.createTextNode(mappedChar);
            range.insertNode(textNode);
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            sel.removeAllRanges();
            sel.addRange(range);

            //Update the app with the new inserted character
            handleTextChange(typingLineRef.current.innerText).catch(console.error);
          }
        }
      };

      //Add key listener when component mounts
      document.addEventListener('keydown', handleKeyPress);

      //Cleanup listener on unmount
      return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleTextChange]);

  return (
    <div className="MainPage px-4 sm:px-24 lg:px-40">
        {/* Show the Bookmark Modal if user clicks "Save as Bookmark" */}
        {showBookmarkModal && (
            <BookmarkModal
              onClose={() => setShowBookmarkModal(false)}
              onSave={async (name, notes) => {
                //Hide modal immediately after Save
                setShowBookmarkModal(false); //close modal when user cancels

                //Prepare bookmark payload from current text and options
                const bookmarkPayload = {
                  email: userEmail,
                  name,
                  notes,
                  copticText: copticText.trim(),
                  transliteration: translitResult.trim(),
                  englishTranslation: showEnglish ? linesData.map(line => line.map(w => w.english).join(' ')).join('\n') : '',
                  arabicTranslation: showArabic ? linesData.map(line => line.map(w => w.arabic).join(' ')).join('\n') : '',
                };

                try {
                  //Send POST request to backend to save bookmark
                  const res = await fetch(`${userApiUrl}/bookmarks/add`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(bookmarkPayload)
                  });

                  //If backend rejected the save
                  if (!res.ok) {
                    const msg = await res.text();
                    alert('Bookmark failed: ' + msg);
                  } else {
                    alert('Bookmark saved!');

                    //Refresh bookmarks so it appears in dropdown immediately
                    await refreshBookmarks();

                    //Notify Header component to refresh as well (if user had selected that bookmark before)
                    if (typeof window !== 'undefined' && window.dispatchEvent) {
                      window.dispatchEvent(new CustomEvent('refreshBookmarks'));
                    }
                  }

                } catch (err) {
                  console.error('Login error:', err);
                  alert('Something went wrong while saving.');
                }
              }}
            />
          )}

          {/* Instructions dropdown toggle button and panel */}
          <div className="text-center mt-4">
            {/* Toggle visibility of instructions */}
            <button
              className="text-sm text-custom-red font-medium hover:underline"
              onClick={() => setShowInstructions(prev => !prev)}
            >
              {showInstructions ? 'Hide Instructions ▲' : 'Show Instructions ▼'}
            </button>

            {/* Instructions content — shown only if toggled on */}
            {showInstructions && (
              <div className="mt-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 max-w-3xl mx-auto space-y-2">
                <div>
                  <span className="font-bold text-yellow-600">(?)</span> — Word not found, suggestion available. Click the icon to replace it.
                </div>
                <div>
                  <span className="font-bold text-red-600">(X)</span> — Word not found, and no suggestion was found.
                </div>
                <div>
                  <span className="font-bold">Tip:</span> Click on a word to get more information on it.
                </div>
                <div>
                  <span className="font-bold">Tip:</span> You can type using your keyboard — Latin letters are automatically converted (e.g., <code>a</code> → ⲁ, <code>r</code> → ⲣ).
                </div>
              </div>
            )}
          </div>

        {/* Checkboxes that let user toggle what to display */}
        <div className="flex flex-wrap gap-4 justify-center items-center mb-4 pt-4">
          <Checkbox
            text="Transliteration"
            checked={showTransliteration}
            onChange={setShowTransliteration}
          />
          <Checkbox
            text="Translate to English"
            checked={showEnglish}
            onChange={setShowEnglish}
          />
          <Checkbox
            text="Translate to Arabic"
            checked={showArabic}
            onChange={setShowArabic}
          />
        </div>


        {/* Typing area — allows user to enter Coptic text */}
        <TypingLine
          placeholder="Type or copy-paste your Coptic text here..."
          onTextChange={handleTextChange}
          value={copticText}
          onRefReady={(ref) => (typingLineRef.current = ref.current)}
        />

        {/* Toggle virtual keyboard */}
        <button
          className="fixed bottom-6 right-6 z-50 bg-custom-red hover:bg-red-800 text-white text-sm px-4 py-2 rounded-full shadow-lg transition-all"
          onClick={() => setShowKeyboard(prev => !prev)}
        >
          {showKeyboard ? '⌨️ Hide Keyboard' : '⌨️ Show Keyboard'}
        </button>

        {/* Coptic keyboard — appears below the typing line */}
        {showKeyboard && (
         <CopticKeyboard
          onInsert={(char) => {
            if (typingLineRef.current) {
              typingLineRef.current.focus();
              const sel = window.getSelection();
              if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);

                //Handle backspace key from virtual keyboard
                if (char === 'BACKSPACE') {
                  range.setStart(range.startContainer, Math.max(0, range.startOffset - 1));
                  range.deleteContents();
                //Handle ENTER key (insert line break)
                } else if (char === 'ENTER') {
                  const br = document.createElement('br');
                  range.insertNode(br);
                  range.setStartAfter(br);
                  range.setEndAfter(br);
                  //Insert regular character
                } else {
                  const textNode = document.createTextNode(char);
                  range.insertNode(textNode);
                  range.setStartAfter(textNode);
                  range.setEndAfter(textNode);
                }

                sel.removeAllRanges();
                sel.addRange(range);

                //Update application state with new input
                handleTextChange(typingLineRef.current.innerText).catch(console.error);
              }
            }
          }}
        />
        )}

        {/* Display each line (user input) as a separate row with word blocks */}
        <div className="space-y-6 mt-6 px-2 sm:px-10">
          {linesData.map((lineWordData, lineIndex) => (
            <div key={lineIndex} className="flex items-start space-x-2">

              {/* Line number and copy button */}
              <span className="font-bold pr-2 flex items-center space-x-2">
                <span>{lineIndex + 1}.</span>
                <button
                  className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded transition text-gray-800"
                  onClick={() => handleCopyLine(lineIndex)}
                >
                  Copy
                </button>
              </span>


              {/* Render each word in the line as a WordBlock */}
              <div className="flex flex-row flex-wrap gap-3">
                {lineWordData.map((wd, wordIndex) => (
                  <WordBlock
                    key={wordIndex}
                    word={wd.coptic}

                    //Show transliteration only if enabled
                    transliteration={
                      showTransliteration ? wd.transliteration : undefined
                    }

                    //Show English translation only if enabled
                    englishTranslation={
                      showEnglish ? wd.english : undefined
                    }

                    //Show Arabic translation only if enabled
                    arabicTranslation={
                      showArabic ? wd.arabic : undefined
                    }

                    //Highlight per-letter transliteration rules only if enabled
                    letterRules={
                      showTransliteration ? wd.letterRules : undefined
                    }

                    //Display suggestion (if any)
                    suggestion={wd.suggestion}

                    //Handle suggestion click (replaces word)
                    onSuggestionClick={() => {
                        if (wd.suggestion){
                            handleSuggestionClick(wd.coptic, wd.suggestion).catch(console.error);
                        }
                    }}

                    //Word metadata (for details on click)
                    wordCategory={wd.wordCategory}
                    wordGender={wd.wordGender}
                    greekWord={wd.greekWord}
                    copticWordAlt={wd.copticWordAlt}

                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Section with export and bookmark actions */}
        <div className="clickable-buttons">

            {/* Download dropdown (TXT, CSV, PDF) */}
            <div className="mt-10 flex justify-center">
              <div className="shadow-md">
                <DropdownButton
                  menuItems={['Text file (.txt)', 'CSV (.csv)', 'PDF (.pdf)']}
                  text="Download Text"
                  icon="/download_icon.png"
                  iconWidth={30}
                  onItemClick={handleExport}
                />
              </div>
            </div>

        {/* Save as bookmark button — enabled only if logged in */}
        <div className="mt-6 flex justify-center">
          <button
            disabled={!isLoggedIn}
            title={!isLoggedIn ? 'Login to bookmark' : ''}
            onClick={() => setShowBookmarkModal(true)}
            className={`px-4 py-2 rounded-full font-medium shadow transition ${
              isLoggedIn
                ? 'bg-custom-red text-white hover:bg-red-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            🔖 Save as Bookmark{!isLoggedIn && ' (login to use)'}
          </button>
        </div>

        {/* Overwrite existing bookmark — visible only if logged in */}
        {isLoggedIn && (
          <div className="mt-2 flex justify-center">
            <button
              onClick={() => setShowOverwriteDropdown(prev => !prev)}
              className="px-4 py-2 rounded-full bg-yellow-600 text-white hover:bg-yellow-700 font-medium shadow transition"
            >
              ✏️ Overwrite Existing Bookmark
            </button>
          </div>
        )}

        {/* Dropdown for selecting a bookmark to overwrite (only shown if toggle is active) */}
        {showOverwriteDropdown && (
          <SearchDropdown
            bookmarks={bookmarks}

            //When user selects a bookmark to overwrite
            onSelect={async (bookmark) => {

              //Prepare updated content based on current input
              const updated = {
                id: bookmark.id,
                name: bookmark.name,
                notes: bookmark.notes,
                email: userEmail,
                copticText: copticText.trim(),
                transliteration: translitResult.trim(),
                englishTranslation: showEnglish ? linesData.map(line => line.map(w => w.english).join(' ')).join('\n') : '',
                arabicTranslation: showArabic ? linesData.map(line => line.map(w => w.arabic).join(' ')).join('\n') : '',
              };

              try {
                //Send PUT request to update the bookmark
                const res = await fetch(`${userApiUrl}/bookmarks/rename/${bookmark.id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(updated),
                });

                if (res.ok) {
                  alert('Bookmark overwritten!');

                  //Refresh bookmark list in state and in Header
                  await refreshBookmarks();

                  window.dispatchEvent(new CustomEvent('refreshBookmarks'));

                  //If the overwritten bookmark was currently selected → reload its data
                  if (selectedBookmark && selectedBookmark.id === bookmark.id) {
                    const updatedBookmark = {
                      ...bookmark,
                      copticText: updated.copticText,
                      transliteration: updated.transliteration,
                      englishTranslation: updated.englishTranslation,
                      arabicTranslation: updated.arabicTranslation,
                    };

                    //Notify Header.tsx to update currently selected bookmark
                    if (typeof window !== 'undefined' && window.dispatchEvent) {
                      window.dispatchEvent(new CustomEvent('updateSelectedBookmark', { detail: updatedBookmark }));
                    }

                    //Apply changes in UI
                    setCopticText(updated.copticText);
                    setTranslitResult(updated.transliteration);
                    setEnglishLine(updated.englishTranslation || '');
                    setArabicLine(updated.arabicTranslation || '');
                    await handleTextChange(updated.copticText);
                  }
                } else {
                  //Request failed → show message from backend
                  const msg = await res.text();
                  alert('Failed: ' + msg);
                }
              } catch (err) {
                console.log(err);
                alert('Something went wrong');
              }
              //Close dropdown either way
              setShowOverwriteDropdown(false);
            }}

            //These two handlers are unused here
            onRename={() => {}} // no-op
            onDelete={() => {}} // no-op

            //Close dropdown manually
            onClose={() => setShowOverwriteDropdown(false)}
          />
        )}
        </div>
      <br/>
    </div>
  );
};

export default MainPage;
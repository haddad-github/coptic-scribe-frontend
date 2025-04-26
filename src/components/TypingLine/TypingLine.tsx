import React, {useEffect, useRef} from 'react';
import './TypingLine.css';

//Props for the TypingLine component
interface TypingLineProps {
  placeholder?: string;
  value?: string;
  onTextChange?: (text: string) => void;
  onRefReady?: (ref: React.RefObject<HTMLDivElement | null>) => void; //ref callback to expose divRef to parent
}

const TypingLine: React.FC<TypingLineProps> = ({placeholder = 'Type or copy-paste Coptic text here...', value, onTextChange, onRefReady}) => {

  //Ref to the editable div element
  const divRef = useRef<HTMLDivElement>(null);

  //Ref to track caret/selection position between renders
  const selectionRef = useRef<Range | null>(null);

  //Inform parent that the ref is ready (for programmatic focus/insert)
  useEffect(() => {
    if (onRefReady) {
      onRefReady(divRef); //pass ref to parent
    }
  }, [onRefReady]);

  //Sync the internal content when the `value` prop changes externally
  useEffect(() => {
    if (divRef.current && divRef.current.innerText !== value) {
      if (typeof value === 'string') {
        divRef.current.innerText = value;
      }
    }
  }, [value]);

  //Triggered whenever the user types or pastes in the contentEditable div
  const handleInput = () => {
    if (!divRef.current) return;
    const text = divRef.current.innerText;
    if (onTextChange) {
      onTextChange(text);
    }
  };

  //Stores the current caret/selection so that it can be restored later
  const saveCaret = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      selectionRef.current = selection.getRangeAt(0);
    }
  };

  return (
    <div
      ref={divRef}
      className="TypingLine whitespace-pre-wrap text-2xl"
      contentEditable
      onInput={handleInput}
      onKeyUp={saveCaret}
      onMouseUp={saveCaret}
      data-placeholder={placeholder}
      suppressContentEditableWarning
    />
  );
};

export default TypingLine;

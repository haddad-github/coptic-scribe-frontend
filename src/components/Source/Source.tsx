import React from 'react';

//Props defining a single source reference (e.g. from a book or online article)
interface SourceProps {
  name: string;
  source: string;
  content: string;
  link: string;
  thumbnail?: string;
}

const Source: React.FC<SourceProps> = ({ name, source, content, link, thumbnail }) => {
  return (
    <div className="flex items-start gap-4 p-4 border-b border-gray-400">

      {/* Left section: icon or thumbnail */}
      <div className="flex-shrink-0">
        <img
          src={thumbnail || '/book_icon.png'}
          alt="Source icon"
          className="w-20 h-20 object-contain"
        />
      </div>

      {/* Right section: textual content */}
      <div className="text-left text-black text-sm sm:text-base leading-relaxed">
        <p><span className="font-bold text-custom-red">Name:</span> {name}</p>
        <p><span className="font-bold">Source:</span> {source}</p>
        <p><span className="font-bold">Content:</span> {content}</p>
        {/* External URL to the full source (opens in new tab) */}
        <p>
          <span className="font-bold">Link:</span>{' '}
          <a
            href={link}
            className="text-blue-700 hover:underline break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Source;

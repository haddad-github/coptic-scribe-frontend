import React from 'react';
import Source from '../components/Source/Source';

const Ressources: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-custom-red mb-6 text-center">
        📚 Ressources
      </h1>

    <Source
      name="Coptic Lessons for Deacons"
      source="Suscopts - Coptic Diocese of the Southern United States"
      content="Coptic lessons, grammar and history"
      link="http://www.suscopts.org/deacons/coptic.shtml"
      thumbnail="https://i0.wp.com/www.suscopts.org/ssc/wp-content/uploads/2024/09/cropped-5517017-middle-1.png?fit=512%2C512&ssl=1"
    />

    <Source
      name="Coptic for All"
      source="Coptic Orthodox Diocese of London"
      content="5 levels with multiple lessons (articles, verbs, etc.), including audio pronunciation"
      link="https://copticforall.com/e-learning/"
      thumbnail="https://copticforall.com/wp-content/uploads/2020/11/Crest2.png"
    />

    <Source
      name="A Study in Bohairic Coptic"
      source="Nabil Mattar"
      content="Bohairic Coptic in English & Arabic, detailed guide in grammar & exercises"
      link="https://cld.bz/users/user-73469131/Mattar-A-Study-of-Bohairic-Coptic"
      thumbnail="https://m.media-amazon.com/images/I/41GZDPT1WWL._SY385_.jpg"
    />

    <Source
      name="64 PDF compilation"
      source="N/A"
      content="Everything"
      link="https://archive.org/details/copticlanguage/01-Coptic%20alphabet%20ar/"
      thumbnail="https://ia600809.us.archive.org/BookReader/BookReaderImages.php?zip=/7/items/copticlanguage/01-Coptic%20alphabet%20ar_jp2.zip&file=01-Coptic%20alphabet%20ar_jp2/01-Coptic%20alphabet%20ar_0000.jp2&id=copticlanguage&scale=4&rotate=0"
    />

    <Source
      name="Bohairic - English Dictionary"
      source="Copticlang"
      content="Dictionary"
      link="https://copticlang.bizhat.com/coptdict.pdf"
      thumbnail="https://copticlang.bizhat.com/coptic1.jpg"
    />

    {/* More sources here */}
    </div>
  );
};

export default Ressources;

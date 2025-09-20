// src/pages/TamilELibrary.jsx
import React from "react";
import book21 from "../assets/books/21.jpg";
import book22 from "../assets/books/22.jpg";
import book23 from "../assets/books/23.jpg";
import book24 from "../assets/books/24.jpg";
import book25 from "../assets/books/25.jpg";
import book26 from "../assets/books/26.jpg";
import book27 from "../assets/books/27.jpg";
import book28 from "../assets/books/28.jpg";
import book29 from "../assets/books/29.jpg";

const books = {
  translators: [
    { 
      title: "Oxford English–Tamil Dictionary", 
      desc: "A comprehensive bilingual dictionary.", 
      img: book21, 
      file: "https://archive.org/details/dli.jZY9lup2kZl6TuXGlZQdjZI6kuQy.TVA_BOK_0007076" 
    },
    { 
      title: "Collins English–Tamil Dictionary", 
      desc: "A concise dictionary for everyday use.", 
      img: book22, 
      file: "https://archive.org/details/dli.jZY9lup2kZl6TuXGlZQdjZI8lJxy.TVA_BOK_0006689" 
    },
    { 
      title: "Nithra English–Tamil Dictionary App", 
      desc: "Offline app with over 100,000 words.", 
      img: book23, 
      file: "https://play.google.com/store/apps/details?id=com.bharathdictionary" 
    },
  ],
  grammar: [
    { 
      title: "Tamil Grammar (Govt. TN)", 
      desc: "Textbook for Standard X students.", 
      img: book24, 
      file: "https://www.johnsonasirservices.org/web/Downloads6/Tamil%20Grammar.pdf" 
    },
    { 
      title: "A Grammar of Modern Tamil", 
      desc: "In-depth study of Tamil grammar.", 
      img: book25, 
      file: "https://theswissbay.ch/pdf/Books/Linguistics/Mega%20linguistics%20pack/Dravidian/Tamil%2C%20A%20Grammar%20of%20Modern%20%28Lehmann%29.pdf" 
    },
    { 
      title: "Tamil Grammar Self-Taught", 
      desc: "Beginner-friendly grammar guide.", 
      img: book26, 
      file: "https://archive.org/details/tamilgrammarself00wickrich" 
    },
  ],
  culture: [
    { 
      title: "Recent Tamil Short Stories", 
      desc: "Collection of contemporary Tamil short stories.", 
      img: book27, 
      file: "https://archive.org/details/dli.ernet.287765" 
    },
    { 
      title: "Tamil Kids Stories", 
      desc: "Short stories for children.", 
      img: book28, 
      file: "https://tamilkidsstory.com/" 
    },
    { 
      title: "Tamil Short Stories Collection", 
      desc: "Curated stories by renowned authors.", 
      img: book29, 
      file: "https://www.scribd.com/doc/17623843/Tamil-Short-Stories" 
    },
  ],
};

export default function TamilELibrary() {
  const renderSection = (title, items) => (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-pink-400">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((book, i) => (
          <div
            key={i}
            className="bg-gray-900 shadow-md rounded-xl overflow-hidden hover:shadow-xl transition transform hover:scale-105"
          >
            <img src={book.img} alt={book.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-lg text-pink-400">{book.title}</h3>
              <p className="text-sm text-pink-200 mt-2">{book.desc}</p>
              <a
                href={book.file}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                View Here
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-pink-500">📚 Tamil E-Library</h1>
        <p className="text-pink-300 mb-8">
          Learn Tamil with curated books — from dictionaries to stories.
        </p>

        {renderSection("English ↔ Tamil Translators", books.translators)}
        {renderSection("Tamil Grammar & Learning", books.grammar)}
        {renderSection("Stories & Culture in Tamil", books.culture)}
      </div>
    </div>
  );
}

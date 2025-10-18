import React, { useState, useEffect, useMemo } from "react";
import { IMAGE_POOL } from './imagePool.js';

const CLOTHING_KINDS = [
  "koszula",
  "żakiet",
  "bluza",
  "bluzka",
  "spodnie",
  "sukienka",
  "spódnica",
  "garnitur",
  "kurtka",
  "sweter",
  "T-shirt",
  "marynarka",
  "kamizelka",
  "płaszcz",
  "dresy",
  "legginsy",
  "kombinezon",
  "piżama",
  "szalik",
  "czapka",
  "rękawiczki",
  "buty",
  "sandały",
  "kapelusz",
  "krawat",
  "torebka",
  "plecak",
  "pasek",
  "okulary przeciwsłoneczne",
  "kolczyki",
  "naszyjnik",
  "bransoletka",
  "zegarek",
  "portfel",
  "fartuch lekarski",
  "stetoskop",
  "rękawice lateksowe",
  "czepek chirurgiczny",
  "maska medyczna",
  "body dziecięce",
  "śpioszki",
  "buciki dziecięce",
  "czapeczka dziecięca",
  "śliniak",
  "kamizelka odblaskowa",
  "fartuch sklepowy",
];

const COLORS = [
  "czerwony",
  "niebieski",
  "zielony",
  "czarny",
  "biały",
  "żółty",
  "szary",
  "różowy",
  "brązowy",
  "pomarańczowy",
  "fioletowy",
  "beżowy",
  "złoty",
  "srebrny",
];



function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function JakieToUbranieQuiz({ questionsCount = 10 }) {
  const selectedImages = useMemo(() => {
    if (!IMAGE_POOL || IMAGE_POOL.length === 0) return [];
    const shuffled = shuffleArray(IMAGE_POOL);
    return shuffled.slice(0, Math.min(questionsCount, shuffled.length));
  }, [questionsCount]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedKind, setSelectedKind] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setSelectedKind(null);
    setSelectedColor(null);
    setAnswered(false);
  }, [currentIndex]);

  if (selectedImages.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Brak obrazków w puli</h2>
        <p>Dodaj pliki do <code>/public/images</code> i zaktualizuj IMAGE_POOL.</p>
      </div>
    );
  }

  const current = selectedImages[currentIndex];

  function buildOptions(correct, pool) {
    const other = pool.filter((p) => p !== correct);
    const shuffled = shuffleArray(other);
    const opts = [correct, ...shuffled.slice(0, Math.min(2, shuffled.length))];
    return shuffleArray(opts);
  }

  const kindOptions = useMemo(
    () => current ? buildOptions(current.kind, CLOTHING_KINDS) : [],
    [currentIndex, selectedImages]
  );
  const colorOptions = useMemo(
    () => current ? buildOptions(current.color, COLORS) : [],
    [currentIndex, selectedImages]
  );

  function submitAnswer() {
    if (answered) return;
    const correctKind = selectedKind === current.kind;
    const correctColor = selectedColor === current.color;
    const points = correctKind && correctColor ? 1 : 0;
    if (points === 1) setScore((s) => s + 1);
    setAnswered(true);
  }

  function nextQuestion() {
    if (currentIndex + 1 < selectedImages.length) {
      setCurrentIndex((i) => i + 1);
    }
  }

  function restart() {
    window.location.reload();
  }

  if (currentIndex >= selectedImages.length) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Koniec gry!</h2>
        <p className="text-lg mb-6">Twój wynik: <strong>{score} / {selectedImages.length}</strong></p>
        <button onClick={restart} className="px-4 py-2 rounded shadow bg-blue-600 text-white">Zagraj jeszcze raz</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Jakie to ubranie?</h1>
        <div>Pytanie {currentIndex + 1} / {selectedImages.length}</div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <section className="bg-white rounded-lg p-4 shadow">
          <p className="mb-2">Na obrazku widzisz ubranie lub akcesorium:</p>
          <div className="border rounded overflow-hidden mb-4">
            <img src={current.src} alt={`Obraz ${currentIndex + 1}`} className="w-full h-64 object-cover" />
          </div>

          <div className="mb-3">
            <p className="font-medium">Wybierz rodzaj:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {kindOptions.map((k) => (
                <button
                  key={k}
                  onClick={() => !answered && setSelectedKind(k)}
                  className={`px-3 py-2 rounded border ${selectedKind === k ? "ring-2 ring-offset-2" : ""}`}
                  aria-pressed={selectedKind === k}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium">Wybierz kolor:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => !answered && setSelectedColor(c)}
                  className={`px-3 py-2 rounded border ${selectedColor === c ? "ring-2 ring-offset-2" : ""}`}
                  aria-pressed={selectedColor === c}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={submitAnswer}
              disabled={answered || !selectedKind || !selectedColor}
              className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
            >
              Sprawdź
            </button>

            {answered && currentIndex + 1 < selectedImages.length && (
              <button onClick={nextQuestion} className="px-4 py-2 rounded border">Następne</button>
            )}

            {answered && currentIndex + 1 === selectedImages.length && (
              <button onClick={() => setCurrentIndex((i) => i + 1)} className="px-4 py-2 rounded border">Zobacz wynik</button>
            )}

            <button onClick={restart} className="ml-auto px-3 py-2 rounded border">Restart</button>
          </div>

        </section>

        <aside className="bg-gray-50 rounded-lg p-4 shadow">
          <h3 className="font-semibold mb-2">Informacje</h3>
          <p className="text-sm mb-2">Pokazywane są 3 propozycje dla rodzaju i 3 dla koloru. Musisz wybrać prawidłowy rodzaj i kolor.</p>

          <div className="mt-4">
            <p className="font-medium">Twoje wybory:</p>
            <ul className="mt-2 text-sm">
              <li>Rodzaj: <strong>{selectedKind ?? "—"}</strong></li>
              <li>Kolor: <strong>{selectedColor ?? "—"}</strong></li>
            </ul>
          </div>

          <div className="mt-4">
            <p className="font-medium">Wynik tymczasowy:</p>
            <div className="text-xl font-bold">{score} / {currentIndex}</div>
          </div>

          {answered && (
            <div className="mt-4 p-3 rounded border">
              <p className="font-semibold">Odpowiedź:</p>
              <p className="text-sm">Prawidłowy rodzaj: <strong>{current.kind}</strong></p>
              <p className="text-sm">Prawidłowy kolor: <strong>{current.color}</strong></p>
            </div>
          )}

        </aside>
      </main>

      <footer className="mt-6 text-sm text-gray-600">Powodzenia!</footer>
    </div>
  );
}

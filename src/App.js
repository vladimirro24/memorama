import './App.css';
import { useEffect, useState } from 'react';
import Board from './components/Board/Board';

const emojiList = [...'🌍🧤🎩🌮🎱🐼🍕🦖'];

const App = () => {
  const [shuffledMemoBlocks, setShuffledMemoBlocks] = useState([]);
  const [selectedMemoBlock, setSelectedMemoBlock] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    // Check if all memo blocks are matched
    const allMatched = shuffledMemoBlocks.every(block => block.matched);
    if (allMatched) {
      setGameWon(true);
    }
  }, [shuffledMemoBlocks]);

  const startNewGame = () => {
    const shuffledEmojiList = shuffleArray([...emojiList, ...emojiList]);
    setShuffledMemoBlocks(shuffledEmojiList.map((emoji, i) => ({ index: i, emoji, flipped: false, matched: false })));
    setGameWon(false); // Reset the game win status when starting a new game
    setSelectedMemoBlock(null);
  };

  const shuffleArray = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const handleMemoClick = (memoBlock) => {
    if (animating || memoBlock.flipped || gameWon) return;

    const flippedMemoBlock = { ...memoBlock, flipped: true };
    let shuffledMemoBlocksCopy = [...shuffledMemoBlocks];
    shuffledMemoBlocksCopy.splice(memoBlock.index, 1, flippedMemoBlock);
    setShuffledMemoBlocks(shuffledMemoBlocksCopy);

    if (selectedMemoBlock === null) {
      setSelectedMemoBlock(memoBlock);
    } else if (selectedMemoBlock.emoji === memoBlock.emoji) {
      // Match found
      setSelectedMemoBlock(null);
      shuffledMemoBlocksCopy = shuffledMemoBlocksCopy.map(block =>
        block.emoji === memoBlock.emoji ? { ...block, matched: true } : block
      );
      setShuffledMemoBlocks(shuffledMemoBlocksCopy);
    } else {
      setAnimating(true);
      setTimeout(() => {
        // Flip back unmatched cards
        shuffledMemoBlocksCopy.splice(memoBlock.index, 1, { ...memoBlock, flipped: false });
        shuffledMemoBlocksCopy.splice(selectedMemoBlock.index, 1, { ...selectedMemoBlock, flipped: false });
        setShuffledMemoBlocks(shuffledMemoBlocksCopy);
        setSelectedMemoBlock(null);
        setAnimating(false);
      }, 1000);
    }
  };

  return (
    <>
      <div className="instructions">
        <h1>Memorama</h1>
        <p>¡Bienvenido al juego de memorama! Aquí están las instrucciones:</p>
        <ul>
          <li>Haz clic en una carta para darle la vuelta.</li>
          <li>Encuentra el par correspondiente para eliminarlo del tablero.</li>
          <li>El juego termina cuando todos los pares han sido encontrados.</li>
        </ul>
      </div>
      <Board
        memoBlocks={shuffledMemoBlocks}
        animating={animating}
        handleMemoClick={handleMemoClick}
      />
      {gameWon && (
        <div className="victory-container">
          <div className="victory-message">¡Has ganado!</div>
          <button className="restart-button" onClick={startNewGame}>Reiniciar</button>
        </div>
      )}
    </>
  );
};

export default App;

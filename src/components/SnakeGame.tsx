import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';

export const SnakeGame: React.FC<{ onScoreChange: (score: number) => void }> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<string>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    const head = snake[0];
    const newHead = { ...head };

    switch (direction) {
      case 'UP': newHead.y -= 1; break;
      case 'DOWN': newHead.y += 1; break;
      case 'LEFT': newHead.x -= 1; break;
      case 'RIGHT': newHead.x += 1; break;
    }

    // Check collisions
    if (
      newHead.x < 0 || newHead.x >= GRID_SIZE ||
      newHead.y < 0 || newHead.y >= GRID_SIZE ||
      snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
    ) {
      setGameOver(true);
      setIsPaused(true);
      return;
    }

    const newSnake = [newHead, ...snake];

    // Check food
    if (newHead.x === food.x && newHead.y === food.y) {
      const newScore = score + 10;
      setScore(newScore);
      onScoreChange(newScore);
      setFood(generateFood(newSnake));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, isPaused, score, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(prev => !prev); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, 150);
    } else {
      if (gameLoopRef.current) window.clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) window.clearInterval(gameLoopRef.current);
    };
  }, [isPaused, gameOver, moveSnake]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div 
        className="grid bg-[#0a0a0a] glitch-border overflow-hidden relative"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 400px)',
        }}
      >
        {/* CRT Overlay */}
        <div className="absolute inset-0 crt-lines z-20" />
        <div className="absolute inset-0 static-bg z-10" />
        <div className="scanline" />

        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(s => s.x === x && s.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`w-full h-full border-[0.5px] border-glitch-cyan/10 ${
                isHead ? 'bg-glitch-cyan shadow-[0_0_10px_#00ffff]' : 
                isSnake ? 'bg-glitch-cyan/40' : 
                isFood ? 'bg-glitch-magenta shadow-[0_0_15px_#ff00ff] animate-pulse' : ''
              }`}
            />
          );
        })}

        {(gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 border-2 border-glitch-magenta">
            {gameOver ? (
              <>
                <h2 className="text-4xl font-bold text-glitch-magenta glitch-text mb-4 uppercase tracking-tighter">GAME OVER</h2>
                <p className="text-xl mb-6 text-glitch-cyan">SCORE: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-8 py-3 bg-glitch-cyan text-black font-bold border-2 border-glitch-magenta hover:bg-glitch-magenta hover:text-white transition-all uppercase tracking-widest"
                >
                  RETRY_PROCESS
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-glitch-cyan glitch-text mb-4 uppercase tracking-tighter">PAUSED</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-3 bg-glitch-magenta text-black font-bold border-2 border-glitch-cyan hover:bg-glitch-cyan hover:text-white transition-all uppercase tracking-widest"
                >
                  RESUME_GAME
                </button>
                <p className="mt-4 text-xs text-glitch-cyan/60 italic uppercase tracking-widest">INPUT: [SPACE] TO TOGGLE</p>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 flex gap-4 text-xs text-glitch-cyan/50 uppercase tracking-[0.2em]">
        <span>CMD: ARROWS_NAV</span>
        <span>|</span>
        <span>CMD: SPACE_PAUSE</span>
      </div>
    </div>
  );
};

import './startScreen.css';

export default function StartScreen({ startGame, started, startScreenRef }) {
    return (
            <div
              ref={startScreenRef}
              className= {!started ? "startScreen" : "hide"}
              tabIndex={0}
              onClick={startGame}
            >
              <div>
                <p>Press any key to start</p>
                <p>Space =&gt; forward</p>
                <p>Arrow keys =&gt; direction</p>
              </div>
            </div>
    )
}
export default function StartScreen({ startGame, started, startScreenRef }) {
    return (
            <div
              ref={startScreenRef}
              className= {!started ? "startScreen" : "hide"}
              tabIndex={0}
              onClick={startGame}
            >
              Press any key to start
            </div>
    )
}
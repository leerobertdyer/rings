import './lostScreen.css';

export default function LostScreen() {
    return (
        <div className="lostScreen">
            <h1>Game Over</h1>
            <button className="tryAgainButton" onClick={() => window.location.reload()}>Try Again</button>
        </div>
    );
}

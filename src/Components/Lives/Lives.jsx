import "./lives.css";

export default function Lives({ lives }) {
    return (
        <div className="lives">
            {Array.from({ length: lives }).map((_, i) => (
                <div key={i} className="life" />
            ))}
        </div>
    )
}
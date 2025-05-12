export default function WinScreen({ won }) {
    return (
        <div className={won ? "winMessage" : "hide"}>You win!</div>
    )
}
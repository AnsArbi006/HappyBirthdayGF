const targetBirthday = new Date("2026-07-06T00:00:00+02:00");
const countdownChip = document.getElementById("countdown-chip");

function formatCountdown(distance) {
    if (distance <= 0) {
        return "Heute ist es soweit: Alles Gute zum Geburtstag, Zehra.";
    }

    const totalSeconds = Math.floor(distance / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `Noch ${days}T ${hours}Std ${minutes}Min ${seconds}Sek bis zum 6. Juli`;
}

function updateCountdown() {
    const now = new Date();
    const distance = targetBirthday.getTime() - now.getTime();
    countdownChip.textContent = formatCountdown(distance);
}

window.addEventListener("load", () => {
    gsap.from(".hero-card", { opacity: 0, y: 28, duration: 0.9, ease: "power3.out" });
    gsap.from(".preview-card", { opacity: 0, y: 34, duration: 0.9, delay: 0.15, ease: "power3.out" });
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
});

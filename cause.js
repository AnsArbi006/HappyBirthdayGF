const birthdayDate = new Date("2026-07-06T00:00:00+02:00");
const releaseStart = new Date("2026-06-28T00:00:00+02:00");
const storageKey = "zehraBirthdayUnlockStateV1";

const moments = [
    {
        title: "Tag 1",
        unlockDate: "2026-06-28",
        caption: "Bahnhofsmoment",
        photo: "zehra-day-1.jpg",
        text: "Ich bin froh, dass du in meinem Leben bist. Du bist einfach mein Lieblingsmensch und selbst ein normaler Moment mit dir fühlt sich besonders an."
    },
    {
        title: "Tag 2",
        unlockDate: "2026-06-29",
        caption: "Nächstes Foto kommt",
        photo: "",
        text: "Auch wenn du mir manchmal wirklich auf die Nerven gehst, liebe ich selbst genau das an dir, weil es zeigt, wie sehr du zu meinem Alltag gehörst und wie besonders selbst unsere kleinen Momente für mich sind."
    },
    {
        title: "Tag 3",
        unlockDate: "2026-06-30",
        caption: "Nächstes Foto kommt",
        photo: "",
        text: "Du bist einer der schönsten Zufälle, die mir je passiert sind, weil wir eigentlich die ganze Zeit so nah beieinander waren und uns trotzdem erst genau dann gefunden haben, als der richtige Moment dafür da war."
    },
    {
        title: "Tag 4",
        unlockDate: "2026-07-01",
        caption: "Nächstes Foto kommt",
        photo: "",
        text: "Auch wenn du manchmal an deinen Kochkünsten zweifelst, freue ich mich jedes Mal auf dein Essen, weil man spürt, dass es von dir kommt, und es für mich dadurch jedes Mal besonders und einfach unglaublich lecker ist."
    },
    {
        title: "Tag 5",
        unlockDate: "2026-07-02",
        caption: "Nächstes Foto kommt",
        photo: "",
        text: "Selbst wenn wir gar nichts Großes machen und einfach nur zusammen zu Hause sind, fühlt sich genau das für mich schön an, weil es nicht darauf ankommt, was wir machen, sondern dass ich diese Zeit mit dir verbringen darf."
    },
    {
        title: "Tag 6",
        unlockDate: "2026-07-03",
        caption: "Nächstes Foto kommt",
        photo: "",
        text: "Ich freue mich jetzt schon auf all die Jahre, die noch vor uns liegen, und ich weiß tief in mir, dass du irgendwann eine wundervolle Mutter sein wirst, weil du so viel Herz, Wärme und Liebe in dir trägst."
    },
    {
        title: "Tag 7",
        unlockDate: "2026-07-04",
        caption: "Nächstes Foto kommt",
        photo: "",
        text: "Auch wenn du manchmal an dir selbst zweifelst, sehe ich in dir so viele schöne Dinge, die du selbst vielleicht gar nicht immer bemerkst, und genau deshalb wünsche ich mir, dass du dich eines Tages mit meinen Augen sehen kannst."
    },
    {
        title: "Tag 8",
        unlockDate: "2026-07-05",
        caption: "Nächstes Foto kommt",
        photo: "",
        text: "Je näher dein Geburtstag kommt, desto mehr denke ich daran, wie froh ich bin, dass es dich gibt."
    },
    {
        title: "Geburtstag",
        unlockDate: "2026-07-06",
        caption: "Dein Tag",
        photo: "zehra-day-1.jpg",
        text: "Heute geht es nur um dich. Alles Gute zum Geburtstag, Zehra. Ich hoffe, dein neuer Lebensabschnitt fühlt sich genauso schön an, wie du ihn für andere machst."
    }
];

const countdownValue = document.getElementById("countdown-value");
const statusCard = document.getElementById("status-card");
const unlockButton = document.getElementById("unlock-button");
const progressLabel = document.getElementById("progress-label");
const todayLabel = document.getElementById("today-label");
const momentsGrid = document.getElementById("moments-grid");
const template = document.getElementById("moment-template");

function todayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function readState() {
    const fallback = { unlockedCount: 0, lastUnlockDate: null };
    try {
        const raw = localStorage.getItem(storageKey);
        return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
    } catch {
        return fallback;
    }
}

function writeState(state) {
    localStorage.setItem(storageKey, JSON.stringify(state));
}

function getAvailableCount(now = new Date()) {
    const count = moments.filter((moment) => {
        const unlockDate = new Date(`${moment.unlockDate}T00:00:00+02:00`);
        return unlockDate.getTime() <= now.getTime();
    }).length;

    return Math.max(0, Math.min(count, moments.length));
}

function getNextUnlockDate(now = new Date()) {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
}

function formatRemaining(distance) {
    if (distance <= 0) {
        return "Heute ist Zehras Geburtstag. Die komplette Seite ist jetzt offen.";
    }

    const totalSeconds = Math.floor(distance / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days} Tage, ${hours} Std, ${minutes} Min, ${seconds} Sek`;
}

function formatWait(target) {
    return target.toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function getPlaceholderImage(text) {
    const label = encodeURIComponent(text);
    return `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1000'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23ead7c2'/%3E%3Cstop offset='1' stop-color='%23d1b49d'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='1000' fill='url(%23g)'/%3E%3Ccircle cx='140' cy='160' r='60' fill='%23f7ead8' fill-opacity='.75'/%3E%3Ccircle cx='620' cy='820' r='90' fill='%23fff7ee' fill-opacity='.45'/%3E%3Ctext x='400' y='480' font-family='Georgia' font-size='48' text-anchor='middle' fill='%23614a3e'%3ENoch ein Foto%3C/text%3E%3Ctext x='400' y='550' font-family='Georgia' font-size='36' text-anchor='middle' fill='%23614a3e'%3E${label}%3C/text%3E%3C/svg%3E`;
}

function renderMoments() {
    const state = readState();
    const availableCount = getAvailableCount();
    momentsGrid.innerHTML = "";

    moments.forEach((moment, index) => {
        const node = template.content.firstElementChild.cloneNode(true);
        const image = node.querySelector(".moment-image");
        const caption = node.querySelector(".photo-caption");
        const day = node.querySelector(".moment-day");
        const title = node.querySelector(".moment-title");
        const text = node.querySelector(".moment-text");
        const unlocked = index < state.unlockedCount;
        const available = index < availableCount;

        node.classList.toggle("locked", !unlocked);
        day.textContent = available ? `Freigeschaltet ab ${moment.unlockDate}` : `Wird freigeschaltet am ${moment.unlockDate}`;
        title.textContent = unlocked ? moment.title : "Noch gesperrt";
        caption.textContent = unlocked ? moment.caption : "Wartet noch auf dich";
        text.textContent = unlocked
            ? moment.text
            : available
                ? "Dieser Moment ist heute verfügbar. Klick links auf den Button, um ihn freizuschalten."
                : "Dieser Moment öffnet sich automatisch an seinem Tag.";

        image.src = unlocked
            ? (moment.photo || getPlaceholderImage(moment.caption))
            : getPlaceholderImage(moment.unlockDate);
        image.alt = unlocked ? moment.caption : "Gesperrter Moment";

        momentsGrid.appendChild(node);
    });

    progressLabel.textContent = `${state.unlockedCount} von ${moments.length} freigeschaltet`;
    todayLabel.textContent = availableCount >= moments.length
        ? "Alles verfügbar"
        : `Heute maximal ${availableCount} offen`;
}

function syncStatus() {
    const now = new Date();
    const state = readState();
    const availableCount = getAvailableCount(now);
    const canUnlockToday = state.lastUnlockDate !== todayKey(now) && state.unlockedCount < availableCount;
    const birthdayReached = now.getTime() >= birthdayDate.getTime();

    if (birthdayReached) {
        statusCard.textContent = "Heute ist Zehras Geburtstag. Alle Momente können jetzt direkt hier geöffnet werden.";
    } else if (canUnlockToday) {
        statusCard.textContent = `Heute wartet ${availableCount - state.unlockedCount} neuer Moment auf dich. Du kannst jetzt genau einen freischalten.`;
    } else if (state.unlockedCount >= availableCount) {
        statusCard.textContent = `Der heutige Moment wurde schon geöffnet. Der nächste wartet ab ${formatWait(getNextUnlockDate(now))}.`;
    } else {
        statusCard.textContent = "Heute ist noch nichts freigegeben. Schau später wieder rein.";
    }

    unlockButton.disabled = !canUnlockToday && !(birthdayReached && state.unlockedCount < moments.length);
    unlockButton.textContent = birthdayReached
        ? "Alle Momente öffnen"
        : canUnlockToday
            ? "Heutigen Moment öffnen"
            : "Morgen wieder da";
}

function unlockMoment() {
    const now = new Date();
    const state = readState();
    const availableCount = getAvailableCount(now);
    const birthdayReached = now.getTime() >= birthdayDate.getTime();

    if (birthdayReached) {
        state.unlockedCount = moments.length;
        state.lastUnlockDate = todayKey(now);
        writeState(state);
        renderMoments();
        syncStatus();
        return;
    }

    if (state.lastUnlockDate === todayKey(now) || state.unlockedCount >= availableCount) {
        syncStatus();
        return;
    }

    state.unlockedCount += 1;
    state.lastUnlockDate = todayKey(now);
    writeState(state);
    renderMoments();
    syncStatus();

    gsap.from(".moment-card:not(.locked):last-child", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power3.out"
    });
}

function updateCountdown() {
    const distance = birthdayDate.getTime() - Date.now();
    countdownValue.textContent = formatRemaining(distance);
}

window.addEventListener("load", () => {
    const initialState = readState();
    if (new Date().getTime() < releaseStart.getTime() && initialState.unlockedCount !== 0) {
        writeState({ unlockedCount: 0, lastUnlockDate: null });
    }

    renderMoments();
    syncStatus();
    updateCountdown();

    gsap.from(".intro-card", { opacity: 0, y: 26, duration: 0.9, ease: "power3.out" });
    gsap.from(".content-card", { opacity: 0, y: 34, duration: 0.9, delay: 0.12, ease: "power3.out" });

    unlockButton.addEventListener("click", unlockMoment);
    window.setInterval(updateCountdown, 1000);
});

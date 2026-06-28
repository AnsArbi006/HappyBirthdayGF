const birthdayDate = new Date("2026-07-06T00:00:00+02:00");
const releaseStart = new Date("2026-06-28T00:00:00+02:00");
const storageKey = "zehraBirthdayUnlockStateV1";

const moments = [
    {
        title: "Tag 1",
        unlockDate: "2026-06-28",
        caption: "Bahnhofsmoment",
        photo: "zehra-day-1.jpg",
        text: "Dein Blick, sogar wenn du genervt schaust, ist fuer mich immer noch einer meiner liebsten Anblicke. Mit dir wird selbst ein normaler Moment besonders."
    },
    {
        title: "Tag 2",
        unlockDate: "2026-06-29",
        caption: "Naechstes Foto kommt",
        photo: "",
        text: "Du hast eine Art, alles waermer wirken zu lassen. Selbst an chaotischen Tagen bringst du Ruhe rein."
    },
    {
        title: "Tag 3",
        unlockDate: "2026-06-30",
        caption: "Naechstes Foto kommt",
        photo: "",
        text: "Ich liebe, wie echt du bist. Nichts an dir fuehlt sich gespielt an und genau das macht dich so besonders."
    },
    {
        title: "Tag 4",
        unlockDate: "2026-07-01",
        caption: "Naechstes Foto kommt",
        photo: "",
        text: "Du bist schoen auf eine Weise, die nicht laut sein muss. Man merkt es einfach sofort, wenn man bei dir ist."
    },
    {
        title: "Tag 5",
        unlockDate: "2026-07-02",
        caption: "Naechstes Foto kommt",
        photo: "",
        text: "Mit dir fuehlen sich Erinnerungen immer staerker an. Du machst aus Kleinigkeiten etwas, das bleibt."
    },
    {
        title: "Tag 6",
        unlockDate: "2026-07-03",
        caption: "Naechstes Foto kommt",
        photo: "",
        text: "Ich mag, wie viel Herz du in dir hast. Du zeigst nicht immer alles, aber man spuert es in jedem Detail."
    },
    {
        title: "Tag 7",
        unlockDate: "2026-07-04",
        caption: "Naechstes Foto kommt",
        photo: "",
        text: "Du hast diese seltene Mischung aus stark und weich. Genau das macht dich fuer mich so unvergesslich."
    },
    {
        title: "Tag 8",
        unlockDate: "2026-07-05",
        caption: "Naechstes Foto kommt",
        photo: "",
        text: "Je naeher dein Geburtstag kommt, desto mehr denke ich daran, wie froh ich bin, dass es dich gibt."
    },
    {
        title: "Geburtstag",
        unlockDate: "2026-07-06",
        caption: "Dein Tag",
        photo: "zehra-day-1.jpg",
        text: "Heute geht es nur um dich. Alles Gute zum Geburtstag, Zehra. Ich hoffe, dein neuer Lebensabschnitt fuehlt sich genauso schoen an, wie du ihn fuer andere machst."
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
                ? "Dieser Moment ist heute verfuegbar. Klick links auf den Button, um ihn freizuschalten."
                : "Dieser Moment oeffnet sich automatisch an seinem Tag.";

        image.src = unlocked
            ? (moment.photo || getPlaceholderImage(moment.caption))
            : getPlaceholderImage(moment.unlockDate);
        image.alt = unlocked ? moment.caption : "Gesperrter Moment";

        momentsGrid.appendChild(node);
    });

    progressLabel.textContent = `${state.unlockedCount} von ${moments.length} freigeschaltet`;
    todayLabel.textContent = availableCount >= moments.length
        ? "Alles verfuegbar"
        : `Heute maximal ${availableCount} offen`;
}

function syncStatus() {
    const now = new Date();
    const state = readState();
    const availableCount = getAvailableCount(now);
    const canUnlockToday = state.lastUnlockDate !== todayKey(now) && state.unlockedCount < availableCount;
    const birthdayReached = now.getTime() >= birthdayDate.getTime();

    if (birthdayReached) {
        statusCard.textContent = "Heute ist Zehras Geburtstag. Alle Momente koennen jetzt geoeffnet werden und die Geburtstagsseite ist komplett bereit.";
    } else if (canUnlockToday) {
        statusCard.textContent = `Heute wartet ${availableCount - state.unlockedCount} neuer Moment auf dich. Du kannst jetzt genau einen freischalten.`;
    } else if (state.unlockedCount >= availableCount) {
        statusCard.textContent = `Der heutige Moment wurde schon geoeffnet. Der naechste wartet ab ${formatWait(getNextUnlockDate(now))}.`;
    } else {
        statusCard.textContent = "Heute ist noch nichts freigegeben. Schau spaeter wieder rein.";
    }

    unlockButton.disabled = !canUnlockToday && !(birthdayReached && state.unlockedCount < moments.length);
    unlockButton.textContent = birthdayReached
        ? "Restliche Momente freischalten"
        : canUnlockToday
            ? "Heutigen Moment oeffnen"
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

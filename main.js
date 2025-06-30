const countdownEls = document.querySelectorAll(".countdown");
countdownEls.forEach(countdownEl => createCountdown(countdownEl));

function createCountdown(countdownEl) {
  const target = new Date(countdownEl.dataset.targetDate);

  const parts = {
    days: { text: ["days", "day"], dots: 30 },
    hours: { text: ["hours", "hour"], dots: 24 },
    minutes: { text: ["minutes", "minute"], dots: 60 },
    seconds: { text: ["seconds", "second"], dots: 60 },
  };

  Object.entries(parts).forEach(([key, value]) => {
    const partEl = document.createElement("div");
    partEl.classList.add("part", key);
    partEl.style.setProperty("--dots", value.dots);
    value.element = partEl;

    const remainingEl = document.createElement("div");
    remainingEl.classList.add("remaining");
    remainingEl.innerHTML = `
      <span class="number">0</span>
      <span class="text">${value.text[0]}</span>
    `;
    partEl.append(remainingEl);

    // ✅ Círculos con transform clásico compatible con OBS
    for (let i = 0; i < value.dots; i++) {
      const dotContainerEl = document.createElement("div");
      const angle = (360 / value.dots) * i;
      dotContainerEl.style.transform = `rotate(${angle}deg)`;
      dotContainerEl.classList.add("dot-container");

      const dotEl = document.createElement("div");
      dotEl.classList.add("dot");
      dotContainerEl.append(dotEl);

      partEl.append(dotContainerEl);
    }

    countdownEl.append(partEl);
  });

  getRemainingTime(target, parts);
}

function getRemainingTime(target, parts) {
  const now = new Date();
  let seconds = Math.floor((target - now) / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  hours = hours % 24;
  minutes = minutes % 60;
  seconds = seconds % 60;

  Object.entries({ days, hours, minutes, seconds }).forEach(([key, value]) => {
    const numberEl = parts[key].element.querySelector(".number");
    const textEl = parts[key].element.querySelector(".text");
    numberEl.textContent = value;
    textEl.textContent = parts[key].text[Number(value === 1)];

    const dots = parts[key].element.querySelectorAll(".dot");
    dots.forEach((dot, idx) => {
      dot.dataset.active = idx <= value;
      dot.dataset.lastactive = idx === value;
    });
  });

  if (now <= target) {
    requestAnimationFrame(() => getRemainingTime(target, parts));
  }
}
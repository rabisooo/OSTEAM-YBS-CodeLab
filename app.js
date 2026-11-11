// Görevler artık Express API'den (week5-api) yüklenecek.
const API_URL = "http://localhost:3000/api/events";

let tasks = [];

const list = document.querySelector("#task-list");
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const dateInput = document.querySelector("#date-input");
const error = document.querySelector("#error");
const statusText = document.querySelector("#task-status");

// MIS Topluluğu için sayaç başlığı
const taskSection = list.parentElement;

let counterEl = document.querySelector("#task-counter");

if (!counterEl) {
    counterEl = document.createElement("p");
    counterEl.id = "task-counter";
    counterEl.style.fontSize = "0.9rem";
    counterEl.style.color = "#6c757d";
    taskSection.insertBefore(counterEl, list);
}

// Görevleri ekrana yazdırma
function render() {
    list.innerHTML = "";

    // Sayaç güncellemesi
    const remaining = tasks.filter(t => !t.done).length;

    counterEl.textContent =
        `Aktif Görev Sayısı: ${remaining} | Toplam: ${tasks.length}`;

    for (const task of tasks) {
        const li = document.createElement("li");
        li.dataset.id = task.id;

        // Görev metni
        const span = document.createElement("span");
        span.textContent = `${task.title} - ${task.date}`;

        if (task.done) {
            span.classList.add("done");
        }

        li.append(span);

        // Silme butonu
        const btn = document.createElement("button");
        btn.textContent = "Sil";
        btn.className = "delete";

        li.append(btn);
        list.append(li);
    }
}

// API'den görevleri yükleme (GET)
async function loadTasks() {
    statusText.textContent = "Görevler yükleniyor...";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        tasks = await response.json();

        if (!Array.isArray(tasks)) {
            throw new Error("API'den gelen veri bir liste olmalıdır.");
        }

        render();

        if (tasks.length === 0) {
            statusText.textContent = "Henüz görev bulunmuyor.";
        } else {
            statusText.textContent = "Görevler başarıyla yüklendi.";
        }

    } catch (err) {
        statusText.textContent =
            "Veriler yüklenemedi (server çalışıyor mu?): " + err.message;

        render();
    }
}

// Yeni görev ekleme (POST)
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = input.value.trim();
    const date = dateInput.value;

    if (title === "" || date === "") {
        error.textContent =
            "Lütfen geçerli bir etkinlik veya görev ve tarih yazın.";
        return;
    }

    error.textContent = "";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title, date: date })
        });

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        tasks.push(await response.json());

        input.value = "";
        dateInput.value = "";

        render();
        statusText.textContent = "";

    } catch (err) {
        error.textContent = "Görev eklenemedi: " + err.message;
    }
});

// Görev silme (DELETE) ve tamamlandı durumunu değiştirme (PUT)
list.addEventListener("click", async (event) => {
    const li = event.target.closest("li");

    if (!li) return;

    const id = Number(li.dataset.id);

    try {
        if (event.target.matches(".delete")) {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            // Görevi sil
            tasks = tasks.filter(t => t.id !== id);

        } else {
            // Görevin tamamlanma durumunu değiştir
            const task = tasks.find(t => t.id === id);

            if (task) {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ done: !task.done })
                });

                if (!response.ok) {
                    throw new Error("HTTP " + response.status);
                }

                task.done = !task.done;
            }
        }

        render();

    } catch (err) {
        statusText.textContent = "İşlem yapılamadı: " + err.message;
    }
});

// Sayfa açıldığında görevleri yükle
loadTasks();
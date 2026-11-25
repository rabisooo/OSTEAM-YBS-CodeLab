// Görevler artık Express REST API üzerinden yüklenecek ve kaydedilecek.
const API_URL = "http://localhost:3000/api/tasks";
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

// Sunucudan gelen görev nesnesini normalize et
function normalizeTask(task) {
    const isDone = Boolean(task.done ?? task.completed);
    return {
        ...task,
        done: isDone,
        completed: isDone
    };
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

        // Görev metni (tarih varsa ekle)
        const span = document.createElement("span");
        span.textContent = task.date ? `${task.title} - ${task.date}` : task.title;

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

// API üzerinden görevleri yükleme (GET)
async function loadTasks() {
    statusText.textContent = "Görevler yükleniyor...";
    error.textContent = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("API yanıtı bir liste olmalıdır.");
        }

        tasks = data.map(normalizeTask);
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
    const date = dateInput ? dateInput.value : "";

    if (title === "") {
        error.textContent =
            "Lütfen geçerli bir etkinlik veya görev yazın.";
        return;
    }

    error.textContent = "";
    statusText.textContent = "Görev ekleniyor...";

    const payload = date ? { title, date } : { title };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const created = normalizeTask(await response.json());
        tasks.push(created);

        input.value = "";
        if (dateInput) {
            dateInput.value = "";
        }

        render();
        statusText.textContent = "Görev eklendi.";
    } catch (err) {
        error.textContent = "Görev eklenemedi: " + err.message;
        statusText.textContent = "";
    }
});

// Görev silme (DELETE) ve tamamlandı durumunu değiştirme (PUT)
list.addEventListener("click", async (event) => {
    const li = event.target.closest("li");

    if (!li) return;

    const id = Number(li.dataset.id);
    error.textContent = "";

    try {
        if (event.target.matches(".delete")) {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            tasks = tasks.filter(t => t.id !== id);
            render();
            statusText.textContent = "Görev silindi.";
        } else {
            const task = tasks.find(t => t.id === id);
            if (!task) return;

            const nextDone = !task.done;

            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    done: nextDone,
                    completed: nextDone
                })
            });

            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            const updated = normalizeTask(await response.json());
            tasks = tasks.map(t => (t.id === id ? updated : t));
            render();
            statusText.textContent = "Görev durumu güncellendi.";
        }
    } catch (err) {
        error.textContent = "İşlem başarısız: " + err.message;
    }
});

// Sayfa açıldığında görevleri yükle
loadTasks();
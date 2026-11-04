// Görevler artık data.json dosyasından yüklenecek.
let tasks = [];

const list = document.querySelector("#task-list");
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
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
        span.textContent = task.title;

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

// JSON dosyasından görevleri yükleme
async function loadTasks() {
    statusText.textContent = "Görevler yükleniyor...";

    try {
        const response = await fetch("./data.json");

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        tasks = await response.json();

        if (!Array.isArray(tasks)) {
            throw new Error("JSON dosyasındaki veri bir liste olmalıdır.");
        }

        render();

        if (tasks.length === 0) {
            statusText.textContent = "Henüz görev bulunmuyor.";
        } else {
            statusText.textContent = "Görevler başarıyla yüklendi.";
        }

    } catch (err) {
        statusText.textContent =
            "Veriler yüklenemedi: " + err.message;

        render();
    }
}

// Yeni görev ekleme
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = input.value.trim();

    if (title === "") {
        error.textContent =
            "Lütfen geçerli bir etkinlik veya görev yazın.";
        return;
    }

    error.textContent = "";

    tasks.push({
        id: Date.now(),
        title: title,
        done: false
    });

    input.value = "";

    render();
    statusText.textContent = "";
});

// Görev silme ve tamamlandı durumunu değiştirme
list.addEventListener("click", (event) => {
    const li = event.target.closest("li");

    if (!li) return;

    const id = Number(li.dataset.id);

    if (event.target.matches(".delete")) {
        // Görevi sil
        tasks = tasks.filter(t => t.id !== id);

    } else {
        // Görevin tamamlanma durumunu değiştir
        const task = tasks.find(t => t.id === id);

        if (task) {
            task.done = !task.done;
        }
    }

    render();
});

// Sayfa açıldığında görevleri yükle
loadTasks();
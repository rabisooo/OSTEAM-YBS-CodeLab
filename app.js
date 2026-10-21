let tasks = [
    { id: 1, title: "Python Atölyesi Planlaması", done: false },
    { id: 2, title: "Web Dev Bootcamp Kayıtları", done: true }
];

const list = document.querySelector("#task-list");
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const error = document.querySelector("#error");

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

function render() {
    list.innerHTML = "";
    
    // Sayaç güncellemesi
    const remaining = tasks.filter(t => !t.done).length;
    counterEl.textContent = `Aktif Görev Sayısı: ${remaining} | Toplam: ${tasks.length}`;

    for (const task of tasks) {
        const li = document.createElement("li");
        li.dataset.id = task.id; // Event delegation için ID'yi li etiketine veriyoruz[cite: 25]

        // Metin alanı
        const span = document.createElement("span");
        span.textContent = task.title;
        if (task.done) span.classList.add("done");
        li.append(span);

        // Silme Butonu
        const btn = document.createElement("button");
        btn.textContent = "Sil";
        btn.className = "delete";
        li.append(btn);

        list.append(li);
    }
}

// Yeni görev ekleme (Form Submit)[cite: 32]
form.addEventListener("submit", (event) => {
    event.preventDefault(); //[cite: 25, 32]
    const title = input.value.trim();

    if (title === "") {
        error.textContent = "Lütfen geçerli bir etkinlik veya görev yazın.";
        return;
    }

    error.textContent = "";
    tasks.push({ id: Date.now(), title: title, done: false }); //[cite: 31]
    input.value = "";
    render();
});

// Event Delegation ile tıklama yönetimi (Silme ve Tamamlandı yapma)[cite: 25, 34]
list.addEventListener("click", (event) => {
    const li = event.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);

    if (event.target.matches(".delete")) {
        // Silme işlemi[cite: 33, 34]
        tasks = tasks.filter(t => t.id !== id);
    } else {
        // Üzerine tıklayınca tamamlandı durumunu değiştir[cite: 33, 34]
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.done = !task.done;
        }
    }
    render();
});

// Sayfa ilk açıldığında listeyi çiz[cite: 30, 31]
render();
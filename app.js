let tasks = [
    { id: 1, title: "Python Workshop", done: false },
    { id: 2, title: "Web Dev Bootcamp", done: true }
];

const list = document.querySelector("#task-list");

function render() {
    list.innerHTML = "";
    for (const task of tasks) {
        const li = document.createElement("li");
        li.textContent = task.title;
        li.dataset.id = task.id;
        if (task.done) li.classList.add("done");
        list.append(li);
    }
}

render();
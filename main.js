const input = document.querySelector('#inputContent')
const taskBox = document.querySelector('.taskBox')
// localStorage.clear()
function createStorage(key) {
    const store = JSON.parse(localStorage.getItem(key)) ?? []

    const save = () => {
        localStorage.setItem(key, JSON.stringify(store))
    }
    const storage = {
        add(newData) {
            store.push(newData)
            save()
        },
        remove(index) {
            store.splice(index, 1)
            save()
        },
        edit(index, newData) {
            store[index] = newData
            save()
        },
        get() {
            return store
        }
    }
    return storage
}
const todos = createStorage('todoList')
let totalIndex = todos.get().length
//Rendering Task in Local Storage
if (totalIndex > 0) {
    todos.get().forEach(todo => addNewTask(todo))
}
//Event listeners for input
input.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        //Check value input
        if (e.target.value) {
            //Check Task Exists
            if (todos.get().indexOf(todos.get().find((value) => value.text == e.target.value)) != -1) {
                alert('This task still exists')
            } else {
                addNewTask(e.target.value)
                e.target.value = ''
            }

        } else {
            alert('Please enter your task')
        }
    }
})
function addNewTask(todo) {
    let newTask
    let todoText
    //Check todo (rendering when start client or typing input)
    if (typeof todo === 'string') {
        todoText = input.value
        newTask = createTask(todoText)
        todos.add({
            text: newTask.innerText,
            isDone: newTask.classList.contains('done')
        })
    } else {
        todoText = todo.text
        newTask = createTask(todoText, todo.isDone)
    }
    taskBox.appendChild(newTask)
}
//Create Task and addEventListerner
function createTask(text, isDone) {
    const li = document.createElement('li')
    li.className = 'taskItem'
    li.innerText = text
    if (arguments.length > 1) {
        if (isDone) {
            li.classList.add('done')
        }
    }
    li.addEventListener('contextmenu', (e) => e.preventDefault())
    li.addEventListener('mousedown', (e) => {
        let indexCurrent = todos.get().indexOf(todos.get().find((value) => value.text == li.innerText))
        switch (e.which) {
            case 1:
                e.target.classList.toggle('done')
                todos.edit(indexCurrent, {
                    text: li.innerText,
                    isDone: li.classList.contains('done')
                })
                break;
            case 3:
                todos.remove(indexCurrent)
                e.target.remove()
                break;
            default:
        }
    })
    return li
}

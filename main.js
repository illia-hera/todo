class TodoApp {
  execute() {
    const store = new StoreLS();
    
    const taskManager = new TaskManager(store);
    const render = new Render();
    const toDo = new TODO(taskManager, render);
    const titleInputRef = document.getElementById("task-title");
    const createTaskBtnRef = document.getElementById("task-create-button");
    const debugBtnRef = document.getElementById("task-debug-button");

    createTaskBtnRef.addEventListener('click', () => {
      toDo.addTask(titleInputRef.value);
    });

    debugBtnRef.addEventListener('click', () => {
      toDo.init();
    });

    toDo.init()
  }
}

class TODO{
  constructor(taskManager, render){
    this._taskManager = taskManager;
    this._render = render;
  }

  init(){
    const tasks = this._taskManager.getTasks();
    tasks.forEach(task => {
      this._render.renderTask(task);
    });
  }

  addTask(title){
    const task = this._taskManager.createTask(title);
    this._render.renderTask(task);
  }
}

class TaskManager {
  constructor(store){
      this._store = store;
  }
  getTasks(){
    return this._store.getTasks();
  }
  createTask(title){
    const id = Math.random().toString(36).substr(2, 16);
    const task = new Task(id, title);
    return this._store.saveTask(task);
  }

}

class Task {
  constructor(id,
    title,
    isDone = false,
    creationMoment = Date.now()
    ){
    this._id = id;
    this._title = title;
    this._isDone = isDone;
    this._creationMoment = creationMoment;
  }

  get id (){
    return this._id
  }
  get title (){
    return this._title
  }
  get isDone (){
    return this._isDone
  }
  get creationMoment (){
    return this._creationMoment
  }
  toggle(){
    this._isDone = !this._isDone;
  }

  static toJSON(task){
    return JSON.stringify({
      id:  task.id,
      title:  task.title,
      isDone:  task.isDone,
      creationMoment: task.creationMoment
    })
  }

  static fromJSON(json) {
    const obj = JSON.parse(json);
    return new Task(
      obj.id,
      obj.title,
      obj.isDone,
      obj.creationMoment
    );
    
  }
}

class Render {
  renderTask(task){
    console.log(task);
  }
}

class AbstractStore {
  getTasks(){
    throw new Error('not implemented')
  }
  saveTasks(task){
    throw new Error('not implemented')
  }
}

class Store extends AbstractStore {
  constructor(){
    super();
    this._store = [];
  }
  getTasks() {
    return this._store
    .map(task => Task.fromJSON(Task.toJSON(task)))
  }
  saveTask (task){
    this._store.push(task);
    return task;
  }
}

class StoreLS extends AbstractStore {
  constructor(){
    super();
    this.prefix = 'strLS'
  }

  getTasks(){
    const tasks = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      
      if(key.includes(this._prefix)) {
        const task = Task.fromJSON(localStorage.getItem(key));
        tasks.push(task);
      }
    }
    return tasks;
  }

  saveTask(task) {
    const key = `${this.prefix}${task.id}`;
    const json = Task.toJSON(task);
    localStorage.setItem(key, json);
    return Task.fromJSON(localStorage.getItem(key));
  }
}



const app = new TodoApp();
app.execute();
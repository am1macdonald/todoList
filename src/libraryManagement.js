import { compareAsc, parseISO } from 'date-fns';
import Project from './projectClass.js';
import Task from './taskClass.js';

export const taskLibrary = (() => {
    let arr = [    
      {"title":"6 task","description":"More stuff","dueDate":"2026-12-30","priority":"1","notes":"","checklist":{},"identifier":16408544564564},      
      {"title":"3","description":"123123","dueDate":"2023-12-30","priority":"1","notes":"","checklist":{},"identifier":1640854693381},
      {"title":"4","description":"1231231231","dueDate":"2024-12-30","priority":"1","notes":"","checklist":{},"identifier":1640854696682},
      {"title":"7","description":"123123","dueDate":"2027-12-30","priority":"1","notes":"","checklist":{},"identifier":1640854645645645},
      {"title":"5 task","description":"stuff","dueDate":"2025-12-30","priority":"1","notes":"","checklist":{},"identifier":164085464564564},      
      {"title":"second task","description":"More stuff","dueDate":"2022-12-30","priority":"1","notes":"","checklist":{},"identifier":1640854644789},
      {"title":"8","description":"1231231231","dueDate":"2028-12-30","priority":"1","notes":"","checklist":{},"identifier":164085465675675},
      {"title":"first task","description":"stuff","dueDate":"2021-12-31","priority":"1","notes":"","checklist":{},"identifier":1640854644788}
    ];
    if (window.localStorage.getItem('task-library')) {
      arr = JSON
      .parse(window.localStorage
        .getItem('task-library'))
        .map(task => {
        return new Task(task.title, task.description, task.dueDate, task.priority, task.notes, task.checklist, task.identifier, task.complete);
      });
    }
    const show = () => arr;
    const updateLocalStorage = () => {
      window.localStorage.setItem('task-library', JSON.stringify(arr));
    }
    const addToLibrary = (task) => {
        arr.push(task);
        arr[arr.length-1].summary();
        updateLocalStorage();
    };
    const removeFromLibrary = (task) => {
      arr = arr
      .filter(storedTask => {
        if (storedTask.identifier !== task.identifier) {
          return task;
        }
      })
      updateLocalStorage();
    }

    return {
        addToLibrary,
        removeFromLibrary,
        show,
        updateLocalStorage,
    };
})();
export const projectLibrary = (() => {    
  let arr = [];
  if (window.localStorage
    .getItem('project-library')) {
    arr = JSON.parse(window.localStorage
      .getItem('project-library'))
      .map(project => {
      return new Project(project.title, project.description, project.dueDate, project.notes, project.tasks, project.complete);
    });
  }
  const show = () => arr;
  const updateLocalStorage = () => {
    window.localStorage.setItem('project-library', JSON.stringify(arr));
  }
  const addToLibrary = (project) => {
      arr.push(project);
      arr[arr.length-1].summary();
      updateLocalStorage();
  };
  const removeFromLibrary = (project) => {
    arr = arr.filter(storedProject => {
      if (storedProject.identifier !== project.identifier) {
        return project;
      }
    })
    updateLocalStorage();
  }
  return {
      addToLibrary,
      removeFromLibrary,
      show,
  };
})();
export function addNewTask() {
    let taskForm = '';

    if (document.getElementById('task-form') !== null) {
      taskForm = document.getElementById('task-form');
    } else { 
      console.error('not a task');
      return false;
    }
    
    // array from text-input nodes from the task form
    let nodeArr = 
    Array
    .from(taskForm.childNodes)
    .filter(node => node.tagName == 'INPUT' || node.tagName == 'SELECT')
    .map (node => {
      if (node.id === 'due-date') {
        return node.valueAsDate;
      }      else { 
        return node.value;
      }
    });
    // checks for contents of each child node
    for (let i = 0; i < nodeArr.length - 1; i++) {
        if (nodeArr[i].length == 0) {
            return console.error("err: missing fields");
        }
    }
     
    // gets contents of the checklist and stores them in an object
    let listItems = document.getElementsByClassName('checklist-item');
    let checklistObj = {};
    for (let item of listItems) {
        checklistObj[
          item
          .innerHTML
          .slice(2,item.innerHTML.length)] = false;
    }
    let newTask = new Task(...nodeArr, checklistObj, Date.now());
    
    taskLibrary.addToLibrary(newTask);
    taskLibrary.show();
    stateManager.setAdded(true);
  }
export function addNewProject () {
  let projectForm = '';

  if (document.getElementById('project-form') !== null) {
    projectForm = document.getElementById('project-form');
  } else { 
    console.error('not a project');
    return false;
  }
  
  // array from text-input nodes from the project form
  let nodeArr = 
  Array.from(projectForm.childNodes)
  .filter(node => node.tagName == 'INPUT' || node.tagName == 'SELECT')
  .map (node => {
    if (node.id === 'due-date') {
      return node.valueAsDate;
    }      else { 
      return node.value;
    }
  });

  let tasks = Array.from(document.getElementsByClassName('task-list-item')).filter(item => {
    return item.firstChild.checked === true
  }).map(item => {
    return item.firstChild.id;
  })

  // checks for contents of each child node
  for (let i = 0; i < nodeArr.length - 1; i++) {
      if (nodeArr[i].length == 0) {
          return console.error("err: missing fields");
      }
  }
  let newProject = new Project(...nodeArr, tasks);
  
  projectLibrary.addToLibrary(newProject);
  projectLibrary.show();
  stateManager.setAdded(true);
}
export const stateManager = (() => {
  // state for adding things to the libraries
  let _added = false;
  const getAdded = () => _added;
  const setAdded = (newState) => {
    if (typeof newState === 'boolean') {
      _added = newState;
    }
  }
  return {
    getAdded,
    setAdded,
  }
})()
//module for sorting algorithms
export const sortAlg = (() => {
  //sorts by time ascending
  const timeAsc = (library) => {
    let temp = [...library];
    let tempArr = [];
    temp.map(item => {
      if (tempArr.length === 0){
        tempArr.push(item);
      } else {
        for (let i= tempArr.length - 1; i >= 0; i--){
          let test = compareAsc(parseISO(item.dueDate), parseISO(tempArr[i].dueDate));
          if (test === 1 || test === 0) {
            tempArr.splice(i + 1, 0, item);
            break;
          } else if (i === 0) {
            tempArr.unshift(item);
          }
        }
      }
    });
    return tempArr;
  }
  return {
    timeAsc
  }
})();
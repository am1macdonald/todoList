import { compareAsc, parseISO } from 'date-fns';
import Project from './projectClass.js';
import Task from './taskClass.js';

export const taskLibrary = (() => {
    let arr = [];
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
export const addNewTask = () => {
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
export const editTask = (obj) => {
  let description = document.getElementById('description').value;
  let dueDate = document.getElementById('due-date').value;
  let priority = document.getElementById('priority').value; 
  let notes = document.getElementById('notes').value;
  let listItems = document.getElementsByClassName('checklist-item');
    let checklistObj = {};
    for (let item of listItems) {
        checklistObj[
          item
          .innerHTML
          .slice(2,item.innerHTML.length)] = false;
    }

  obj.edit(description, dueDate, priority, notes, checklistObj);

}
export const addNewProject = () => {
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
export const editProject = (obj) => {
  let description = document.getElementById('description').value;
  let dueDate = document.getElementById('due-date').value;
  let notes = document.getElementById('notes').value;
  let tasks = Array.from(document.getElementsByClassName('task-list-item')).filter(item => {
    return item.firstChild.checked === true
  }).map(item => {
    return item.firstChild.id;
  })
  obj.edit(description, dueDate, notes, tasks);
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
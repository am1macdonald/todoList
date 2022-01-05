import { compareAsc, format } from 'date-fns';
import './pageFunctions.js';
import { addNewTask, taskLibrary } from './pageFunctions.js';


const content = document.getElementById('content');



const renderStaticElements = () => {

    // ref for static elements to append to
    const page = document.getElementById('page');

    // renders the sidebar
    (() => {    
        const nav = document.createElement('nav');
        nav.id = 'sidebar';
    
        const header = document.createElement('h1');
        header.id = 'title';
        header.innerHTML = 'Do.';
    
        const taskContainer = document.createElement('div');
        taskContainer.id = 'task-container';
        const taskHeader = document.createElement('h2');
        taskHeader.id = 'task-header';
        taskHeader.innerHTML = 'Tasks';
        taskContainer.appendChild(taskHeader);
        const taskList = document.createElement('ul');
        taskList.id = 'task-list';
        taskContainer.appendChild(taskList);

        const projectContainer = document.createElement('div');
        projectContainer.id = 'project-container';
        const projectHeader = document.createElement('h2');
        projectHeader.id = 'project-header';
        projectHeader.innerHTML = 'Projects';
        projectContainer.appendChild(projectHeader);
        const projectList = document.createElement('ul');
        projectList.id = 'project-list';
        projectContainer.appendChild(projectList);
    
        const newNavButton = (name) => {
          let button = document.createElement('button');
          button.id = `new-${name.toLowerCase()}-button`;
          button.classList.add('nav-button');
          button.innerHTML = `New ${name} >>`;
          nav.appendChild(button);
        }
    
        
        nav.appendChild(header);
        nav.appendChild(taskContainer);
        newNavButton('Task');
        nav.appendChild(projectContainer);
        newNavButton('Project');
        
        page.prepend(nav);
        renderTasksToNav();
    })();

};


const renderDynamicParts = (() => {

        // create the popup for adding new tasks
    const newFormWindow = (type) => {

        const container = document.createElement('div');
        container.id = 'form-container';

        const formHeader = document.createElement('h3');
        formHeader.innerHTML = `New ${type}`;

        const form = document.createElement('form');
        form.name = `${type} creation form`;
        form.id = `${type.toLowerCase()}-form`;

        form.appendChild(formHeader);
        container.appendChild(form);
        content.appendChild(container);
    };

        // creates a text input when called
    const newTextInput = (parent, name, labelText, placeholder, required) => {
        const label = document.createElement('label');
        label.for = name;
        label.innerHTML = labelText;
        const input = document.createElement('input');
        input.id = name;
        input.type = 'text';
        input.placeholder = placeholder;
        
        if (required) {
            input.required = true;
        }

        parent.appendChild(label);
        parent.appendChild(input);
    }

        // creates a date input when called
    const newDateInput = (parent) => {
        const label = document.createElement('label');
        label.for = 'due-date';
        label.innerHTML = 'Deadline.';
        const input = document.createElement('input');
        input.id = 'due-date';
        input.type = 'date';
        input.min = `${format(new Date(), 'yyyy-MM-dd')}`;
        input.value = `${format(new Date(), 'yyyy-MM-dd')}`;
        input.required = true;

        parent.appendChild(label);
        parent.appendChild(input);
    }

        // dropdown menu for selecting the priority
    const newPriorityDropdown = (parent, maxScale) => {
        const label = document.createElement('label');
        label.for = 'priority';
        label.innerHTML = 'Priority.';
        const input = document.createElement('select');
        input.id = 'priority';
        for (let i = 1; i <= maxScale; i++) {
            let newOption = document.createElement('option');
            newOption.value = i.toString();
            newOption.innerHTML = i.toString()
            input.appendChild(newOption);
        }
        parent.appendChild(label);
        parent.appendChild(input);
    }

        // input for a task checklist
    const newChecklist = (parent) => {
        const label = document.createElement('label');
        label.for = 'checklist';
        label.innerHTML = 'Checklist.';
        const listDiv = document.createElement('div');
        listDiv.id = 'checklist-div'
        const listUl = document.createElement('ul');
        listUl.id = 'checklist-list';
        let textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.placeholder = 'Add an item...';
        textInput.id = 'checklist-text-input'
        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('form-buttons');
        const addItem = document.createElement('button');
        addItem.type = 'button';
        addItem.innerHTML = 'add*';
        const removeItem = document.createElement('button');
        removeItem.type = 'button';
        removeItem.innerHTML = 'remove*';
        addItem.addEventListener('click', function(e){
            e.preventDefault();
            if (textInput.value.length > 0){
                let listItem = document.createElement('li');
                listItem.classList.add('checklist-item');
                listItem.innerHTML = '- ' + textInput.value;
                listUl.appendChild(listItem);
                textInput.value = '';
            }
        });
        removeItem.addEventListener('click', function(e){
            e.preventDefault();
            if (listUl.childElementCount > 0) {
                listUl.removeChild(listUl.lastElementChild);
            }
        })

        buttonDiv.appendChild(addItem);
        buttonDiv.appendChild(removeItem);

        listDiv.appendChild(listUl);
        listDiv.appendChild(textInput);
        listDiv.appendChild(buttonDiv);

        parent.appendChild(label);
        parent.appendChild(listDiv);
        
    };

        // form submit button
    const submitButton = (parent) => {
        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.innerHTML = 'create*';
        submitButton.addEventListener('click', () => {
          if (addNewTask() === true) {
            renderTasksToNav();
            wipeForm();
          }
        });

        parent.appendChild(submitButton);
    };

        // form cancel button
    const cancelButton = (parent) => {
        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.innerHTML = 'cancel*';
        cancelButton.addEventListener('click', () => {
            wipeForm();
        });
        parent.appendChild(cancelButton);
    };


    return {
        newFormWindow,
        newTextInput,
        newDateInput,
        newPriorityDropdown,
        newChecklist,
        submitButton,
        cancelButton
    }


})();

// renders date to body of page
const renderBigDate = (() => {
    const dateHero = document.createElement('div');
    dateHero.id = 'date-hero';
    const dateToday = document.createElement('h2');
    dateToday.id = 'date-today';
    dateHero.appendChild(dateToday);
    content.appendChild(dateHero);
    let timer;
    function updateTime() {
    dateToday.innerHTML = `${format(new Date(), "EEEE', the 'do'<br />of 'MMMM")} <br />
                            ${format(new Date(), "p")}`;
    timer = setTimeout(updateTime, 1000);
    }
    function stop() {
        clearTimeout(timer);
        timer = 0;
    }
    return {
        updateTime,
        stop,
    }
})();
              
// creating a form for a new task
const taskCreationMenu = () => {
    renderDynamicParts.newFormWindow('Task');
    let form = document.getElementById('task-form');
    renderDynamicParts.newTextInput(form, 'title', 'Title.', 'Enter task name...', true);
    renderDynamicParts.newTextInput(form, 'description', 'Details.', 'Details...', true);
    renderDynamicParts.newDateInput(form);
    renderDynamicParts.newPriorityDropdown(form, 5);
    renderDynamicParts.newChecklist(form);
    renderDynamicParts.newTextInput(form, 'notes', 'Notes.', 'Additional notes...', false);
    const div = document.createElement('div');
    div.classList.add('form-buttons');         
    renderDynamicParts.submitButton(div);
    renderDynamicParts.cancelButton(div);
    form.appendChild(div);
};

const wipeForm = () => {
    document.getElementById('form-container').remove();
};

const renderTasksToNav = () => {
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    const taskItem = document.createElement('li');
    let temp = [...taskLibrary.show()];
    let topFive = [];
    temp.map(task => {
      if (topFive.length === 0){
        topFive.push(task);
      } else {
        for (let i=0; i < topFive.length; i++){
          let test = compareAsc(new Date(topFive[i].dueDate), new Date(task.dueDate));
          if( test === 1 || test === 0){
            topFive.splice(i, 0, task);
            if (topFive.length > 5){ 
              topFive.pop();
            }
            break;
          } else if (topFive.length < 5) {
            topFive.push(task);
            break;
          }
        }
      }
    });
    topFive.map(task => {
        let newListItem = taskItem.cloneNode();
        newListItem.innerHTML = task.title;        
        list.appendChild(newListItem);
    });
};




export {
    renderStaticElements,
    renderBigDate,
    taskCreationMenu,
    wipeForm,
    renderTasksToNav,
};
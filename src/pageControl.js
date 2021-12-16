import { Task, Project } from './todo.js';
import { format } from 'date-fns';



function pageLoad(){

    const content = document.getElementById('content');


    // create the popup for adding new tasks

    const dataInputWindow = function() {

        // creates a new popup for task / project entry
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
        }

        // creates a text input when called
        const newTextInput = (parent, name, labelText, placeholder) => {
            const label = document.createElement('label');
            label.for = name;
            label.innerHTML = labelText;
            const input = document.createElement('input');
            input.id = name;
            input.type = 'text';
            input.placeholder = placeholder;

            parent.appendChild(label);
            parent.appendChild(input);
        }

        // creates a date input when called
        const newDateInput = (parent) => {
            const label = document.createElement('label');
            label.for = 'due-date';
            label.innerHTML = 'What is the deadline?';
            const input = document.createElement('input');
            input.id = 'due-date';
            input.type = 'date';
            input.min = `${format(new Date(), 'yyyy-MM-dd')}`;
            input.value = `${format(new Date(), 'yyyy-MM-dd')}`

            parent.appendChild(label);
            parent.appendChild(input);
        }
        


        // input for the task priority
        const priorityLabel = document.createElement('label');
        priorityLabel.for = 'priority';
        priorityLabel.innerHTML = 'How important is the task?';
        const priorityInput = document.createElement('select');
        priorityInput.id = 'priority';
        const priorityOptions = [1,2,3,4,5];
        for (let num of priorityOptions) {
            let newOption = document.createElement('option');
            newOption.value = num.toString();
            newOption.innerHTML = num.toString()
            priorityInput.appendChild(newOption);
        }

        const newPriorityDropdown = (parent, maxScale) => {
            const label = document.createElement('label');
            label.for = 'priority';
            label.innerHTML = 'How important is the task?';
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
            label.innerHTML = 'Checklist:';
            const listDiv = document.createElement('div');
            listDiv.id = 'checklist-div'
            const listUl = document.createElement('ul');
            listUl.id = 'checklist-list';
            let textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.id = 'checklist-text-input'
            const buttonDiv = document.createElement('div');
            const addItem = document.createElement('button');
            addItem.type = 'button';
            addItem.innerHTML = 'add';
            const removeItem = document.createElement('button');
            removeItem.type = 'button';
            removeItem.innerHTML = 'remove';
            addItem.addEventListener('click', function(e){
                e.preventDefault();
                if (textInput.value.length > 0){
                    let listItem = document.createElement('li');
                    listItem.classList.add('checklist-item');
                    listItem.innerHTML = '- ' + textInput.value;
                    listUl.appendChild(listItem);
                    textInput.value = '';
                };
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
    
        // button to submit the details and invoke function to make a new task object


        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.innerHTML = 'Create';
        submitButton.addEventListener('click', addNewTask);

                
        // appending all elements to the DOM
        const taskCreationMenu = () => {
            newFormWindow('Task');
            let form = document.getElementById('task-form');
            newTextInput(form, 'title', 'Title:', 'What needs doing?');
            newTextInput(form, 'description', 'Description:', 'What are the details?');
            newDateInput(form);
            newPriorityDropdown(form, 5);
            newChecklist(form);
            newTextInput(form, 'notes', 'Notes:', 'Any additional details?');
            
            form.appendChild(submitButton);
            
        }

        function addNewTask(e) {
            e.preventDefault();
            console.log('hello');
            let inputs = [
            ];        
            let listItems = document.getElementsByClassName('checklist-item');
            let checklistObj = {};
            for (let item of listItems) {
                checklistObj[item.innerHTML.slice(2,item.innerHTML.length)] = false;
            };
            let newTask = new Task(...inputs, checklistObj);
            newTask.summary();

            return newTask;
        }


        return {
            taskCreationMenu
        }

        


    }
    
    dataInputWindow().taskCreationMenu();
}

export {
    pageLoad
}
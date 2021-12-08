import { Task, Project } from './todo.js';
import { format } from 'date-fns';

function pageLoad(){

    const content = document.getElementById('content');

    let task2 = new Task('task2', 2, 3, 4, 5, 6);
    let project1 = new Project('project1', 2, 3, 4, 5);
    console.log(task2, project1);
    task2.announce();
    project1.announce();

    const taskCreationWindow = function() {
        const container = document.createElement('div');
        container.id = 'form-container';
        const form = document.createElement('form');
        form.name = 'task creation form';
        const titleLabel = document.createElement('label');
        titleLabel.for = 'title';
        titleLabel.innerHTML = 'Task:';
        const titleInput = document.createElement('input');
        titleInput.id = 'title';
        titleInput.type = 'text';
        titleInput.placeholder = 'What needs doing?';        
        const descriptionLabel = document.createElement('label');
        descriptionLabel.for = 'description';
        descriptionLabel.innerHTML = 'Description:';
        const descriptionInput = document.createElement('input');
        descriptionInput.id = 'description';
        descriptionInput.type = 'text';
        descriptionInput.placeholder = 'What are some details?'
        const dueDateLabel = document.createElement('label');
        dueDateLabel.for = 'due-date';
        dueDateLabel.innerHTML = 'What is the deadline?';
        const dueDateInput = document.createElement('input');
        dueDateInput.id = 'due-date';
        dueDateInput.type = 'date';
        dueDateInput.min = `${format(new Date(), 'yyyy-MM-dd')}`;
        dueDateInput.value = `${format(new Date(), 'yyyy-MM-dd')}`
        const priorityLabel = document.createElement('label');
        dueDateLabel.for = 'dueDate';
        dueDateLabel.innerHTML = 'What is the deadline?';
        const priorityInput = document.createElement('input');
        const notesLabel = document.createElement('label');
        const notesInput = document.createElement('input');
        const checklistLabel = document.createElement('label');
        const checklistInput = document.createElement('input');
        const submitButton = document.createElement('button');

        
        
        

        const appendArray = [titleLabel, titleInput, descriptionLabel, descriptionInput,
            dueDateLabel, dueDateInput, priorityLabel, priorityInput, notesLabel, notesInput, checklistLabel,
            checklistInput, submitButton
        ];

        for (let item of appendArray) {
            form.appendChild(item);
        };
        container.appendChild(form);
        content.appendChild(container);
    }
    
    taskCreationWindow();
    console.log(format(new Date(), 'yyyy-MM-dd'));

}

export {
    pageLoad
}
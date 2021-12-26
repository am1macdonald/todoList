import './reset.css';
import './style.css';
import {renderBigDate, renderStaticElements, taskCreationMenu} from './pageControl.js';


renderStaticElements();
renderBigDate();


const newTaskButton = document.getElementById('new-task-button');
newTaskButton.addEventListener('click', () => {
    let checkForm = Array.from(document.getElementById('content').childNodes)
    .find((node) => node.id == 'form-overlay');
    if (!checkForm) { taskCreationMenu(); }
    
});
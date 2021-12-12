const cacheDom = () => {

    const title = document.getElementById('title');
    console.log('hello: ' + document.getElementById('title').value);
    const listItems = document.getElementsByClassName('checklist-item');
    for (let item of listItems){
        console.log(item.innerHTML.slice(2, item.innerHTML.length));
    };
}

const addTask = () => {
    cacheDom();
    

}

export {
    cacheDom,
    addTask
}
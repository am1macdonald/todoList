const template = document.createElement('template');
template.innerHTML = `
<style>
    #container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        
        display: flex;
        justify-content: center;
        align-items: center;
        
        background-color: rgb(0 0 0 / 0.75);
    }
</style>
<div id="container">
    <slot></slot>
</div>
`

class OverlayComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.append(template.content.cloneNode(true));
    }
}

customElements.define('app-overlay', OverlayComponent);

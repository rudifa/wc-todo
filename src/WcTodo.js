import { html, css, LitElement } from 'lit-element';

/* add a child component: TodoList
*/

class TodoList extends LitElement {
  static get properties() {
    return {
      todos: { type: Array },
    };
  }

  static get styles() {
    return css`
      :host {
        color: blue;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      button {
        background-color: transparent;
        border: none;
      }
    `;
  }

  render() {
    if (!this.todos) {
      return html``;
    }

    return html`
      <ol>
      ${this.todos.map(
        todo => html`
          <li>
            <input
              type="checkbox"
              .checked=${todo.finished}
              @change=${e => this._changeTodoFinished(e, todo)}
            />
            ${todo.text}
            <button @click=${() => this._removeTodo(todo)}>X</button>
          </li>
        `,
      )}
      </ol>
    `;
  }

  _changeTodoFinished(e, changedTodo) {
    const eventDetails = { changedTodo, finished: e.target.checked };
    this.dispatchEvent(new CustomEvent('change-todo-finished', { detail: eventDetails }));
  }

  _removeTodo(item) {
    this.dispatchEvent(new CustomEvent('remove-todo', { detail:item }))
  }

}

customElements.define('todo-list', TodoList)


// https://open-wc.org/codelabs/basics/lit-html.html?index=/codelabs/#4
// define consts outside of the class, for insertion into the rendered html
const author = 'open-wc';
const homepage = 'https://open-wc.org/';
const footerTemplate = html`
  <footer>Made with love by <a href="${homepage}">${author}</a></footer>
`;

export class WcTodo extends LitElement {
  static get styles() {
    return css`
      :host {
        --wc-todo-text-color: #000;

        display: block;
        padding: 25px;
        color: var(--wc-todo-text-color);
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      counter: { type: Number },
      todos: { type: Array }
    };
  }

  constructor() {
    super();
    this.title = 'Hey there';
    this.counter = 5;
    this.todos = [{text: 'Do A', finished: true}, 
    {text: 'Do B', finished: false}, {text: 'Do C', finished: false}];
  }

  // https://open-wc.org/codelabs/basics/lit-html.html?index=/codelabs/#2
  connectedCallback() {
    super.connectedCallback();
    console.log('lit element connected');
  }

  __increment() {
    this.counter += 1;
  }

  _addTodo() {
    const input = this.shadowRoot.getElementById('addTodoInput');
    const text = input.value;
    input.value = '';
    // update the whole array of todos to trigger the redisplay
    this.todos = [...this.todos, {text, finished: false}];
  }

  _removeTodo(e) {
    this.todos = this.todos.filter(todo => todo !== e.detail);
  }

  _changeTodoFinished(e) {
    const { changedTodo, finished } = e.detail;
    this.todos = this.todos.map((todo) => {
      if (todo !== changedTodo) {
        return todo;
      }
      return { ...changedTodo, finished };
    })
  }

  render() {
    const finishedCount = this.todos.filter(e => e.finished).length;
    const unfinishedCount = this.todos.length - finishedCount;

    return html`
      <h1>Todo app</>
      <h2></h2>

      <!-- add an input field with a button and a handler -->
      <div>     
        <input id="addTodoInput" placeholder="Name" />
        <button @click=${this._addTodo}>Add Todo</button>
      </div>

      <!-- pass in todos and listen to custom events from the list -->
      <todo-list 
        .todos=${this.todos}
        @change-todo-finished="${this._changeTodoFinished}"
        @remove-todo="${this._removeTodo}"
      ></todo-list>

      <div>Total finished: ${finishedCount}</div>
      <div>Total unfinished: ${unfinishedCount}</div>

      <p> ${footerTemplate}</p>
    `;
  }
}

import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import './index.css';

class App extends React.Component {
  state = {
    tasks: [],
    task: '',
    editedText: '',
    showEdit: false,
  };

  component() {
    this.socket = io('http://localhost:8000');
    this.socket.on('updateData', (tasks) => {
      this.setState({ tasks: [...tasks] });
    });
  }

  handleInputChange({ target }) {
    this.setState({ task: target.value });
  }

  handleModifyChange({ target }) {
    this.setState({ editedText: target.value });
  }

  addTask(event) {
    event.preventDefault();
    const { task } = this.state;
    if (task.length) {
      this.socket.emit('addTask', { id: uuidv4(), name: task });
      this.setState({ task: '' });
    }
  }

  removeTask(event, id) {
    event.preventDefault();
    this.socket.emit('removeTask', id);
  }

  editTask(event, id, text) {
    event.preventDefault();
    if (text.length) {
      this.socket.emit('editTask', { id, text });
      this.setState({ editedText: '', showEdit: !this.state.showEdit });
    }
    this.setState({ showEdit: !this.state.showEdit });
  }

  render() {
    const { tasks, editedText } = this.state;
    return (
      <div className='App'>
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className='tasks-section' id='tasks-section'>
          <h2>Tasks</h2>

          <ul className='tasks-section__list' id='tasks-list'>
            {tasks.map(({ id, name }, index) => (
              <li className='task fade-in' key={id}>
                {index + 1}: {name}
                <div>
                  <button
                    onClick={(e) =>
                      this.setState({
                        showEdit: !this.state.showEdit,
                        index: index,
                      })
                    }
                    className='btn btn--yellow'
                  >
                    Change
                  </button>
                  <button
                    onClick={(e) => this.removeTask(e, id)}
                    className='btn btn--red'
                  >
                    Remove
                  </button>
                </div>
                {index === this.state.index && this.state.showEdit && (
                  <div>
                    <input
                      value={this.state.editedText}
                      onChange={(e) => this.handleModifyChange(e)}
                      className='text-input'
                      placeholder='Retype todo name'
                      type='text'
                      id='edit-task-input'
                    />
                    <button
                      onClick={(e) => this.editTask(e, id, editedText)}
                      className='btn btn--green'
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <form id='add-task-form'>
            <input
              value={this.state.task}
              onChange={(event) => this.handleInputChange(event)}
              className='text-input'
              type='text'
              placeholder='Type your description'
              id='task-name'
            />
            <button
              onClick={(e) => this.addTask(e)}
              className='btn'
              type='submit'
            >
              Add
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default App;

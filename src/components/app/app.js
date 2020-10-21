import React from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import AddItem from "../add-item/add-item"

import './app.css';

export default class App extends React.Component {

  createTodoItem(label){
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++
    }
  };
  toggleProperty(arr, id, propName) {
    const idx = arr.findIndex((el) => el.id === id);
    const oldItem = arr[idx];
    const newItem = { ...oldItem, [propName]: !oldItem[propName] };

    return [
      ...arr.slice(0, idx),
      newItem,
       ...arr.slice(idx + 1)
      ];
  };
  constructor() {
    super();
    
    this.maxId = 100;

    this.state = {
      todoData: [
        this.createTodoItem('Drink Coffee'),
        this.createTodoItem('Make Awesome App'),
        this.createTodoItem('Have a lunch')
      ],
      term: '',
      filter: 'active'
    };

    this.deleteItem = (id) => {
      this.setState(({ todoData }) => {
        const idx = todoData.findIndex((el) => el.id === id);

        const newArray = [
          ...todoData.slice(0, idx),
           ...todoData.slice(idx + 1)
          ];
          
        return {
          todoData: newArray
        }
      });
    };
    this.AddItem = (text) => {
      const newItem = this.createTodoItem(text);

      this.setState(({ todoData }) => {
        const newArr = [
          ...todoData,
          newItem
        ];

        return {
          todoData: newArr
        };
      });
    };



    this.onToggleImportant = (id) => {
      this.setState(({ todoData }) => {
        return {
          todoData: this.toggleProperty(todoData, id, 'important')
        };
      });
    };

    this.onToggleDone = (id) => {
      this.setState(({ todoData }) => {
        return {
          todoData: this.toggleProperty(todoData, id, 'done')
        };
      });
    };
    this.onSearchChange = (term) => {
      this.setState({ term });
    };
    this.onFilterChange = (filter) => {
      this.setState({ filter });
    }
  }
  search(items, term) {
    if(term.length === 0) {
      return items;
    }

    return items.filter((item) => {
      return item.label
            .toLowerCase()
            .indexOf(term.toLowerCase()) > -1;
    });
  }

  filter(items, filter) {

    switch(filter) {
      case 'all':
        return items;
      case 'active':
        return items.filter((item) => !item.done);
      case 'done': 
        return items.filter((item) => item.done); 
      default:
        return items;
    }

  }

  render() {

    const { todoData, term, filter } = this.state;

    const visibleItem = this.filter(this.search(todoData, term), filter)  ;
    const doneCount = todoData.filter((el) => el.done).length;

    const todoCount = todoData.length - doneCount;
    return (
      <div className="todo-app">
        <AppHeader toDo={ todoCount } done={ doneCount } />
        <div className="top-panel d-flex">
          <SearchPanel  
          onSearchChange={this.onSearchChange}/>
          <ItemStatusFilter 
          filter={filter}
          onFilterChange={this.onFilterChange}/>
        </div>
  
        <TodoList 
        todos={visibleItem}
        onDeleted={ this.deleteItem } 
        onToggleImportant={this.onToggleImportant}
        onToggleDone={this.onToggleDone}/>

        <AddItem onItemAdded={this.AddItem}/>
      </div>
    );
  }
};


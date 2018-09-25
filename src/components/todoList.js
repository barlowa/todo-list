import React from 'react'
import TodoForm from '../components/todoForm'
import Todo from '../components/todo'

class TodoList extends React.Component {

  state = {
    todos : [],
    todosToShow:'all'
  }

  addTodo = (todo) =>{
    this.setState({
      todos: [todo, ...this.state.todos]
    })
  }

  toggleComplete = (id) =>{ 
    this.setState({
      todos: this.state.todos.map(todo =>{
        //mapping through the whole array and finding matching id value.
        if(todo.id === id){
          return{
            ...todo, //spread operator copies the todo object
            complete: !todo.complete //updates one of the values in the todo object
          }
        }else{
          return todo //if the id doesnt match, just returns the todo. 
        }
      })
    })
  }

  updateTodoToShow = (filter) =>{
    this.setState({
      todosToShow : filter
    })
  }

  handleDelete = (id) =>{
    this.setState({
      todos : this.state.todos.filter(todo => todo.id !== id)
    })

  }

  render (){
    let todos = []

    if(this.state.todosToShow === 'all'){
      todos = this.state.todos
    }else if (this.state.todosToShow === 'active'){
      todos = this.state.todos.filter(todo => !todo.complete)
    }else if (this.state.todosToShow === 'complete'){
      todos = this.state.todos.filter(todo => todo.complete)
    }

    return(
      <div>
        <TodoForm 
          onSubmit={this.addTodo}
        />
        {todos.map(todo =>{
          return(
            <Todo 
              key = {todo.id}
              todo = {todo}
              toggleComplete = { () =>this.toggleComplete(todo.id) }//lamda function to pass in parameter in the map into function prop.
              onDelete = { () => this.handleDelete(todo.id)}
            />
          )
        })}

        <div>{this.state.todos.filter(todo => !todo.complete).length} Things left to do</div>

        <button onClick ={ () => this.updateTodoToShow('all')}>All</button>
        <button onClick ={ () => this.updateTodoToShow('active')}>Active</button>
        <button onClick ={ () => this.updateTodoToShow('complete')}>Complete</button>
      </div>
    );//return
  }//render
}//component



export default TodoList
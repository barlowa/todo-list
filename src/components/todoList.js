import React from 'react'
import TodoForm from '../components/todoForm'

class TodoList extends React.Component {

  state = {
    todos : []
  }

  addTodo = (todo) =>{
    this.setState({
      todos: [todo, ...this.state.todos]
    })

  }

  render (){
    return(
      <div>
        <TodoForm 
          onSubmit={this.addTodo}
        />
        {this.state.todos.map(todo =>{
          return(
            <div key = {todo.id}>{todo.text}</div>
          )
        })}
       </div>
    );//return
  }//render
}//component



export default TodoList
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
        {JSON.stringify(this.state.todos)}
      </div>
    );//return
  }//render
}//component



export default TodoList
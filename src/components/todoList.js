import React from 'react'
import TodoForm from '../components/todoForm'
import Todo from '../components/todo'

class TodoList extends React.Component {

  state = {
    todos : []
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

  render (){
    return(
      <div>
        <TodoForm 
          onSubmit={this.addTodo}
        />
        {this.state.todos.map(todo =>{
          return(
            <Todo 
              key = {todo.id}
              todo={todo}
              toggleComplete = { () =>this.toggleComplete(todo.id) }//lamda function to pass in parameter in the map into function prop.
            />
          )
        })}
       </div>
    );//return
  }//render
}//component



export default TodoList
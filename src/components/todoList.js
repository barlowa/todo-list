import React from 'react'
import TodoForm from '../components/todoForm'
import Todo from '../components/todo'

class TodoList extends React.Component {

  state = {
    todos : [],
    todosToShow:'all',
    toggleAllComplete: true,
  }

  addTodo = (todo) =>{
    this.setState(state =>({
      todos: [todo, ...state.todos]
    }))
  }

  toggleComplete = (id) =>{ 
    this.setState(state => ({//using function within setState when using state, because setState is async and causes rerender
      todos: state.todos.map(todo =>{
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
    }))
  }

  updateTodoToShow = (filter) =>{
    this.setState({
      todosToShow : filter
    })
  }

  handleDelete = (id) =>{
    this.setState(state => ({
      todos : state.todos.filter(todo => todo.id !== id)
    }))
  }

  removeCompletedItems = () =>{
    this.setState(state => ({
      todos : state.todos.filter(todo => !todo.complete)//filter keeps the items with a ! that arent true. 
    }))
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
        {this.state.todos.some (todo => todo.complete) ? //reason why some is used instead of filter, some exits earlier than filter.
          <button onClick ={ () => this.removeCompletedItems()}>Remove Completed</button>
        : null
        }
        <button
          onClick={ () => //inline lamda function
            this.setState( state => ({ 
              todos : state.todos.map(todo => ({
                ...todo,
                complete: state.toggleComplete
              })),
              toggleComplete: !state.toggleComplete

            })

            )
          }
        > 
          toggleAllComplete
        </button>

        
      </div>
    );//return
  }//render
}//component



export default TodoList
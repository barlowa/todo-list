import React from 'react'
import shortid from 'shortid'

class TodoForm extends React.Component {

  state = {
    text : '',
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.props.onSubmit({
      id: shortid.generate(),
      complete: false, 
      text: this.state.text
    })
    this.setState({
      text:'',
    })
  }

  render (){
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            name='text'
            value={this.state.text}
            onChange={this.handleChange}
            placeholder={'to do list'}
          />
          <button onClick={this.handleSubmit}>Add to list</button>
        </form>
      </div>
    )//return
  }//render
}//component



export default TodoForm
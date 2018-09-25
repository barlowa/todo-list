import React from 'react';
import { connect } from 'react-redux';
import { testAction } from '../actions/globalActions'
import TodoList from '../components/todoList'


class Home extends React.Component{

  render(){
    return (
      <div>
        hi, home page
        <TodoList />
      </div>
    );//return
  }//render
}//component


const mapStateToProps = (state => {
  return { 
    global: state.global
  }
})

export default connect((mapStateToProps), { testAction })(Home);
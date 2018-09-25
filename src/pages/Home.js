import React from 'react';
import { connect } from 'react-redux';
import { testAction } from '../actions/globalActions'


class Home extends React.Component{
  componentDidMount(){
    this.props.testAction()
  }
  render(){
    return (
      <div>
        hi, home page
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
import React from 'react';
import { connect } from 'react-redux';
import TestComponent from '../components/testComponent'


class Test extends React.Component{

  render(){
    return (
      <div>
        hi, Test page
        <TestComponent />
      </div>
    );//return
  }//render
}//component


const mapStateToProps = (state => {
  return { 
    global: state.global
  }
})

export default connect((mapStateToProps), {  })(Test);
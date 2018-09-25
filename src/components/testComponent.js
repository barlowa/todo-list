import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { testAction } from '../actions/globalActions'

class TestComponent extends React.Component {

  componentDidMount(){
    this.props.testAction()

  }

  render (){
    return(
      <div>
        {/* {this.props.global.test} */}
      </div>
    );//return
  }//render
}//component

const mapStateToProps = (state => {
  return { 
    global: state.global
  }
})

export default withRouter(connect((mapStateToProps),{testAction})(TestComponent));
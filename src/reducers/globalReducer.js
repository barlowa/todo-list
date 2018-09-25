import { TEST_ACTION, ASYNC_TEST, AWAIT_TEST, RESULTS_TEST} from '../actions/types';

const initialState = {

};

export default function(state = initialState, action) {
  switch (action.type) {

    case TEST_ACTION:
    return {
      ...state,
      test: action.payload
    }
    
    case ASYNC_TEST:
    return {
      ...state,
      async: action.payload,
    }

    case AWAIT_TEST:
    return {
      ...state,
      await: action.payload,
    }

    case RESULTS_TEST:
    return {
      ...state,
      results: action.payload,
    }

    default:
    return state;
  }
}
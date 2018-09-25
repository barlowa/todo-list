import { TEST_ACTION, ASYNC_TEST, AWAIT_TEST, RESULTS_TEST} from './types';

export const testAction = () => dispatch => {
  const quickMaths = Math.floor(Math.random() * Math.floor(400000))
  const test = `there are currently ${quickMaths} slugs in the world`
  console.log(test)

  
  //---------standard fetch statements------------
  // fetch('https://reqres.in/api/users?page=1')
  // .then(response => response.json())
  // .then((results) =>{
  //   dispatch({
  //     type: TEST_ACTION,
  //     payload: results, 
  //   })
  //   console.log(results)
  // })

  // fetch('https://reqres.in/api/users?page=2')
  // .then(response => response.json())
  // .then((results) =>{
  //   dispatch({
  //     type: ASYNC_TEST,
  //     payload: results, 
  //   })
  //   console.log(results)
  // })

  // fetch('https://reqres.in/api/users?page=3')
  // .then(response => response.json())
  // .then((results) =>{
  //   dispatch({
  //     type: AWAIT_TEST,
  //     payload: results, 
  //   })
  //   console.log(results)
  // })

  //--------asynchronous requests and promises method 1----------
  const asynchronous = async () =>{

    let promise1 = new Promise((resolve, reject) =>{
      fetch('https://reqres.in/api/users?page=1')
      .then(response => response.json())
      .then((results) =>{
        resolve(results)
      })
    })

    let promise2 = new Promise((resolve, reject) =>{
      fetch('https://reqres.in/api/users?page=2')
      .then(response => response.json())
      .then((results) =>{
        resolve(results)
      })
    })

    let promise3 = new Promise((resolve, reject) =>{
      fetch('https://reqres.in/api/users?page=3')
      .then(response => response.json())
      .then((results) =>{
        resolve(results)
      })
    })

    let promise4 = new Promise((resolve, reject) =>{
      fetch('https://reqres.in/api/users?page=4')
      .then(response => response.json())
      .then((results) =>{
        resolve(results)
      })
    })

    let result1 = await promise1 
    let result2 = await promise2
    let result3 = await promise3
    let result4 = await promise4

    dispatch({
      type: AWAIT_TEST,
      payload: result1, 
    })
    dispatch({
      type: ASYNC_TEST,
      payload: result2, 
    })
    dispatch({
      type: TEST_ACTION,
      payload: result3, 
    })
    dispatch({
      type: RESULTS_TEST,
      payload: result4,
    })
    console.log('result 4', result4)
    console.log('result 3', result3)
    console.log('result 2', result2)
    console.log('result 1', result1)
  }
  asynchronous()

  //--------asynchronous requests and promises method 1----------
//   var url = 'https://reqres.in/api/users?page=4'
//   const asynchronous = async () =>{
//     try{
//       const response = await fetch('https://reqres.in/api/users?page=4') 
//       const response2 = await fetch('https://reqres.in/api/users?page=3')
//       const result = await response.json() && await response2.json()
//       console.log(result)
//     }
//     catch (err) {
//       console.log('fetch failed', err)
//     }
//   }
//   asynchronous()

};

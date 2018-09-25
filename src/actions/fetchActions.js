import { GET_VRM, CLEAR_VRM, VRM_STATUS, GET_LOGIN_TOKEN, ALLOW_SEARCH, PRODUCT_SEARCH, PRODUCT_SEARCH_STATUS, LOCATION_SEARCH_STATUS,LOCATION_SEARCH_RESULT, SECONDARY_PRODUCT_SEARCH, GET_APPOINTMENT_TIMES  } from './types';


export const getLoginToken = () => dispatch => {
  const login = {
    username:"mikewtest",
    password:"mikewtest",
    apiKey:"7058AA99-F16E-41C2-8EFE-E28AD67D82F2",
    customerId:"50288",
    forceLogin:"false",
   }
    fetch(`https://api.thevirtualwarehouse.co.uk/api/GetLoginToken`,{
    method:'POST',
    headers:{
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify (login) })
  .then(response => response.json())
  .then((JSONresults) => {
    const tokenResult = 'Bearer '+JSONresults
    dispatch({
      type: GET_LOGIN_TOKEN, 
      payload : tokenResult,
      error : '',
    })
  })
}

export const getVRM = () => (dispatch, getState) => {
  const loginToken = getState().fetchData.loginToken
  const vrmInput = getState().global.vrmInput

  if (loginToken !== undefined){
      dispatch({
        type:VRM_STATUS, 
        vrmLoading: true,
      })
      fetch(`https://api.thevirtualwarehouse.co.uk/api/GetVRMVehicleDetails?vrm=${vrmInput}&forceLookup=true`,{//force lookup needs to enabled/
      method:'GET',
      headers:{
        'Content-Type' : 'application/json; charset=utf-8',
        'Authorization' : `${loginToken}`,
        }
      })
      .then(response => response.json())
      .then((vrmSearchResult) => {
        const frontSplit = vrmSearchResult.DriveRight.VehicleRecords[0].TyreSize.split(/R|\// )
        const rearSplit = vrmSearchResult.DriveRight.VehicleRecords[0].TyreSizeR.split(/R|\// )
        const optionalFrontSplit = vrmSearchResult.DriveRight.VehicleOptions[0] ? vrmSearchResult.DriveRight.VehicleOptions[0][0].FrontTyreSize.split(/R|\// ) : '' 
        const optionalRearSplit = vrmSearchResult.DriveRight.VehicleOptions[0] ? vrmSearchResult.DriveRight.VehicleOptions[0][0].RearTyreSize.split(/R|\// ) : ''
        const vehicleWeight = 1
        // vrmSearchResult.DriveRight.VehicleRecords[0]? vrmSearchResult.DriveRight.vehicleRecords[0][0].Kerb_weight : ''

        console.log(`tyre sizes:  front: ${frontSplit}, rear: ${rearSplit}, optional front: ${optionalFrontSplit}, optional rear: ${optionalRearSplit}`)

        dispatch({
          type:GET_VRM, 
          payload : vrmSearchResult,
          vehicleWeight: vehicleWeight,
          frontTyreSize: {
            width:frontSplit[0],
            profile: frontSplit[1],
            size: frontSplit[2],
            speedRating:vrmSearchResult.DriveRight.VehicleRecords[0].SpeedIndex,
            loadIndex: vrmSearchResult.DriveRight.VehicleRecords[0].LoadIndex,
          },
          rearTyreSize: {
            width:rearSplit[0],
            profile: rearSplit[1],
            size: rearSplit[2],
            speedRating:vrmSearchResult.DriveRight.VehicleRecords[0].SpeedIndexR,
            loadIndex: vrmSearchResult.DriveRight.VehicleRecords[0].LoadIndexR,
          },
          optionalFrontTyreSize: {
            width:optionalFrontSplit[0] ? optionalFrontSplit[0] : 'no optional equipment',
            profile: optionalFrontSplit[1] ? optionalFrontSplit[1] : 'no optional equipment',
            size: optionalFrontSplit[2] ? optionalFrontSplit[2] : 'no optional equipment',
            speedRating: vrmSearchResult.DriveRight.VehicleOptions[0] ? vrmSearchResult.DriveRight.VehicleOptions[0][0].FrontSpeedIndex : 'no optional equipment',
            loadIndex: vrmSearchResult.DriveRight.VehicleOptions[0] ? vrmSearchResult.DriveRight.VehicleOptions[0][0].FrontLoadIndex : 'no optional equipment',
          },
          optionalRearTyreSize: {
            width:optionalRearSplit[0] ? optionalRearSplit[0] : 'no optional equipment',
            profile: optionalRearSplit[1] ? optionalRearSplit[1] : 'no optional equipment',
            size: optionalRearSplit[2] ? optionalRearSplit[2] : 'no optional equipment',
            speedRating: vrmSearchResult.DriveRight.VehicleOptions[0] ? vrmSearchResult.DriveRight.VehicleOptions[0][0].RearSpeedIndex : 'no optional equipment',
            loadIndex: vrmSearchResult.DriveRight.VehicleOptions[0] ? vrmSearchResult.DriveRight.VehicleOptions[0][0].RearLoadIndex : 'no optional equipment',
          },
        })
        dispatch({
          type: VRM_STATUS,
          vrmLoading :false, 
        })
      })
      .catch((error)=>{
        console.log('error',error)
        // console.log('error vehicle not found')
        dispatch({
          type:VRM_STATUS, 
          vrmLoading: false,
          vehicleNotFound: true, 
          error: error.message,
        })
     })
    }
  } 


export const getProducts = () => (dispatch,getState) =>{
  const state = getState()
  const search = false
  dispatch({
    type: CLEAR_VRM,//clears the vrm input/array, not needed again, and if another search is done, will need to be empty
  })
  dispatch({
    type: PRODUCT_SEARCH_STATUS, 
    payload : true, 
  })
  dispatch({
    type: ALLOW_SEARCH,//sets the 'allow search' status to false, so if another search is done, checks can be made
    payload: search, 
  })
  dispatch({
    type:PRODUCT_SEARCH, //clears the arrays
    payload: {}
  })
  if(state.global.secondaryTyreSarch ===true){//if the 'both tyres' option is selected, the secondary product search array is cleared before the initial search.
    dispatch({
      type:SECONDARY_PRODUCT_SEARCH,
      payload: {}
    })//returns the result
  }
  fetch('http://api.thevirtualwarehouse.co.uk/api/ProductSearch', {// QA API 
    method: 'POST',
    headers: {
    'cache-control' : 'no-cache',
    'Content-Type' : 'application/json; charset=utf-8',
    'Authorization' : `${state.fetchData.loginToken}`,
    },
    body: JSON.stringify (state.global.keyInput) //stringify changes javascript object into a regular string. 
  })
  .then(response => response.json())// turns response from api into JSON.
  .then((productSearch) => {
    var prodSearch = productSearch.map((prodSearch)=>{
      return{
        manName : prodSearch.manName,
        key1 : prodSearch.key1, 
        key2 : prodSearch.key2, 
        key3 : prodSearch.key3, 
        key4 : prodSearch.key4, 
        loadIndex : prodSearch.loadIndex,
        extraLoad: prodSearch.extraLoad, 
        runFlat : prodSearch.runFlat, 
        isSummerTyre: prodSearch.isSummerTyre ? 'Y' : 'N' ,
        isWinterTyre : prodSearch.isWinterTyre ? 'Y' : 'N' ,
        descr : prodSearch.descr, 
        currencySymbol : prodSearch.currencySymbol, 
        cost : prodSearch.cost, 
        treadPattern : prodSearch.treadPattern, 
        rrc_grade : prodSearch.rrc_grade, 
        wetGrip_grade : prodSearch.wetGrip_grade, 
        noiseDb : prodSearch.noiseDb, 
        productImagePath : prodSearch.productImagePath, 
        objId : prodSearch.objId, 
        cusDepot : prodSearch.cusDepot,
        code : prodSearch.code, 
        otcReference : prodSearch.otcReference,
        memo : prodSearch.memo, 
        recommended : prodSearch.recommended, 
        brandType : prodSearch.brandType, 
        brandLogoPath : prodSearch.brandLogoPath,
        productQuantity: 2,
        stockQuantity: prodSearch.qty,
      }
    })//Second product search, if user selects 'both' option, when their car has different sized tyres on the front and rear
    if(state.global.secondaryTyreSarch === false) {//variable set when 'both' option selected
      console.log('single product search')
      dispatch({
        type:PRODUCT_SEARCH, //if above is false, one product search will be dispatched to redux
        payload: prodSearch
      })//returns the result
      dispatch({
        type: PRODUCT_SEARCH_STATUS,//status set after search has completed
        payload : false, 
        error : false, 
      })
    }else{//if the secondary product search variable is set to true, an additional product search will be done 
      console.log('double product search')
      fetch('http://api.thevirtualwarehouse.co.uk/api/ProductSearch', {
        method: 'POST',
        headers: {
          'cache-control' : 'no-cache',
          'Content-Type' : 'application/json; charset=utf-8',
          'Authorization' : `${state.fetchData.loginToken}`,
        },
        body: JSON.stringify (state.global.keyInputSecondTyre) //stringify changes javascript object into a regular string. 
      })
      .then(response => response.json())// turns response from api into JSON.
      .then((productSearch2)=>{
        var prodSearch2 = productSearch2.map((prodSearch)=>{
          return{
            manName : prodSearch.manName,
            key1 : prodSearch.key1, 
            key2 : prodSearch.key2, 
            key3 : prodSearch.key3, 
            key4 : prodSearch.key4, 
            loadIndex : prodSearch.loadIndex,
            extraLoad: prodSearch.extraLoad, 
            runFlat : prodSearch.runFlat, 
            isSummerTyre: prodSearch.isSummerTyre ? 'Y' : 'N' ,
            isWinterTyre : prodSearch.isWinterTyre ? 'Y' : 'N' ,
            descr : prodSearch.descr, 
            currencySymbol : prodSearch.currencySymbol, 
            cost : prodSearch.cost, 
            treadPattern : prodSearch.treadPattern, 
            rrc_grade : prodSearch.rrc_grade, 
            wetGrip_grade : prodSearch.wetGrip_grade, 
            noiseDb : prodSearch.noiseDb, 
            productImagePath : prodSearch.productImagePath, 
            objId : prodSearch.objId, 
            cusDepot : prodSearch.cusDepot,
            code : prodSearch.code, 
            otcReference : prodSearch.otcReference,
            memo : prodSearch.memo, 
            recommended : prodSearch.recommended, 
            brandType : prodSearch.brandType, 
            brandLogoPath : prodSearch.brandLogoPath,
            productQuantity: 2,
            stockQuantity: prodSearch.qty,
          }
        })
        const matchedTyres = []
        const matchedTyres2 =[]

        for (let i = 0, length = prodSearch.length; i < length; i++) { //outer for loop gets the length of the first array, uses the length as an index

          for (let j=0, length2 = prodSearch2.length; j < length2; j++){ //inner for loop does the same except for the second array.

            if (prodSearch[i].treadPattern === prodSearch2[j].treadPattern){ // if the tread patterns match and two of the tyres are in stock
              matchedTyres.push(prodSearch[i])//new array containing matching tread patterns 
              matchedTyres2.push(prodSearch2[j])//new array of validated locations
              break
            }//end if
          }//end inner
        }//end outer
        
        dispatch({
          type:PRODUCT_SEARCH, //first product search is dispatched to redux
          payload: matchedTyres, 
        })//returns the result
        dispatch({
          type:SECONDARY_PRODUCT_SEARCH, //second product search is dispatched
          payload: matchedTyres2
        })//returns the result
        dispatch({
          type: PRODUCT_SEARCH_STATUS, //status is set after the searches have completed
          payload : false, 
          error : false, 
        })
        // dispatch({
        //   type: CLEAR_VRM,//clears the vrm input/array, not needed again, and if another search is done, will need to be empty
        // })
      })//secondary search(.then)
    }//end if statement to check for second search
  })//innitial product search (.then)
  .catch(error =>{ 
    // this.setState({hasError: true, loading : false});
    dispatch({
      type: PRODUCT_SEARCH_STATUS, 
      payload : false, 
      error : error.message, 
    })
    console.log(error,'product search error')
  })//end catch
}//end action 

 

  // this.sortingTrigger = () => {
  //   this.setState({
  //       lowCostSorting: ! this.state.lowCostSorting
  //   });
  

  export const locationCheck = (selectedobjId) => (dispatch, getState) =>{
    const state = getState()
    
    dispatch({
      type:LOCATION_SEARCH_STATUS,
      payload: false,
      loading: true,//stops the loading icon
      error: false,
      lastSearchLocation: state.global.lastSearchLocation, 
    })

    fetch(`https://qaapi.thevirtualwarehouse.co.uk/api/GetCusSiteDetails`,{//initial fetch for valid retail depots from cameo
    method:'GET',
    headers:{
      "Content-Type" : "application/json",
      "Cache-Control": "no-cache",
      'Authorization' : `${state.fetchData.loginToken}`,
      },
    }) //end of fetch
    .then(response => response.json())//converts the result into json
    .then((depotAddressResults)=>{
      const filteredDepotAddresses = depotAddressResults.filter((item) => {return item.sitePostcode !== ''}); //new array containing filtered results, blank postcodes have been removed.
      console.log('First fetch - Retail Depot locations : ', depotAddressResults)
      console.log('First fetch - Filtered Retail Depot locations : ', filteredDepotAddresses)
      console.log('')

        const parsedStockObjects = {'objId': selectedobjId}
        console.log(parsedStockObjects)
        fetch('http://qaapi.thevirtualwarehouse.co.uk/api/SiteQuantitiesSearch', {// QA API
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : `${state.fetchData.loginToken}`,
          },
        body: JSON.stringify (parsedStockObjects) //stringify changes javascript object into a regular string. mapquest requires json object.
        })//end of fetch
        .then(response => response.json())// turns response from api into JSON.
        .then((stockResults) => {
        const stock = stockResults

        // for loop to compare the valid retail depots against all the depot addresses.
        const validatedLocations = []
        const validatedStock =[]

        for (let i = 0, length = filteredDepotAddresses.length; i < length; i++) { //outer for loop gets the length of the first array, uses the length as an index

          for (let j=0, length2 = stock.length; j < length2; j++){ //inner for loop does the same except for the second array.

            if (filteredDepotAddresses[i].cusDepot === stock[j].cusDepot){ // if the depot addresses ID's match the retail depot locations AND the depot is a retail location
              validatedLocations.push(filteredDepotAddresses[i])//new array of validated locations
              validatedStock.push(stock[j])//new array of validated locations
              break
            }//end if

          }//end inner
        }//end outer

          const locations = validatedLocations.map((mappedPostCode) =>{ //array must be called locations for mapquest to work. -- uses the validated retail depots.
            return mappedPostCode.sitePostcode //extracts all of the postcodes from the array in preparation for mapquest.
          })
          locations.unshift(state.global.locationInput)//adds the user inputted postcode first in the array (map quest works out the distance from the first postcode)
          const parsedLocations = {locations, "options":{"allToAll": false,"manyToOne": true}}//exact format for mapquest search
          console.log('Second fetch - Parsed locations (for map quest)', parsedLocations)
          console.log('Second fetch - Stock quantity: ', stock)
          console.log('Second fetch - Validated Stock Locations: ', validatedLocations)
          console.log('')

            // fetch('http://www.mapquestapi.com/directions/v2/routematrix?key=XWrhxIOPoHlCh6JrC0lUnJiIBccweyKA', {// key2
            fetch(`http://www.mapquestapi.com/directions/v2/routematrix?key=75EbhZJKf2jBb2NJRPkRxc2o04GSRvUA`, {// key1
            method: 'POST',
            headers: {
              'Content-Type' : 'application/json',
              },
            body: JSON.stringify (parsedLocations) //stringify changes javascript object into a regular string. mapquest requires json object.
            })//end of fetch
            .then(response => response.json())// turns response from api into JSON.
            .then((mapQuestResults) => {
             if(mapQuestResults.info.statuscode !== 0){//checks the mapquest status code, 0 is a success
              const error = 'Location search was unsuccesful, Address does not exist'
              dispatch({
                type:LOCATION_SEARCH_STATUS,
                payload: true,//shows the postoode dialog
                loading: false,//stops the loading icon
                error: error,
                lastSearchLocation: state.global.lastSearchLocation,
              })
              throw error//if the postcode search is unsuccessful, this error is thrown and the promise chain is broken. 
             }
             
              mapQuestResults.distance.splice(0,1)//removes the first result (only added to get distances from others.)
              const distanceResults = mapQuestResults.distance.map((distance, index)=>{
              return{
                distance : distance.toFixed(1),//rounds the number up to 1 decimal place

                qty : validatedStock[index] ? validatedStock[index].qty : 0,
                siteId : validatedStock[index] ? validatedStock[index].siteId : 0,
                cusDepot : validatedStock[index] ? validatedStock[index].cusDepot : 0,
                objId : validatedStock[index] ? validatedStock[index].objId : 0,
                jobType: 1,//back end data needs to be changed to accomodate this.

                siteAddress1 : validatedLocations[index].siteAddress1,
                siteAddress2 : validatedLocations[index].siteAddress2,
                siteAddress3 : validatedLocations[index].siteAddress3,
                siteAddress4 : validatedLocations[index].siteAddress4,
                sitePostcode : validatedLocations[index].sitePostcode,
                siteTelephone1 : validatedLocations[index].siteTelephone1,
              }
            }
          )
          console.log('Third fetch - Raw Map Quest results: ', mapQuestResults)
          console.log('Third fetch - Map Quest results: ', distanceResults)
          console.log('')
          distanceResults.sort(function(low, high) {//sorting the mapped array
            return low.distance - high.distance
          });
          dispatch({
            type: LOCATION_SEARCH_RESULT,
            payload: distanceResults, 
          })
          dispatch({
            type:LOCATION_SEARCH_STATUS,
            payload: false,//shows the postoode dialog
            loading: false,//stops the loading icon
            error: false, 
            lastSearchLocation: state.global.locationInput,
          })
          console.log('Result 1: ', distanceResults[0])
          console.log('Result 2: ', distanceResults[1])
          console.log('Result 3: ', distanceResults[2])
          })//third promise and else statement
          
        })//second promise
      })//first promise
    .catch(error =>{
      console.log('fetch statement failed')
      dispatch({
        type:LOCATION_SEARCH_STATUS,
        payload: true,//shows the postcode dialog
        loading: false,//stops the loading icon
        error: error,
        lastSearchLocation: state.global.locationInput,
      })
    })//catch
  
  }

  export const getApppointmentTimes = (date, dateStamp) => (dispatch, getState) =>{
    const state = getState()
    let depotId = state.global.chosenDepot.cusDepot 
    let jobType = state.global.chosenDepot.jobType 

    dispatch({
      type:GET_APPOINTMENT_TIMES,
      payload: {},
      fetchedDay: undefined,
      timeLoading : true,
    })

    fetch(`http://gui-api.online-apps.co.uk/Scheduler/v1.0/GetAppointmentTimesForWeb?depotNumber=${depotId}&jobTypeCode=${jobType}&date=${date}`,{//initial fetch to retrieve the postcodes from cameo
      method:'GET',
      headers:{
        "Content-Type" : "application/json",
        "Cache-Control": "no-cache",
        "Authorization" : "Basic ZWxpdGU6ZWxpdGV0ZXN0",
      },
    }) //end of fetch
    .then(response => response.json())//converts the result into json
    .then((getAppointmentTimes) => {//anonmyous function with JSON results
      dispatch({
        type:GET_APPOINTMENT_TIMES,
        payload: getAppointmentTimes,
        timeLoading : false,
        fetchedDay: dateStamp,
      })
    })
  }


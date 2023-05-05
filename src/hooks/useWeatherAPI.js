import { useCallback,useEffect,useState } from "react"
/*
在Custom Hooks中因為最後不會回傳JSX，因此不需要匯入react套件提供的react物件
*/

const fetchCurrentWeather =({locationName, authorizationKey})=>{
    /*
    原本是在fetchCurrentWeather、fetchWeatherForecast這兩個函式，各自呼叫setWeatherElement來更新元件內的資料型態，
    現在因為我們希望等到這兩道API都取得回應才來呼叫setWeatherElement以更新資料，因此可進行如下的修改:
    1. 回傳透過API取得的資料，而不用在函式內呼叫setWeatherElement
    2. fetch方法本身會回傳Promise，因此這裡可以直接把fetch回傳出去(return fetch())，以便後續在async function中可以使用
    */
    /*
    原本的做法:
    setWeatherElement((prevState)=>({
      ...prevState,
      isLoading:true,
    }))
    */
    // 留意在這裡加上return直接把fetch API回傳的Promise再回傳出去
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`)
      .then((response)=>response.json())
      .then((data)=>{
        
        console.log('data',data)

        const locationData=data.records.location[0]

        const weatherElements=locationData.weatherElement.reduce(
          (neededElements,item)=>{
            if (['WDSD','TEMP'].includes(item.elementName)){
              neededElements[item.elementName]=item.elementValue
            }
            return neededElements
          },{}
        )
        /* 
        原本的做法:
        setWeatherElement((prevState)=>({
          ...prevState,
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          isLoading:false,
        }))
        */
        
        // 把取得的資料內容回傳出去，而不是在這裡setWeatherElement
        return{
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
        }
    })

}

const fetchWeatherForecast = ({cityName, authorizationKey}) => {
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`)
      .then((response)=>response.json())
      .then((data)=>{

        console.log('data',data)

        const locationData = data.records.location[0]
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements,item)=>{
            if (['Wx','PoP','CI'].includes(item.elementName)){
              neededElements[item.elementName]=item.time[0].parameter
            }
            return neededElements
          },
          {}
        )
        /*
        setWeatherElement((prevState)=>({
          ...prevState,
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
        }))
        */
        return {
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
        }
      })

}


// 為了讓也能取得資料(LOCATION_NAME、LOCATION_NAME_FORECAST、AUTHORIZATION_KEY)，可以透過函式的參數把資料帶進來
// 為了讓變數語意更清楚，將LOCATION_NAME_FORECAST改為cityName

const useWeatherAPI = ({locationName, cityName, authorizationKey}) => {

    // useState中用來定義weatherElement的部分
    const [weatherElement,setWeatherElement]=useState({
        observationTime: new Date(),
        locationName: '',
        temperature: 0,
        windSpeed: 0,
        description: '',
        weatherCode: 0,
        rainPossibility: 0,
        comfortability: '',
        isLoading: true,
    })


    // 透過useCallback用來定義fetchData()的部分
    // 把fetchData從useEffect中搬出來
    const fetchData = useCallback(async()=>{

    // 在開始拉取資料前，先把isLoading的狀態改成true
    setWeatherElement((prevState)=>({
      ...prevState,
      isLoading:true,
    }))

    // 使用Promise.all搭配await等待兩個API都取得回應後才繼續
    // 直接透過陣列的解構賦值來取出Promise.all回傳的資料
    const [currentWeather,weatherForecast] = await Promise.all([
        fetchCurrentWeather({locationName, authorizationKey}),
        fetchWeatherForecast({cityName, authorizationKey}),
    ])
    
    
    // 把取得的資料透過物件的解構賦值放入
    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading:false,
    })
  },[])



  // 透過useEffect用來呼叫fetchData的部分
  useEffect(()=>{
    console.log('execute function in useEffect')
    /*
    未改成async/await前的作法:
    fetchCurrentWeather()
    fetchWeatherForecast()
    */

    /*
    當fetchData這個函式定義在useEffect中時，因為在這整個useEffect中沒有相依於React內的資料型態(state或props)，
    因此在useEffect第二個參數的dependencies陣列中仍然可以留空就好(即,[])，
    也因為dependencies陣列內都固定沒有元素，因此只會在畫面第一次轉譯完成後被呼叫到而已。

    // 當函式不需要共用時，可以直接定義在useEffect中。

    這種在useEffect中定義函式並呼叫的作法本身沒有任何問題，但之前原本用來重新整理的按鈕已經失效了，
    因為原本用來呼叫API的fetchCurrentWeather和fetchWeatherForecast這兩個方法，
    現在都變成回傳promise而不是直接在取得資料後呼叫setWeatherElement來更新React元件內的資料型態。

    // 當函式需要共用時，可以拉到useEffect外。

    現在因為在useEffect中和在使用者點擊重新整理的按鈕時，都需要更新資料，
    故可將fetchData的方法搬到useEffect外，而後就可以在useEffect和onClick時都呼叫這個方法。

    */

    /*
    // 原本:當函式不需要共用時，可以直接定義在useEffect中

    // 在useEffect中定義async function，取名為fetchData
    const fetchData = async()=>{

      // 在開始拉取資料前，先把isLoading的狀態改成true
      setWeatherElement((prevState)=>({
        ...prevState,
        isLoading:true,
      }))

      // 使用Promise.all搭配await等待兩個API都取得回應後才繼續
      // 直接透過陣列的解構賦值來取出Promise.all回傳的資料
      const [currentWeather,weatherForecast] = await Promise.all([fetchCurrentWeather(),fetchWeatherForecast()])
      
      
      // 把取得的資料透過物件的解構賦值放入
      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading:false,
      })
    }
    */
    
    // 在useEffect中呼叫fetchData方法
    fetchData()

  },[fetchData])

  // 回傳要讓其他元件使用的資料或方法
  return [weatherElement,fetchData]
  /*
  最後一個步驟是和一般React元件最不同的地方，一般React元件最終都是回傳JSX元件，
  但在custom hooks中最後會return的是可以讓其他React元件使用的方法或資料。
  所以這裡會回傳用來拉取資料的方法(fetchData)和拉取資料後取得的天氣資料(weatherElement)
  */

}

export default useWeatherAPI
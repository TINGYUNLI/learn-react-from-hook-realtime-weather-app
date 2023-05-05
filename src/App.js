
/* 
import './App.css';

透過撰寫CSS-in-js的寫法，就不用再需要使用className的方式來套用樣式，
也不需要載入額外的./src/App.css，而是會把樣式和元件結合在一起
*/

import { useState,useEffect,useCallback,useMemo } from 'react';

import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';

import { getMoment, findLocation } from './utils/helpers';

import WeatherCard from './views/WeatherCard';
import useWeatherAPI from './hooks/useWeatherAPI';
import WeatherSetting from './views/WeatherSetting'

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

/*
載入emotion套件後，接著將原本定義在app.css中CSS樣式的內容，改有帶有樣式的元件，
這種帶有樣式的元件稱作styled component，這裡分別建立兩個名稱為container和weather-card的styled component
*/

// 定義帶有styled的component (注意:react元件都會以大寫駝峰來做命名)

/*
要建立一個帶有樣式的<div>標籤時，只需要使用styled.div
要建立一個帶有樣式的<button>標籤時，只需要使用styled.button

在styled.div後面加上兩個反引號``，在這兩個反引號中可以直接撰寫CSS

實際上這裡的styled.div是一個函式，而在函式後面直接加上反引號屬於Template Literals的一種用法
*/

const Container = styled.div`
  background-color: ${({theme})=>theme.backgroundColor};
  height:100%;
  display:flex;
  align-items:center;
  justify-content: center;
`;

/*
一開始透過import載入的SVG是一個React元件，如:<DayCloudyIcon />
若要為這個原本就存在的元件新增樣式，可以使用const 新元件=styled(原有元件)
*/
/*
後已將有關天氣圖示的呈現拆成另一個React元件，故省略以下:
const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;
*/


// 把上面定義好的styled-component當成元件使用

const AUTHORIZATION_KEY='CWB-CCF81A56-8AD3-4AE0-B639-4F30B17A5C6A'
/*
這兩個常數因為後來已可以透過currentLocation取得，因此可以把兩個常數移除
const LOCATION_NAME='臺北'
const LOCATION_NAME_FORECAST='臺北市'
*/


const App=()=>{

  /*
  未簡化/優化前:
  // 從localStorage取出先前保存的地區，若沒有保存過則給予預設值(臺北市)
  const storageCity = localStorage.getItem('cityName')||'臺北市'

  // 使用useState定義當前要拉取天氣資訊的地區(currentCity)，預設先訂為臺北市 useState('臺北市')
  // 帶入storageCity作為currentCity的預設值
  const [currentCity, setCurrentCity] = useState(storageCity)
  */
  
  /*
  因為呼叫localStorage去取其中的值這個方法，只需要在元件初始載入時呼叫即可，後面根本不需要再從localStorage拿資料
  而React元件每次畫面重新轉譯時，這個元件會整個再次執行(除非有特別使用useCallback或useMemo)

  可以透過在useState中帶入函式做為state初始值的方式，這個做法稱為「Lazy initialization」
  這個函式只有在元件初次載入時，state還沒有值才會被執行，如此便可避免重複一直查看localStorage的值，達到效能優化的效果

  (先前我們在useState的參數都是直接帶入一個值，但實際上他也可以放入函式，而該函式的回傳值會作為該state的預設值)
  Lazy initialization : 在useState放入函式，該函式的回傳值會作為該state的預設值，且這個函式只有在元件初次載入時，state還沒有值，需要取得state初始值，才會被執行
  */
  const [currentCity, setCurrentCity] = useState(()=>localStorage.getItem('cityName')||'臺北市')


  // 找出API需要帶入的locationName
  // 使用useMemo把取得的資料保存下來 ( 只要currentCity沒有改變的情況下，即使元件重新轉一，也不需要重新取值 )
  const currentLocation = useMemo(()=>findLocation(currentCity),[currentCity])
  /*
  未使用useMemo改寫前:
  const currentLocation = findLocation(currentCity)
  */

  // 再透過解構賦值取出currentLocation的資料
  const { cityName,locationName,sunriseCityName } = currentLocation

  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity)
  }

  /*
  在helpers中，已將所有LOCATION_NAME定義為locationName，將所有LOCATION_NAME_FORECAST定義為cityName
  原本程式為:  const[weatherElement, fetchData] = useWeatherAPI({
              locationName: LOCATION_NAME,
              cityName: LOCATION_NAME_FORECAST,
              authorizationKey: AUTHORIZATION_KEY,
              })
  */
  
  const[weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  })

  const [currentTheme,setCurrentTheme]=useState('light')

  /* 
  已移至useWeatherAPI:
  const [weatherElement,setWeatherElement]=useState({
    observationTime: new Date(),
    locationName: '',
    description: '',
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    isLoading:true,
    comfortability:'',
    weatherCode:0,
  })
  */

  /* 
  未使用useMemo優化前:
  const moment = getMoment(LOCATION_NAME_FORECAST)
  */
  /* 
  在helpers中已將LOCATION_NAME_FORECAST改為sunriseCityName，並將[]也放入sunriseCityName
  */
  const moment = useMemo(()=>getMoment(sunriseCityName),[sunriseCityName])

  /*
  這裡新增一個useEffect來幫設定主題配色，並且透過dependencies陣列的使用，只有當moment有改變時，才會再次執行樣式主題的更換。
  當moment是白天(day)時，套用亮色(light)的主題配色，否則套用暗色(dark)的主題配色
  */
  useEffect(()=>{
    setCurrentTheme(moment === 'day' ? 'light' : 'dark')
  },[moment])


  /*
  原本 : const fetchCurrentWeather = () => {...}
  後已移至./hooks/useWeatherAPI.js中
  */

  /*
  原本 : const fetchWeatherForecast = () => {...}
  後已移至./hooks/useWeatherAPI.js中
  */

  /* 
  原本:
  // 把fetchData從useEffect中搬出來
  const fetchData = useCallback(async()=>{...},[])
  後已移至./hooks/useWeatherAPI.js中
  */

  /*
  原本:
  useEffect(()=>{
    console.log('execute function in useEffect')
    // 在useEffect中呼叫fetchData方法
    fetchData()
  },[fetchData])
  後已移至./hooks/useWeatherAPI.js中
  */

  // 使用物件解構賦值的方法，先把要用到的資料取出來
  // 就可以將currentWeather.observationTime省略為observationTime
  // 已移至WeatherCard元件中，故可以省略以下:
  /*
  const {
    observationTime,
    locationName,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    isLoading,
    comfortability,
    weatherCode,
  } = weatherElement
  */


  // 定義currentPage這個State，預設值是WeatherCard
  const [currentPage,setCurrentPage]=useState('WeatherCard')

  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage)
  }


  return(
    
    // <ThemeProvider theme={theme.dark}> (未使用useState前的設定)
    <ThemeProvider theme={theme[currentTheme]}>

      <Container>

        {/* 利用條件轉譯的方式決定要呈現哪個元件 */}
        {currentPage==='WeatherCard' && (
          <WeatherCard
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
           
            // 將handleCurrentPageChange透過pros傳進WeatherCard
            handleCurrentPageChange={handleCurrentPageChange}
            // 將cityName透過pros傳進WeatherCard
            cityName={cityName}
          />
        )}

        {currentPage==='WeatherSetting'&& (
          <WeatherSetting

          // 將handleCurrentPageChange透過pros傳進WeatherSetting
          handleCurrentPageChange={handleCurrentPageChange}

          // 將cityName和handleCurrentCityChange傳入WeatherSetting元件中
          cityName={cityName}
          handleCurrentCityChange={handleCurrentCityChange}
          /> 
        )}


        {/*console.log('render,isLoading: ',isLoading)*/}

        {/* 
        <WeatherCard>...</WeatherCard>
        已將WeatherCard元件拆分出去，建立在./src/views/WeatherCard.js的<WeatherCardWrapper></WeatherCardWrapper>中
        */}
        
        {/* 
        將WeatherCard需要的資料，透過props從App元件傳入，其中包含:天氣資料(weatherElement)、白天或晚上(moment)
        因為在WeatherCard中的重新整理需要呼叫fetchData這個方法，所以也需要一併透過props傳入
        
        透過props不只可以傳遞字串、物件、陣列、數值，也可以直接把函式傳進去。
        */}

        {/* 
        未使用條件轉譯(切換頁面)前的程式碼:
        <WeatherCard
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData}
        />
        
        <WeatherSetting/>
        */}

      </Container>

    </ThemeProvider>
  )
}

export default App;




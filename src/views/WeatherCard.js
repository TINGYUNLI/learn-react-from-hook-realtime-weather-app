import React from "react";

import styled from '@emotion/styled';
import dayjs from 'dayjs';

import WeatherIcon from './../components/WeatherIcon.js';
import { ReactComponent as AirFlowIcon } from './../images/images/airFlow.svg';
import { ReactComponent as RainIcon } from './../images/images/rain.svg';
import { ReactComponent as RefreshIcon } from './../images/images/refresh.svg';
import { ReactComponent as LoadingIcon } from './../images/images/loading.svg';
import { ReactComponent as CogIcon } from './../images/images/cog.svg';


const WeatherCardWrapper = styled.div`
  position: relative;
  min-width:360px;
  box-shadow:${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  // box-sizing: border-box 加了此行變很窄
  padding:30px 15px;
`;

const Location = styled.div`
  font-size:28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
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

const Cog = styled(CogIcon)`
  position: absolute;
  top: 30px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color:  ${({ theme }) => theme.textColor};

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;

    /* 使用 rotate 動畫效果在 svg 圖示上 */
    animation:rotate infinite 1.5s linear;
    animation-duration:${({isLoading})=>(isLoading ? '1.5s' : '0s')}
  }
  
  /* 定義旋轉的動畫效果，並取名為 rotate */

  @keyframes rotate{
    from{
      transform:rotate(360deg)
    }
    to{
      transform:rotate(0deg)
    }
  }

`;

/*
剛剛寫好的styled-component本質上就是React元件
而最後在HTML中呈現出來就會是帶有一個特殊class name的<div>
*/

// 把上面定義好的styled-component當成元件使用

/*
原本為 : const WeatherCard = () =>
接著在WeatherCard中取出傳入的props，並以解構賦值的方式將變數取出
故在()中放入{weatherElement, moment, fetchData}
*/
/*
從props取出handleCurrentPageChange : {weatherElement, moment, fetchData,handleCurrentPageChange}
從props取出cityName:{weatherElement, moment, fetchData,handleCurrentPageChange,cityName}
*/
const WeatherCard = ({weatherElement, moment, fetchData,handleCurrentPageChange,cityName}) => {
    
    // 使用物件解構賦值的方法，先把要用到的資料取出來
    // 就可以將currentWeather.observationTime省略為observationTime
    const {
        observationTime,
        locationName,
        temperature,
        windSpeed,
        description,
        weatherCode,
        rainPossibility,
        comfortability,
        isLoading, 
    } = weatherElement;


    return(
        <WeatherCardWrapper>

          {/* 當齒輪被點擊時，將currentPage改成handleCurrentPageChange */}
          <Cog onClick={()=>handleCurrentPageChange('WeatherSetting')} />

          <Location>{cityName}</Location>
          <Description>
            {description}{comfortability}
          </Description> 

          <CurrentWeather>
            <Temperature>
              {Math.round(temperature)} <Celsius>°C</Celsius>
            </Temperature>
            {/* <DayCloudy/> 後已將有關天氣圖示的呈現拆成另一個React元件，故省略 */}
            {/* 將weatherCode 和 moment 以 prop 傳入WeatherIcon */}
            
            <WeatherIcon weatherCode={weatherCode} moment={moment} />
            {/* 原本 : <WeatherIcon weatherCode={weatherCode} moment='night' /> */}
          </CurrentWeather>

          <AirFlow>
            <AirFlowIcon /> {windSpeed} m/h
          </AirFlow>

          <Rain>
            <RainIcon /> {rainPossibility}%
          </Rain>

          {/* 
          原本下方程式為:
           onClick={()=>{
              fetchCurrentWeather()
              fetchWeatherForecast()
            }}
          */}
          <Refresh 
            onClick={fetchData}
            isLoading={isLoading}
          >
            最後觀測時間：
            {new Intl.DateTimeFormat('zh-TW',{
              hour:'numeric',
              minute:'numeric',
            }).format(dayjs(observationTime))}{''} 
            {isLoading ? <LoadingIcon /> : <RefreshIcon />}
          </Refresh>

        </WeatherCardWrapper>
    )
}

export default WeatherCard

/*
  最後觀測時間：
  {new Intl.DateTimeFormat('zh-TW',{
    hour:'numeric',
    minute:'numeric',
  }).format(new Date(currentWeather.observationTime))}{''}  

  1. {''}
     因為在JSX中預設的空格最後在網頁呈現時都會被過濾掉，因此如果希望最後在頁面上元件和元件間是留有空格的，
     就可以透過帶入空字串的方式來加入空格。

  2. new Date()
     使用new Date()將日期字串轉換為合法的Javascript日期物件。
     但在跨不同瀏覽器時，在safari將會出現錯誤訊息(safari不支援此用法)
     此時可以使用dayjs來處理跨瀏覽器的問題
     故將new Date()改成dayjs()


*/

/*
{isLoading ? <LoadingIcon /> : <RefreshIcon />}
使用三元判斷式來做到條件轉譯，當isLoading為true時顯示LoadingIcon，否則顯示RefreshIcon
*/
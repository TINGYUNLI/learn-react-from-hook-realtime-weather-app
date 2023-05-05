import styled from '@emotion/styled';
import { useMemo } from 'react';

import { ReactComponent as DayCloudyIcon } from './../images/images/day-cloudy.svg';
import { ReactComponent as DayClear } from './../images/images/day-clear.svg';
import { ReactComponent as DayCloudy } from './../images/images/day-cloudy.svg';
import { ReactComponent as DayCloudyFog } from './../images/images/day-cloudy-fog.svg';
import { ReactComponent as DayFog } from './../images/images/day-fog.svg';
import { ReactComponent as DayPartiallyClearWithRain } from './../images/images/day-partially-clear-with-rain.svg';
import { ReactComponent as DaySnowing } from './../images/images/day-snowing.svg';
import { ReactComponent as DayThunderstorm } from './../images/images/day-thunderstorm.svg';
import { ReactComponent as NightClear } from './../images/images/night-clear.svg';
import { ReactComponent as NightCloudy } from './../images/images/night-cloudy.svg';
import { ReactComponent as NightCloudyFog } from './../images/images/night-cloudy-fog.svg';
import { ReactComponent as NightFog } from './../images/images/night-fog.svg';
import { ReactComponent as NightPartiallyClearWithRain } from './../images/images/night-partially-clear-with-rain.svg';
import { ReactComponent as NightSnowing } from './../images/images/night-snowing.svg';
import { ReactComponent as NightThunderstorm } from './../images/images/night-thunderstorm.svg';

const IconContainer = styled.div`
    flex-basis: 30%;

    svg{
        max-height:110px;
    }

`

const weatherTypes = {
    isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
    isClear: [1],
    isCloudyFog: [25, 26, 27, 28],
    isCloudy: [2, 3, 4, 5, 6, 7],
    isFog: [24],
    isPartiallyClearWithRain: [8,9,10,11,12,13,14,19,20,29,30,31,32,38,39],
    isSnowing: [23, 37, 42],
  };


const weatherIcons = {
day: {
    isThunderstorm: <DayThunderstorm />,
    isClear: <DayClear />,
    isCloudyFog: <DayCloudyFog />,
    isCloudy: <DayCloudy />,
    isFog: <DayFog />,
    isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
    isSnowing: <DaySnowing />,
},
night: {
    isThunderstorm: <NightThunderstorm />,
    isClear: <NightClear />,
    isCloudyFog: <NightCloudyFog />,
    isCloudy: <NightCloudy />,
    isFog: <NightFog />,
    isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
    isSnowing: <NightSnowing />,
},
};


// 使用迴圈來找出該天氣代碼對應到的天氣狀型態
const weatherCode2Type = (weatherCode) => {
    const [weatherType] = 
        Object.entries(weatherTypes).find(([weatherType,weatherCodes])=>
            weatherCodes.includes(Number(weatherCode))
        ) || []
    
    return weatherType
}
/*
驗證上述迴圈之結果:(假設取得天氣代碼為1)
const weatherCode=1
console.log(weatherCode2Type(weatherCode)) // isClear
*/


const WeatherIcon = ({weatherCode,moment}) => {

    // 使用useMemo
    const weatherType = useMemo(()=>weatherCode2Type(weatherCode),[weatherCode])

    /*
    透過useMemo取得並保存weatherCode2Type計算的結果，回傳的結果一樣取名為weatherType，
    可以看到，只要把weatherCode2Type得到的運算結果作為回傳值即可
    
    記得在useMemo的dependencies，在陣列中放入weatherCode，當weatherCode的值有變化的時候，useMemo就會重新計算取值
    */
    /*
    未使用useMemo前:
    // 將天氣代碼轉成天氣型態 
    const weatherType = weatherCode2Type(weatherCode)
    */
    
    // 根據天氣型態和moment取得對應的圖示
    const weatherIcon = weatherIcons[moment][weatherType]

    return <IconContainer>{weatherIcon}</IconContainer>
    /* 
    將天氣代碼的資料從App元件傳入WeatherIcon前:
    return(
        <IconContainer>
            <DayCloudy />
        </IconContainer>
    )
    */
}

export default WeatherIcon;

/*
useMemo和useCallback都是作為效能優化的工具之一
這裡使用useMemo的目的是避免當元件重新轉譯但函示帶入的參數(weatherCode)相同時所導致不必要的運算，
因為weatherCode相同的情況下，回傳的相同的情況下，回傳的weatherType一定也相同，不需要再重算一次。

和useCallback一樣，多數情況下沒有使用useMemo程式依然能夠正確運行，
適當運用這些優化效能的方法，可以幫助程式減少部必要的重複運算，但不適當或多餘的使用卻仍有可能導致效能變差
*/
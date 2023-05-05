
import {useState} from 'react'

import styled from '@emotion/styled'
import { availableLocations } from '../utils/helpers'

const WeatherSettingWrapper = styled.div`
position: relative;
min-width: 360px;
box-shadow: ${({ theme }) => theme.boxShadow};
background-color: ${({ theme }) => theme.foregroundColor};
box-sizing: border-box;
padding: 20px;
`

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledSelect = styled.select`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-shadow: none;
  outline: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;
    font-size: 14px;
    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }
    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

/* 從props取出handleCurrentPageChange */
/* 從props取出cityName,handleCurrentCityChange */
const WeatherSetting = ({handleCurrentPageChange,cityName,handleCurrentCityChange}) => {

    const [locationName,setLocationName]=useState(cityName)

    const handleChange = (e) => {
        console.log(e.target.value)

        // 把使用者輸入的內容更新到React內的資料狀態
        setLocationName(e.target.value)
    }

    const handleSave = () => {
        console.log('locationName',locationName)
        console.log(`儲存的地區資訊為 : ${locationName}`)

        // 更新App元件中的currentcity名稱
        handleCurrentCityChange(locationName)
        // 切換回WeatherCard的頁面
        handleCurrentPageChange('WeatherCard')

        // 點擊儲存時，順便將使用者選擇的縣市名稱存入localStorage中
        localStorage.setItem('cityName',locationName)
    }

    return(
        <WeatherSettingWrapper>
            <Title>設定</Title>
            <StyledLabel htmlFor='location'>地區</StyledLabel>

            {/* 使用onChange事件來監聽使用者輸入的資料，並且當事件觸發時呼叫handleChange */}
            <StyledSelect 
                id='location' 
                name='location' 
                onChange={handleChange}

                // 透過value可以讓資料與畫面相對應 ( React會自動把這個value帶入的值當作該欄位的預設值呈現出來 )
                value={locationName}
            >
                {/* 定義可以選擇的地區選項 */}
                {/* 透過物件的解構直接將需要的cityName屬性取出 */}
                {availableLocations.map(({cityName})=>(
                    <option value={cityName} key={cityName}>
                        {cityName}
                    </option>
                ))}
                {/*
                原本未解構前:
                {availableLocations.map((location)=>(
                    <option value={location.cityName} key={location.cityName}>
                        {location.cityName}
                    </option>
                ))}
                */}
            </StyledSelect>

            <ButtonGroup>
                {/* 呼叫handleCurrentPageChange來換頁 */}
                <Back onClick={()=>handleCurrentPageChange('WeatherCard')}>返回</Back>
                {/* 點擊儲存按鈕時，觸發handleSave */}
                <Save onClick={handleSave}>儲存</Save>
            </ButtonGroup>
        
        </WeatherSettingWrapper>

    )
}

export default WeatherSetting

/*
{availableLocations.map(({cityName})=>(
                <option value={cityName} key={cityName}>
                    {cityName}
                </option>
            ))}


    此段程式的作用是將availableLocations這個陣列中的每個元素都轉換成一個下拉式選單，並放置到頁面上

    使用 map 方法將 availableLocations 這個陣列中的每個元素都轉換成一個 JSX 元素，並將這些元素放入一個陣列中，最後渲染成一個 select 元素。

    具體來說，map 方法會遍歷 availableLocations 陣列中的每個元素，對於每個元素都會執行一次回呼函式。
    回呼函式的參數 {cityname} 是一個物件解構賦值，表示將 cityname 屬性解構出來，變成一個單獨的變數。

    回呼函式內的程式碼是一個 JSX 元素，這個元素是 option，表示一個下拉選單中的一個選項。
    其中 value 屬性設置為 {cityname}，表示這個選項的值為 cityname，key 屬性設置為 {citynamee}，表示這個選項的唯一標識為 citynamee，顯示內容為 {cityname}。
*/
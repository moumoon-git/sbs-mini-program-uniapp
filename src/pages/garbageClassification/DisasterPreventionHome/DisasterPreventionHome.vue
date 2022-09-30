<template>
  <view class="DisasterPreventionHome" @click="getSubscribeMessage">
    <header
      class="header"
      :style="{
        backgroundImage: `url(${imgStaticUrl}/img/DisasterPreventionHome/home-header-background.png)`,
      }"
    >
        <!-- <h4>{{platformInfo.townName}}</h4> -->
        <h1>{{platformInfo.customName}}</h1>
    </header>
    <article 
        class="weather-panel"
        :style="{
            backgroundImage: `url(${imgStaticUrl}/img/DisasterPreventionHome/weather-background.png)`,
        }"
    >
        <section>
            <div class="city">
                <label>广州市</label>
                <span>{{`${weather.daily.temperature[0].avg}°`}}</span>
            </div>
            <div class="today-weather">
                <i 
                  :style="{
                      backgroundImage: `url(${imgStaticUrl}/img/weather/${weather.daily.skycon.length!=0?weather.daily.skycon[0].value:'PARTLY_CLOUDY_DAY'}.png)`,
                  }"
                ></i>
                <p>{{getWeatherDescription}}</p>
                <p>
                    <span>{{`最高：${Object.keys(weather).length!=0?weather.daily.temperature[0].max:0}°`}}</span>
                    <span style="margin-left: 20rpx;">{{`最低：${Object.keys(weather).length!=0?weather.daily.temperature[0].min:0}°`}}</span>
                </p>
            </div>
        </section>
        <section>
          <div class="time-weather"  v-for="(hourlyItem,hourlyIndex) in weather.hourly.temperature" :key="hourlyIndex">
            <span>{{`${hourlyItem.hour}时`}}</span>
            <i
              :style="{
                backgroundImage: `url(${imgStaticUrl}/img/weather/${weather.hourly.skycon[hourlyIndex].value}.png)`,
              }"
            ></i>
            <span>{{`${hourlyItem.value}°`}}</span>
          </div>
        </section>
    </article>
    <nav>
      <section
        v-for="(item, index) in menuList"
        :key="index"
        :data-redirectTo="item.url"
        @click="handleNavigate"
      >
        <i
          :style="{
            backgroundImage: `url(${imgStaticUrl}/img/DisasterPreventionHome/disasterPrevention-sprite.png)`
          }"
          :class="{
            'YHBG': item.className == 'YHBG',
            'VOLUNTARY_SERVICE': item.className == 'VOLUNTARY_SERVICE',
            'TASK_MANAGEMENT': item.className == 'TASK_MANAGEMENT',
            'CARE_AND_MUTUAL_ASSISTANCE': item.className == 'CARE_AND_MUTUAL_ASSISTANCE',
            'PUBLICITY_ANNOUNCEMENT': item.className == 'PUBLICITY_ANNOUNCEMENT',
          }"
        ></i>
        <label>{{ item.name }}</label>
        <span v-if="item.className == 'YHBG'">PROBLEM</span>
        <span v-if="item.className == 'VOLUNTARY_SERVICE'">VOLUNTEER</span>
        <span v-if="item.className == 'TASK_MANAGEMENT'">TASK</span>
        <span v-if="item.className == 'CARE_AND_MUTUAL_ASSISTANCE'">CARE FOR</span>
        <span v-if="item.className == 'PUBLICITY_ANNOUNCEMENT'">PROPAGANDA</span>
      </section>
    </nav>
  </view>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DisasterPreventionHome',
  data() {
    return {
      imgStaticUrl: this.$imgStaticUrl,
      requestSubscribeMessageAble: false,
      weather: {
        daily: {
          skycon: [],
          temperature: []
        },
        hourly: {
          skycon: [],
          temperature: []
        }
      }
    };
  },
  props: {
    platformInfo: {
      type: Object,
      default: () => {}
    },
    menuList: {
      type: Array,
      default: () => []
    },
  },
  components: { },
  computed: {
    getWeatherDescription() {
      let value = this.weather.daily.skycon.length!=0?this.weather.daily.skycon[0].value:'';
      let description;
      switch(value) {
        case 'CLEAR_DAY':
          description = '晴（白天）'; break;
        case 'CLEAR_NIGHT':
          description = '晴（夜间）'; break;
        case 'PARTLY_CLOUDY_DAY':
          description = '多云（白天）'; break;
        case 'PARTLY_CLOUDY_NIGHT':
          description = '多云（夜间）'; break;
        case 'CLOUDY':
          description = '阴'; break;
        case 'LIGHT_HAZE':
          description = '轻度雾霾'; break;
        case 'MODERATE_HAZE':
          description = '中度雾霾'; break;
        case 'HEAVY_HAZE':
          description = '重度雾霾'; break;
        case 'LIGHT_RAIN':
          description = '小雨'; break;
        case 'MODERATE_RAIN':
          description = '中雨'; break;
        case 'HEAVY_RAIN':
          description = '大雨'; break;
        case 'STORM_RAIN':
          description = '暴雨'; break;
        case 'FOG':
          description = '雾'; break;
        case 'LIGHT_SNOW':
          description = '小雪'; break;
        case 'MODERATE_SNOW':
          description = '中雪'; break;
        case 'HEAVY_SNOW':
          description = '大雪'; break;
        case 'STORM_SNOW':
          description = '暴雪'; break;
        case 'DUST':
          description = '浮尘'; break;
        case 'SAND':
          description = '沙尘'; break;
        case 'WIND':
          description = '大风'; break;
        default:
          break;
      }
      return description;
    }
  },
  onLoad() {
  },
  created() {
    this.getGeneralWeather();
  },
  mounted() {
  },
  methods: {
    // 订阅消息
    subscribeMessage() {
      let that = this;
      wx.requestSubscribeMessage({
        tmplIds: ['EqqUmyDd81QjKtPo553rzrv0_1WMtUPok1m74MN3dEM'],
        success(res) {
          console.log('wx.requestSubscribeMessage res', res);
          that.requestSubscribeMessageAble = res.errMsg.includes('ok');
        },
      });
    },
    getSubscribeMessage() {
      if (!this.requestSubscribeMessageAble) {
        this.subscribeMessage();
      }
    },
    // 页面跳转
    handleNavigate(event) {
      wx.navigateTo({
        url: event.currentTarget.dataset.redirectto,
      });
    },
    getGeneralWeather() {
      this.$http
        .get({
          baseUrl: 'https://api.caiyunapp.com',
          url: `/v2.5/nFe8q4YrUQeiHfQs/113.264434,23.129162/weather.json`,
          data: {
            userId: wx.getStorageSync('userId'),
          },
        }).then((res) => {
          console.log('https://api.caiyunapp.com/v2.5/nFe8q4YrUQeiHfQs/113.264434,23.129162/weather.json', res);
          if (res.statusCode == 200) {
            res.data.result.daily.temperature[0].avg = parseInt(res.data.result.daily.temperature[0].avg);
            res.data.result.daily.temperature[0].min = parseInt(res.data.result.daily.temperature[0].min);
            res.data.result.daily.temperature[0].max = parseInt(res.data.result.daily.temperature[0].max);
            res.data.result.hourly.temperature.splice(6);
            res.data.result.hourly.temperature.forEach(item => {
              item.hour = new Date(item.datetime).getHours();
              item.value = parseInt(item.value);
            });
            this.weather = res.data.result;
            console.log('this.weather',this.weather)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'error',
            });
          }
        });
    } 
  },
});
</script>

<style lang="less" scoped>
page {
  height: 100%;
}
.DisasterPreventionHome {
  height: 100%;
  overflow: auto;
  display: block;
  padding: 0rpx;
  box-sizing: border-box;
  background: #FFFFFF;
  .header {
    width: 100%;
    height: 340rpx;
    background-size: 100vw 340rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: fixed;
    top: 0%;
    left: 0%;
    h4 {
        font-size: 45rpx;
        font-weight: 600;
        color: #FFFFFF;
        letter-spacing: 1rpx;
        text-shadow: 0rpx 1rpx 4rpx rgba(0, 0, 0, 0.38);
        margin-top: 80rpx;
    }
    h1 {
        font-size: 60rpx;
        font-weight: 600;
        color: #FFFFFF;
        letter-spacing: 1rpx;
        text-shadow: 0rpx 1rpx 4rpx rgba(0, 0, 0, 0.38);
    }
  }
  .weather-panel {
    width: 94.7%;
    box-sizing: border-box;
    background-size: 94.5vw 300rpx;
    background-repeat: no-repeat;
    padding: 20rpx 30rpx;
    position: fixed;
    top: 365rpx;
    left: 50%;
    transform: translateX(-50%);
    .city {
        display: flex;
        flex-direction: column;
        label {
            font-size: 32rpx;
            font-weight: 400;
            color: #FFFFFF;
        }
        span {
            font-size: 80rpx;
            font-weight: 400;
            color: #FFFFFF;
            letter-spacing: 1rpx;
        }
    }
    .today-weather {
        display: flex;
        flex-direction: column;
        margin-left: auto;
        margin-right: 0rpx;
        align-items: flex-end;
        justify-content: space-around;
        i {
            display: inline-block;
            width: 34rpx;
            height: 34rpx;
            background-size: 34rpx 34rpx;
            background-repeat: no-repeat;
        }
        p {
            font-size: 28rpx;
            font-weight: 500;
            color: #FFFFFF;
        }
    }
    &>section:first-of-type {
        display: flex;
    }
    &>section:last-of-type {
        display: flex;
        justify-content: space-between;
        margin-top: 10rpx;
    }
    .time-weather {
      display: flex;
      flex-direction: column;
      span:nth-of-type(1) {
        font-size: 24rpx;
        font-weight: 500;
        color: #FFFFFF;
      }
      i {
        display: inline-block;
        width: 34rpx;
        height: 34rpx;
        background-size: 34rpx 34rpx;
        background-repeat: no-repeat;
      }
      span:nth-of-type(2) {
        font-size: 28rpx;
        font-weight: 500;
        color: #FFFFFF;
      }
    }
  }
  nav {
    width: 94.7vw;
    max-height: 518rpx;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    position: fixed;
    top: 688rpx;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    & > section {
      position: relative;
      border-radius: 15rpx;
      width: 29vw;
      height: 31vw;
      margin: 0rpx 3.65vw 3.45vw 0rpx;
      i {
        display: inline-block;
        position: absolute;
        width: 80rpx;
        height: 85rpx;
        background-size: 512rpx 115rpx;
        background-repeat: no-repeat;
        top: 10%;
        left: 10%;
        &.YHBG {
          background-position: -14rpx -14rpx;
        }
        &.VOLUNTARY_SERVICE {
          background-position: -110rpx -22rpx;
        }
        &.TASK_MANAGEMENT {
          background-position: -210rpx -22rpx;
        }
        &.CARE_AND_MUTUAL_ASSISTANCE {
          background-position: -310rpx -22rpx;
        }
        &.PUBLICITY_ANNOUNCEMENT {
          background-position: -410rpx -14rpx;
        }
      }
      label {
        font-size: 32rpx;
        font-weight: 600;
        color: #333333;
        position: absolute;
        top: 50%;
        left: 10%;
      }
      span {
        font-size: 24rpx;
        font-weight: 200;
        color: rgba(153,153,153,0.3);
        position: absolute;
        top: 75%;
        left: 10%;
      }
      &:nth-of-type(1n) {
        background: rgba(255,250,244,0.8);
      }
      &:nth-of-type(2n) {
        background: rgba(252,246,245,0.8);
      }
      &:nth-of-type(3n) {
        background: rgba(245,247,255,0.8);
        margin-right: 0rpx;
      }
      &:nth-of-type(4n) {
        background: rgba(252,246,245,0.8);
      }
      &:nth-of-type(5n) {
        background: rgba(252,247,255,0.8);
      }
    }
  }
}
</style>

import Vue from 'vue'
import GptAd from './gpt-ad'

Vue.use(GptAd, {
  adNetwork: '40175602',
  mode: 'dev',
  isAdDisable: false,
})

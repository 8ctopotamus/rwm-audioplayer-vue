import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import './scss/main.scss'

// get user's settings
const rwPlayer = document.getElementById('rw-player')
const slug = rwPlayer.dataset.slug || 'sg'
const color = rwPlayer.dataset.color || 'LightSeaGreen'
const playlist = rwPlayer.dataset.playlist !== undefined ? true : false
const autoplay = rwPlayer.dataset.autoplay !== undefined ? true : false
const rwmlink = rwPlayer.dataset.rwmlink !== undefined ? true : false

new Vue({
  el: '#rw-player',
  data () {
    return {
      autoplay,
      color,
      playlist,
      slug,
      rwmlink
    }
  },
  render: function (createElement) {
    return createElement(App, {
      props: {
        autoplay: this.autoplay,
        color: this.color,
        playlist: this.playlist,
        slug: this.slug,
        rwmlink: this.rwmlink
      }
    })
  }
})

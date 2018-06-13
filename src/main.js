import Vue from 'vue'
import App from './App.vue'

import './scss/main.scss'

Vue.config.productionTip = false

// get player options
const slug = document.getElementById('rw-player').dataset.slug || 'sg'
const color = document.getElementById('rw-player').dataset.color || 'blue'
const playlist = document.getElementById('rw-player').dataset.playlist || true
const autoplay = document.getElementById('rw-player').dataset.autoplay || false

new Vue({
  el: '#rw-player',
  data () {
    return {
      autoplay,
      color,
      playlist,
      slug
    }
  },
  render: function (createElement) {
    return createElement(App, {
      props: {
        autoplay: this.autoplay,
        color: this.color,
        playlist: this.playlist,
        slug: this.slug
      }
    })
  }
})

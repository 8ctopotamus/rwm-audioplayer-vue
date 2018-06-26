<template>
  <div id="app">
    <noscript>
      <strong>We're sorry but the <em>Real</em> Wealth<sup>&reg;</sup> audio player doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>

    <div v-if="error">
      Error: {{error}}
    </div>

    <radar-spinner
      id="loading"
      v-if="loading"
      :animation-duration="2000"
      :size="60"
      :color="color"
    />

    <div v-if="!loading && !error">
      <aplayer
        autoplay
        :music="currentPodcast"
        :list="podcasts"
        :color="color"
      >
        <span
          slot="display"
          slot-scope="{currentMusic, playStat}"
          v-html="currentMusic.description"
        />
      </aplayer>
      <action-buttons
       :advisor="advisor"
       :podcast="currentPodcast"
       :color="color"
      ></action-buttons>
    </div>
  </div>
</template>

<script>
import ActionButtons from './components/ActionButtons.vue'
import Aplayer from 'vue-aplayer'
import axios from 'axios'
import moment from 'moment'
import { RadarSpinner } from 'epic-spinners'

const API_URL = 'https://realwealthmarketing.com/wp-json/wp/v2'
const CURRENT_DATE = moment().format('YYYY-MM-DD')
const ONE_YEAR_AGO = moment().subtract(1, 'year').format('YYYY-MM-DD')
const TWO_YEARS_AGO = moment().subtract(2, 'years').format('YYYY-MM-DD')

export default {
  name: 'app',
  props: [
    'autoplay',
    'color',
    'playlist',
    'slug'
  ],
  data () {
    return {
      loading: true,
      error: false,
      advisor: null,
      group: null,
      frequency: null,
      podcastDBPageNum: 1,
      podcasts: [],
      currentPodcast: {},
    }
  },
  mounted () {
    this.getAdvisorData()
  },
  methods: {
    getAdvisorData () {
      axios.get(`${API_URL}/users?slug=${this.slug}`)
        .then(res => {
          if (res.data.length === 0)
              return this.error = true

          this.advisor = res.data[0]

          // determine group access
          switch(this.advisor.acf.compliance_group) {
            case 'generic':
              this.group = '?group-access=68'
              break
            case 'bifs':
              this.group = '?group-access=125'
              break
            case 'brookstone':
              this.group = '?group-access=113'
              break
            case 'cambridge':
              this.group = '?group-access=104'
              break
            case 'cfd':
              this.group = '?group-access=112'
              break
            case 'firstheartlandcapital':
              this.group = '?group-access=60'
              break
            case 'harbour':
    					group = '?group-access=136'
    					break
            case 'garepple':
              this.group = '?group-access=109'
              break
            case 'gretchenevans':
              this.group = '?group-access=61'
              break
            case 'theleadersgroup':
              this.group = '?group-access=111'
              break
            case 'legacy':
              this.group = '?group-access=133'
              break
            case 'mholdings':
    					group = '?group-access=135'
    					break
            case 'naifa':
              this.group = '?group-access=62'
              break
            case 'nationalplanningcorporation':
              this.group = '?group-access=63'
              break
            case 'nextfinancial':
              this.group = '?group-access=57'
              break
            case 'oneamericaib':
              this.group = '?group-access=67'
              break
            case 'onesco':
              this.group = '?group-access=101'
              break
            case 'prosperitycapitaladvisors':
              this.group = '?group-access=59'
              break
            case 'questarcapitalassets':
              this.group = '?group-access=64'
              break
            case 'signator':
              this.group = '?group-access=132'
              break
            case 'sfa':
              this.group = '?group-access=110'
              break
            case 'woodburyfinancialservices':
              this.group = '?group-access=66'
              break
            case 'voya':
              this.group = '?group-access=131'
              break
            default:
              group = ''
          }

          // determine podcast frequency (weekly or monthly)
          if (this.advisor.acf.podcast_frequency === 'weekly') {
            this.frequency = '&podcast-frequency=51'
          }
          else {
            this.frequency = '&podcast-frequency=52'
          }

          this.getPodcasts()
        })
        .catch(err => {
          console.log(err)
          return this.error = err
        })
    },
    getPodcasts () {
      axios.get(`${API_URL}/podcasts${this.group}${this.frequency}&page=${this.podcastDBPageNum}`)
        .then(res => {
          this.podcasts = res.data.map(pod => {
            return {
              title: pod.title.rendered,
              artist: pod.acf.guest_info[0].guest_name,
              src: pod.acf.podcast_file,
              pic: pod.better_featured_image.media_details.sizes.thumbnail.source_url,
              description: pod.acf.email_for_clients
            }
          })
          this.currentPodcast = this.podcasts[0]
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          return this.error = err
        })
    }
  },
  components: {
    ActionButtons,
    Aplayer,
    RadarSpinner
  },
}
</script>

<style lang="scss">
  #app {
    #loading {
      margin: 60px auto;
    }
    .aplayer {
      .aplayer-body {
        .aplayer-pic {
          top: 80px;
          .aplayer-button {
            background: rgba(0,0,0,.5);
          }
          .aplayer-play {
            bottom: 163%;
          }
          .aplayer-pause {
            height: 26px;
            width: 26px;
            bottom: 140%;
            right: 18px;
            .aplayer-icon-pause {
              height: 16px;
              width: 16px;
              top: 5px;
              left: 5px;
            }
          }
        }
        .aplayer-info {
          height: auto !important;
          .aplayer-music {
            .aplayer-title {
              display: block !important;
              font-size: 24px !important;
            }
          }
        }
      }
    }

  }
</style>

<template>
  <div id="app">
    <noscript>
      <strong>We're sorry but the <em>Real</em> Wealth<sup>&reg;</sup> audio player doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>

    <div v-if="message !== ''" class="message" :class="{error: error}">
      {{message}}
      <button type="button" name="dismiss" @click="dismissMessage">Ok</button>
    </div>

    <radar-spinner
      id="loading"
      v-if="loading"
      :animation-duration="2000"
      :size="60"
      :color="color"
    />

    <div v-if="!loading">
      <aplayer
        :autoplay="autoplay"
        :music="currentPodcast"
        :list="podcasts"
        :listFolded="!playlist"
        :theme="color"
        :style="{borderTop: `3px solid ${color}`}"
      >
        <div
          slot="display"
          slot-scope="{currentMusic, playStat}"
        >
          <span v-html="currentMusic.description" />
          <action-buttons
            :color="color"
            :podcast="currentPodcast"
            @show-modal="showModal($event)"
          ></action-buttons>
        </div>
      </aplayer>
      <a
        v-if="rwmlink"
        class="rwm-link"
        :href="'https://realwealthmedia.com/' + advisor.slug"
        target="_blank"
        :style="{color: color}"
      >
        Visit {{advisor.name}}'s <em>Real</em> Wealth<sup>&reg;</sup> Media page &raquo;
      </a>
      <modal v-if="modal" @close="modal = false">
        <h3 slot="header" :style="{color: color}">{{ formTitle }}</h3>
        <div slot="body">
          <Forms
            :advisor="advisor"
            :podcast="currentPodcast"
            :form-name="formName"
            :color="color"
            @submission-response="showMessage($event)"
          />
        </div>
      </modal>
    </div>

  </div>
</template>

<script>
import ActionButtons from './components/ActionButtons.vue'
import Aplayer from 'vue-aplayer'
import axios from 'axios'
import Forms from './components/Forms.vue'
import Modal from './components/Modal.vue'
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
    'slug',
    'rwmlink'
  ],
  data () {
    return {
      loading: true,
      error: false,
      message: '',
      modal: false,
      advisor: null,
      group: null,
      frequency: null,
      podcastDBPageNum: 1,
      podcasts: [],
      currentPodcast: {},
      formName: '',
      formTitle: '',
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
            return this.error = "No advisor found."

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
              this.group = '?group-access=136'
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
            case 'lionstreet':
              this.group = '?group-access=138'
              break
            case 'mholdings':
              this.group = '?group-access=135'
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
              this.group = ''
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
          return this.error = err
        })
    },
    getPodcasts () {
      axios.get(`${API_URL}/podcasts${this.group}${this.frequency}&page=${this.podcastDBPageNum}`)
        .then(res => {
          this.podcasts = res.data
            .filter(function(podcast) {
              return podcast.acf.air_date <= CURRENT_DATE
            })
    				// filter by library_start_date
            .filter(pod => {
              var pDate = pod.date.split('T')[0]
              return pDate <= CURRENT_DATE && pDate >= this.advisor.acf.library_start_date && pDate >= TWO_YEARS_AGO
            })
            .map(pod => {
              return {
                title: pod.title.rendered,
                artist: pod.acf.guest_info[0].guest_name,
                src: pod.acf.podcast_file,
                pic: pod.better_featured_image.media_details.sizes.thumbnail.source_url,
                description: pod.acf.email_for_clients,
                slug: pod.slug
              }
            })
          this.currentPodcast = this.podcasts[0]
          this.loading = false
        })
        .catch(err => {
          return this.error = err
        })
    },
    showModal (form_name) {
      // set the title
      switch(form_name) {
        case 'moreInfo':
          this.formTitle = 'More information'
          break
        case 'subscribe':
          this.formTitle = 'Subscribe'
          break
        case 'forwardToAFriend':
          this.formTitle = 'Forward to a friend'
          break
        default:
          this.formTitle = ''
          return
      }
      this.formName = form_name
      this.modal = true
    },
    showMessage(data) {
      this.modal = false
      if (data.type === 'error') {
        this.error = true
      }
      this.message = data.message
    },
    dismissMessage () {
      this.message = ''
      this.error = false
    }
  },
  components: {
    ActionButtons,
    Aplayer,
    Forms,
    Modal,
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
            bottom: 154%;
            right: 20px;
            width: 40px;
            height: 40px;
            .aplayer-icon-play {
              top: 10px;
              left: 11px;
            }
          }
          .aplayer-pause {
            height: 40px;
            width: 40px;
            bottom: 131%;
            right: 5px;
            .aplayer-icon-pause {
              height: 16px;
              width: 16px;
              top: 12px;
              left: 12px;
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
      .aplayer-controller {
        margin: 8px 0;
      }
    }
    .rwm-link {
      display: block;
      margin-top: 12px;
      margin-left: 5px;
    }
    .message {
      background: #fff;
      border-left: 3px solid green;
      box-shadow: 0px 1px 2px rgba(0,0,0,.25);
      margin: 5px;
      padding: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.error {
        border-color: red;
      }
      button {
        margin: 0;
      }
    }
  }
</style>

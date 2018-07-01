<template>
  <div class="action-buttons">
    <button @click="showModal('moreInfo')" :style="{background: color}">More Info</button>
    <button @click="showModal('subscribe')" :style="{background: color}">Subscribe</button>
    <button @click="showModal('forwardToAFriend')" :style="{background: color}">Forward to a friend</button>
    <a :href="podcast.src" download>
      <button :style="{background: color}">Download Episode</button>
    </a>
    <!-- use the modal component, pass in the prop -->
    <modal v-if="modal" @close="modal = false">
      <h3 slot="header" :style="{color: color}">{{ formTitle }}</h3>
      <div slot="body">
        <form v-if="formName === 'moreInfo'">
          <label for="name">Name *</label>
          <input v-model="formValues.name" type="text" name="name" required />
          <label for="email">Email *</label>
          <input v-model="formValues.email" type="email" name="email" required />
          <label for="phone">Phone *</label>
          <input v-model="formValues.phone" type="tel" name="phone" required />
          <label for="bestTime">Best time to call</label>
          <input v-model="formValues.bestTime" type="time" name="bestTime"/>
          <label for="message">What would you like to learn more about?</label>
          <textarea v-model="formValues.message" name="message" rows="8" cols="80"></textarea>
          <button
            @click.prevent="submitForm"
            type="submit"
            name="submit"
            :style="{background: color}"
          >
            Submit
          </button>
        </form>
        <form v-if="formName === 'subscribe'">
          <label for="firstname">First name *</label>
          <input v-model="formValues.firstname" type="text" name="firstname" required />
          <label for="lastname">Last name *</label>
          <input v-model="formValues.lastname" type="text" name="lastname" required />
          <label for="email">Email *</label>
          <input v-model="formValues.email" type="email" name="email" required />
          <label for="phone">Phone *</label>
          <input v-model="formValues.phone" type="tel" name="phone" required />
          <label for="birthday">We like to honor our subscribers on their birthday.<br/> Let us know when yours is coming up.</label>
          <input v-model="formValues.birthday" type="date" name="birthday" />
          <label for="message">What is your biggest concern right now?</label>
          <textarea v-model="formValues.message" name="message" rows="8" cols="80"></textarea>
          <button
            @click.prevent="submitForm"
            type="submit"
            name="submit"
            :style="{background: color}"
          >
            Submit
          </button>
        </form>
        <form v-if="formName === 'forwardToAFriend'">
          <label for="name">Name *</label>
          <input v-model="formValues.name" type="text" name="name" required />
          <label for="email">Email *</label>
          <input v-model="formValues.email" type="email" name="email" required />
          <label for="friendsName">Friend's Name *</label>
          <input v-model="formValues.friendsName" type="text" name="friendsName" required />
          <label for="friendsEmail">Friend's Email *</label>
          <input v-model="formValues.friendsEmail" type="email" name="friendsEmail" required />
          <label for="subjectLine">Subject line *</label>
          <input v-model="formValues.subjectLine" type="text" name="subjectLine" required />
          <label for="forwardToAFriendMessage">Message</label>
          <textarea v-model="formValues.forwardToAFriendMessage" name="forwardToAFriendMessage" rows="8" cols="80"></textarea>
          <button
            @click.prevent="submitForm"
            type="submit"
            name="submit"
            :style="{background: color}"
          >
            Submit
          </button>
        </form>
      </div>
    </modal>
  </div>
</template>

<script>
import axios from 'axios'
import Modal from './Modal.vue'
import queryString from 'query-string'
export default {
  name: 'ActionButtons',
  props: [
    'advisor',
    'podcast',
    'color',
  ],
  data () {
    return {
      formName: '',
      formTitle: '',
      modal: false,
      formValues: {
        name: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        bestTime: '',
        message: '',
        birthday: '',
        friendsName: '',
        friendsEmail: '',
        subjectLine: '',
        f2fMessage: ''
      }
    }
  },
  methods: {
    showModal (form) {
      // reset values
      Object.keys(this.formValues)
            .forEach(key => this.$set(this.formValues, key, ''))
      // set the title
      switch(form) {
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
      this.formName = form
      this.modal = true
    },
    submitForm () {
      var data = Object.keys(this.formValues).reduce((obj, key) => {
        if (this.formValues[key] !== '') {
          if (key === 'birthday') {
            if (key === 'birthday' && key !== '') {
              var datePiecesArr = this.formValues[key].split('-')
              var year = datePiecesArr.shift()
              datePiecesArr.push(year)
              var formattedDate = datePiecesArr.join('-')
              this.formValues[key] = formattedDate
            }
          }
          obj[key] = this.formValues[key]
        }
        return obj
      }, {})
      // advisor email
      data.advisorEmail = this.advisor.acf.email_addresses[0].email_address
      // RWM podcast Link
      data.podcastLink = `https://realwealthmedia.com/${this.advisor.slug}?play=${this.podcast.slug}`
      // podcast title
      data.currentPodcastTitle = this.podcast.title.replace(/ /g, '%20')

      console.log(data)

      // sends to RWMarketing server
      axios
        .post(`https://realwealthmarketing.com/wp-content/realwealthmedia-forms/rw-${this.formName}Form-process.php`, data)
        .then(res => console.log(res))
        .catch(err => console.log(err))


      // // subscribeForm sends to worbix
      // if (this.formName === 'subscribe') {
      //   var fullname = this.$.firstname.value + ' ' + this.$.lastname.value
      //
      //   // NEW
      //   var encodeString = fullname+":"+this.$.email.value+":"+this.$.phone.value+":"+this.$.message.value+":"+window.location.pathname.split('/')[1]
      //   var specialPropertyString = "lead status:new;subscription:" + this.pFrequency.toLowerCase() + 'ly'
      //   encodeString += ":" + window.btoa(specialPropertyString);
      //   var sendEmailTo = this.advisorEmail
      //   encodeString += ":" + sendEmailTo;
      //   var dob = this.$.birthday.value;
      //   encodeString += ":" + dob;
      //
      //   var base64String = window.btoa(encodeString)
      //   var url = "https://apps.worbix.com/cxf/public/public/createContactRWM/"+base64String
      //
      //   var worbixRequest = new XMLHttpRequest()
      //   worbixRequest.open('GET', url, true)
      //
      //   worbixRequest.send()
      //
      //   worbixRequest.onload = function() {
      //     if (worbixRequest.status >= 200 && worbixRequest.status < 400) {
      //       // Success!
      //       form.reset()
      //       self.$$('paper-dialog').close()
      //       //worbixRequest.responseText
      //       document.querySelector('rw-app').showToast('success', 'thumb-up')
      //     } else {
      //       document.querySelector('rw-app').showToast('[Server Error]', 'warning')
      //     }
      //   }
      //
      //   worbixRequest.onerror = function() {
      //     document.querySelector('rw-app').showToast('[Connection Error]', 'warning')
      //   }
      // }


    }
  },
  components: {
    Modal
  }
}
</script>

<style lang="scss" scoped>
  .action-buttons {
    // margin-left: 5px;
  }
  button {
    font-size: .75rem;
    border-radius: 50px;
    margin-right: 10px;
    margin-bottom: 8px;
    color: white;
    padding: 6px 14px;
    border: none;
    // box-shadow: 0px 1px 3px rgba(0,0,0,.35);
    transition: transform 360ms ease;
    &:hover {
      cursor: pointer;
      opacity: .8;
      box-shadow: 0px 2px 5px rgba(0,0,0,.5);
      transform: scale(1.05);
    }
  }
  label,
  input,
  textarea {
    display: block;
    width: 100%;
  }
  input {
    margin-bottom: 8px;
  }
</style>

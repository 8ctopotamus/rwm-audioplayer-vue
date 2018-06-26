<template>
  <div class="action-buttons">
    <button @click="showModal('more-info')" :style="{background: color}">More Info</button>
    <button @click="showModal('subscribe')" :style="{background: color}">Subscribe</button>
    <button @click="showModal('f2f')" :style="{background: color}">Forward to a friend</button>
    <a :href="podcast.src" download>
      <button :style="{background: color}">Download Episode</button>
    </a>
    <!-- use the modal component, pass in the prop -->
    <modal v-if="modal" @close="modal = false">
      <h3 slot="header" :style="{color: color}">{{ formTitle }}</h3>
      <div slot="body">
        <form v-if="form === 'more-info'">
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
        <form v-if="form === 'subscribe'">
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
        <form v-if="form === 'f2f'">
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
          <label for="f2fMessage">Message</label>
          <textarea v-model="formValues.f2fMessage" name="f2fMessage" rows="8" cols="80"></textarea>
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
export default {
  name: 'ActionButtons',
  props: {
    advisor: Object,
    podcast: Object,
    color: String
  },
  data () {
    return {
      form: '',
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
        case 'more-info':
          this.formTitle = 'More information'
          break
        case 'subscribe':
          this.formTitle = 'Subscribe'
          break
        case 'f2f':
          this.formTitle = 'Forward to a friend'
          break
        default:
          this.formTitle = ''
          return
      }
      this.form = form
      this.modal = true
    },
    submitForm () {
      var data = ''
      Object.keys(this.formValues).forEach((key, i) => {
        if (this.formValues[key] !== '') {
          // format birthday value
          if (key === 'birthday' && key !== '') {
            var datePiecesArr = this.formValues[key].split('-')
            var year = datePiecesArr.shift() // 2018
            datePiecesArr.push(year)
            var formattedDate = datePiecesArr.join('-')
            this.formValues[key] = formattedDate
          }
          // build query string
          i == 0 ? data += key + '=' + this.formValues[key] :
                   data += '&' + key + '=' + this.formValues[key]
        }
      })
      // advisor email
      data += '&advisorEmail=' + this.advisor.acf.email_addresses[0].email_address
      // RWM podcast Link
      data += `&podcastLink=https://realwealthmedia.com/${this.advisor.slug}?play=${this.podcast.slug}`
      // podcast title
      data += '&currentPodcastTitle=' + this.podcast.title.replace(/ /g, '%20')

      console.log(data)

      // // sends to RWMarketing server
      // var request = new XMLHttpRequest()
      // request.open('POST', 'https://realwealthmarketing.com/wp-content/realwealthmedia-forms/rw-' + form.id + '-process.php', true)
      // request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
      //
      // request.send(data)
      //
      // request.onload = function() {
      //   if (request.status >= 200 && request.status < 400) {
      //     // Success!
      //     form.reset()
      //     self.$$('paper-dialog').close()
      //     document.querySelector('rw-app').showToast(request.responseText, 'thumb-up')
      //   } else {
      //     document.querySelector('rw-app').showToast('[Server Error]', 'warning')
      //   }
      // }
      //
      // request.onerror = function() {
      //   document.querySelector('rw-app').showToast('[Connection Error]', 'warning')
      // }



      // // subscribeForm sends to worbix
      // if (form.id === 'subscribeForm') {
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
  button {
    margin-top: 6px;
    margin-right: 10px;
    color: white;
    padding: 6px 14px;
    border: none;
    &:hover {
      cursor: pointer;
      opacity: .8;
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

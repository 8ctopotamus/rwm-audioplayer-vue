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
      <h3 slot="header">{{ formTitle }}</h3>
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
          <label v-model="formValues.message" for="message">What would you like to learn more about?</label>
          <textarea name="message" rows="8" cols="80"></textarea>
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
          <input type="text" name="firstname" required />
          <label for="lastname">Last name *</label>
          <input type="text" name="lastname" required />
          <label for="email">Email *</label>
          <input type="email" name="email" required />
          <label for="phone">Phone *</label>
          <input type="tel" name="phone" required />
          <label for="birthday">We like to honor our subscribers on their birthday.<br/> Let us know when yours is coming up.</label>
          <input type="date" name="birthday"></paper-input>
          <label for="message">What is your biggest concern right now?</label>
          <textarea name="message" rows="8" cols="80"></textarea>
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
          <input type="text" name="name" required />
          <label for="email">Email *</label>
          <input type="email" name="email" required />
          <label for="friendsName">Friend's Name *</label>
          <input type="text" name="friendsName" required />
          <label for="friendsEmail">Friend's Email *</label>
          <input type="email" name="friendsEmail" required />
          <label for="subjectLine">Subject line *</label>
          <input type="text" name="subjectLine" required />
          <label for="f2fMessage">Message</label>
          <textarea name="f2fMessage" rows="8" cols="80"></textarea>
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
import Modal from './Modal.vue'
export default {
  name: 'ActionButtons',
  props: {
    advisor: Object,
    podcast: Object,
    color: String
  },
  mounted() {
    // console.log(this.advisor)
    // console.log(this.podcast)
  },
  data () {
    return {
      form: '',
      formTitle: '',
      modal: false,
      formValues: {
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bestTime: '',
        message: '',
      }
    }
  },
  methods: {
    showModal (form) {
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
      console.log('submitting form...')



        // var self = this
        // var form = self.$$('form')
        // var children = form.children
        // var data = ''
        //
        // // get values from form fields
        // for (i = 0; i < children.length; i++) {
        //   var child = children[i]
        //
        //   if (child.tagName != "PAPER-BUTTON" && child.tagName != 'SPAN') {
        //
        //     // check required fields
        //     if (child.required && child.value === '') {
        //       document.querySelector('rw-app').showToast('Please fill out all required fields.', 'warning')
        //       return
        //     }
        //
        //     // format the bday value for worbix (below)
        //     if (child.id === 'birthday' && child.value != '') {
        //       var datePiecesArr = child.value.split('-')
        //       var year = datePiecesArr.shift() // 2018
        //       datePiecesArr.push(year)
        //       var formattedDate = datePiecesArr.join('-')
        //       child.value = formattedDate
        //     }
        //
        //     // add value to data string
        //     i == 0 ? data += child.id + '=' + child.value :
        //              data += '&' + child.id + '=' + child.value
        //   }
        // }
        //
        // if (this.advisorEmail) {
        //   data += '&advisorEmail=' + this.advisorEmail }
        //
        // if (this.podcastLink) {
        //   data += '&podcastLink=' + this.podcastLink }
        //
        // if (this.currentPodcastTitle) {
        //   data += '&currentPodcastTitle=' + this.currentPodcastTitle.replace(/ /g, '%20')
        // }
        //
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
        //
        // // Google Analytics Tracking
        // switch(form.id) {
        //   case 'subscribeForm':
        //     ga('send', 'event', 'Subscribe Form Submit', 'submit', 'Subscribe Form Submit')
        //     break
        //   case 'forward2AFriendForm':
        //     ga('send', 'event', 'F2F Form Submit', 'submit', 'F2f Form Submit')
        //     break
        //   case 'moreInfoForm':
        //     ga('send', 'event', 'More Info Form Submit', 'submit', 'More Info Form Submit')
        //     break
        //   case 'findAdvisorForm':
        //     ga('send', 'event', 'Find Advisor Form Submit', 'submit', 'FindAdvisor Form Submit')
        //     break
        //   default:
        //     return
        // }
        //
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

<template>
  <!-- use the modal component, pass in the prop -->
  <div class="">
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
</template>

<script>
import axios from 'axios'
import querystring from 'query-string'
export default {
  name: 'Forms',
  props: [
    'color',
    'advisor',
    'podcast',
    'formName',
  ],
  data () {
    return {
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
  mounted () {
    // reset values
    Object.keys(this.formValues)
          .forEach(key => this.$set(this.formValues, key, ''))
  },
  methods: {
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
      data.currentPodcastTitle = this.podcast.title

      // sends to RWMarketing server
      axios
        .post(`https://realwealthmarketing.com/wp-content/realwealthmedia-forms/rw-${this.formName}Form-process.php`, querystring.stringify(data))
        .then(res => this.$emit('submission-response', {type:'success', message: '😁 Form submision successful.'}))
        .catch(err => {
          console.log(err)
          this.$emit('submission-response', {type: 'error', message: '🤔 Hmm. Form submission failed.'})
        })

      // worbix subscription
      if (this.formName === 'subscribe') {
        var fullname = this.firstname + ' ' + this.lastname
        var encodeString = fullname+":"+this.email+":"+this.phone+":"+this.message+":"+window.location.pathname.split('/')[1]
        var specialPropertyString = "lead status:new;subscription:" + this.pFrequency.toLowerCase() + 'ly'
        encodeString += ":" + window.btoa(specialPropertyString)
        var sendEmailTo = this.advisorEmail
        encodeString += ":" + sendEmailTo
        var dob = this.birthday
        encodeString += ":" + dob
        var base64String = window.btoa(encodeString)
        var url = "https://apps.worbix.com/cxf/public/public/createContactRWM/"+base64String
        axios.get(url)
          .then(res => this.$emit('submission-response', {type:'success', message: '😁 You successfully subscribed.'}))
          .catch(err => {
            console.log(err)
            this.$emit('submission-response', {type: 'error', message: '🤔 Subscription failed.'})
          })
      }
      // end worbix
    }
  }
}
</script>

<style lang="css" scoped>
  button {
    width: 100%;
    margin-top: 14px;
    padding: 12px 20px;
  }
</style>

<template>
  <div class="action-buttons">
    <button @click="$emit('show-modal', 'moreInfo')" :style="{background: color}">More Info</button>
    <button @click="$emit('show-modal', 'subscribe')" :style="{background: color}">Subscribe</button>
    <button @click="$emit('show-modal', 'forwardToAFriend')" :style="{background: color}">Forward to a friend</button>
    <a :href="podcast.src" download>
      <button :style="{background: color}">Download Episode</button>
    </a>
  </div>
</template>

<script>
export default {
  name: 'ActionButtons',
  props: [
    'color',
    'podcast'
  ]
}
</script>

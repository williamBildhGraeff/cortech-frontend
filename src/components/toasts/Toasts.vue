<script>
  export default {
    data () {
      return {
        visible: false,
        message: '',
        type: 'success',
        progress: 100,
        interval: null,
        duration: 4000,
      }
    },
    computed: {
      barColor () {
        return this.type === 'error'
          ? 'red'
          : (this.type === 'warning'
            ? 'orange'
            : 'green')
      },
    },
    methods: {
      show (message, type = 'success') {
        this.message = message
        this.type = type
        this.visible = true
        this.progress = 100
        clearInterval(this.interval)

        const step = 100 / (this.duration / 100)
        this.interval = setInterval(() => {
          this.progress -= step
          if (this.progress <= 0) this.hide()
        }, 100)
      },
      hide () {
        this.visible = false
        clearInterval(this.interval)
      },
    },
  }
</script>

<template>
  <v-snackbar
    v-model="visible"
    :color="type"
    localtion="bottom"
    :multi-line="true"
  >
    {{ message }}

    <template #actions>
      <v-btn
        icon="mdi-close"
        variant="text"
        @click="visible = false"
      />
    </template>
  </v-snackbar>
</template>

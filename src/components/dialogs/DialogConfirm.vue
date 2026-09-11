<script>
export default {
  name: 'DialogConfirm',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirmar'
    },
    message: {
      type: String,
      default: 'Tem certeza que deseja continuar com esta ação?'
    },
    confirmText: {
      type: String,
      default: 'Confirmar'
    },
    cancelText: {
      type: String,
      default: 'Cancelar'
    }
  },
  emits: ['update:model-value', 'confirm'],
  computed: {
    dialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:model-value', value)
      }
    }
  },
  methods: {
    confirmSuccess() {
      this.$emit('confirm')
    },
    closeDialog() {
      this.dialog = false
    }
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="480" persistent>
    <v-card rounded="xl">
      <v-toolbar color="success" density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
      </v-toolbar>

      <v-card-text class="pt-6">
        <div class="text-body-1">{{ message }}</div>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="closeDialog">
          {{ cancelText }}
        </v-btn>
        <v-btn color="success" variant="flat" @click="confirmSuccess">
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogDelete',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirmar exclusão'
    },
    message: {
      type: String,
      default: 'Tem certeza que deseja excluir este item?'
    },
    confirmText: {
      type: String,
      default: 'Excluir'
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
    confirmDelete() {
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
      <v-toolbar color="error" density="compact">
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
        <v-btn color="error" variant="flat" @click="confirmDelete">
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

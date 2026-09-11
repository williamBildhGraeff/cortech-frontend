<script>
export default {
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },

        fileToUpload: {
            type: Object,
            default: () => {}
        },

        import: {
            type: Function,
            default: () => {}
        }
    },

    emits: ['update:file-to-upload', 'update:model-value'],

    computed: {
        dialog: {
            get(){
                return this.modelValue
            },

            set(value){
                this.$emit('update:model-value', value)
            }
        },

        file: {
            get(){
                return this.fileToUpload
            },
            set(value){
                this.$emit('update:file-to-upload', value)
            }
        }
    },

    methods: {
        importFile() {
            this.import()
            this.dialog = false
        }
    }
}
</script>
<template>
    <v-dialog v-model="dialog">
        <v-card>
            <v-toolbar density="compact", color="primary">
                <v-toolbar-title>
                    <v-icon class="me-2" icon="mdi-file-import-outline"/>
                    Importar arquivo
                </v-toolbar-title>
                <v-toolbar-items>
                    <v-btn
                        icon="mdi-close"
                        @click="dialog = false"
                    />
                </v-toolbar-items>
            </v-toolbar>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-file-upload
                            v-model="file"
                            density="comfortable"
                            label="Arraste o aqruivo de pesagens aqui!"
                            scrim="primary"
                            clearable
                        />
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn
                    text="Importar"
                    color="red"
                    variant="flat"
                    prepend-icon="mdi-file-import-outline"
                    @click="importFile"    
                />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
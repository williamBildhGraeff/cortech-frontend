
<script>
import login from '@/api/login';

export default {
  name: 'Login',

  data() {
    return {
        data: {
            email: '',   
            password: '',
        },
      rememberMe: false,
      showPassword: false,
      loading: false,
    }
  },

  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
  },

  methods: {
    async login() {
      const { valid } = await this.$refs.validateLogin.validate()
      if (!valid) return
     try {
        this.loading = true
        const res = await login.login(this.data)
        console.log(res)

     } catch (error) {
        console.error(error)
        this.$toast.error(this.$errorApi(error))
     } finally {
        this.loading = false
     }
    },
  },
}
</script>
<template>
  <v-container fluid class="fill-height bg-background">
    <v-row
      align="center"
      justify="center"
      class="fill-height"
    >
      <v-col
        cols="12"
        sm="10"
        md="8"
        lg="6"
        xl="4"
      >
        <v-card
          elevation="12"
          rounded="xl"
        >
          <v-card-text>
            <div class="text-center">
              <v-avatar
                color="primary"
                size="72"
                class="mb-4"
              >
                <v-icon size="40">
                  mdi-cow
                </v-icon>
              </v-avatar>

              <div class="text-h4 font-weight-bold">
                Gestão de Gado
              </div>

              <div class="text-subtitle-1 text-medium-emphasis mt-2">
                Faça login para acessar o sistema
              </div>
            </div>

            <v-form @submit.prevent="login" ref="validateLogin">
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                        v-model="data.email"
                        label="E-mail"
                        :rules="[$validate.required, $validate.email]"
                        hide-details="auto"
                        prepend-inner-icon="mdi-email-outline"
                        variant="outlined"
                        density="comfortable"
                        type="email"
                        />
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            v-model="data.password"
                            label="Senha"
                            prepend-inner-icon="mdi-lock-outline"
                            :append-inner-icon="
                            showPassword ? 'mdi-eye-off' : 'mdi-eye'
                            "
                            :rules="[$validate.required]"
                            hide-details="auto"
                            :type="showPassword ? 'text' : 'password'"
                            variant="outlined"
                            density="comfortable"
                            @click:append-inner="showPassword = !showPassword"
                            />
                    </v-col>

                    <v-btn
                        color="secondary"
                        block
                        size="large"
                        type="submit"
                        text="Entrar"
                        :loading
                    />
              </v-row>
            </v-form>
          </v-card-text>

          <v-divider />

          <v-card-actions class="justify-center pa-4">
            <span class="text-body-2 text-medium-emphasis">
              © {{ currentYear }} Gestão de Gado
            </span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

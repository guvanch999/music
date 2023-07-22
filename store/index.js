export const state = () => ({
  image_base_url: 'http://localhost:3001',
  auth_token: null
})

export const getters = {
  get_image_base_url(state) {
    return state.image_base_url
  },
  get_auth_token(state) {
    return state.auth_token || localStorage['auth']
  }
}

export const mutations = {
  SET_AUTH_TOKEN(state, token) {
    state.auth_token = token
    if (!!token) {
      localStorage["auth"] = token
    } else {
      localStorage.removeItem("auth")
    }
  }
}

export const actions = {
  async login({commit}, {email, password}) {
    return await this.$axios.$post('v1/admin/login', {
      email, password
    }).then(res => {
      commit("SET_AUTH_TOKEN", res.token.token)
      return true
    }).catch(err => {
      console.log(err)
      return false
    })
  }
}

export const state = () => ({
  songs: [],
  count: 0
})

export const getters = {
  get_songs_list(state) {
    return state.songs
  },
  get_total_count(state) {
    return state.count
  }
}

export const mutations = {
  SET_SONGS_LIST(state, list) {
    state.songs = list
  },
  SET_TOTAL_COUNT(state, count) {
    state.count = count
  },
  UPDATE_SONG_INFORMATION(state, data) {
    state.songs = state.songs.map(x => x.id === data.id ? data : x)
  },
}

export const actions = {
  async loadAllSongs({commit, rootGetters}, {page}) {
    let token = rootGetters.get_auth_token
    await this.$axios.$get('v1/admin/songs/all', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page
      }
    }).then(res => {
      commit("SET_SONGS_LIST", res.data)
      commit("SET_TOTAL_COUNT", res.total)
    }).catch(err => {
      console.log(err)
    })
  },
  async creteSong({commit, rootGetters}, data) {
    let token = rootGetters.get_auth_token
    return await this.$axios.$post('v1/admin/songs/create', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      return true
    }).catch(err => {
      console.log(err)
      return false
    })
  },
  async updateSongDetail({commit, rootGetters}, {song_id, data}) {
    let token = rootGetters.get_auth_token
    return await this.$axios.$put('v1/admin/songs/update/' + song_id, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      commit("UPDATE_SONG_INFORMATION", res.data)
      return true
    }).catch(err => {
      console.log(err)
      return false
    })
  },
  async removeSong({rootGetters}, song_id) {
    let token = rootGetters.get_auth_token
    return await this.$axios.$delete('v1/admin/songs/delete/' + song_id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      return true
    }).catch(err => {
      return false
    })
  },
  async uploadImage({commit, rootGetters}, {song_id, form}) {
    let token = rootGetters.get_auth_token
    return await this.$axios.$post('v1/admin/songs/add-image/' + song_id, form, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      commit("UPDATE_SONG_INFORMATION", res.data)
      return true
    }).catch(err => {
      console.log(err)
      return false
    })
  },
  async uploadTrack({commit, rootGetters}, {song_id, form}) {
    let token = rootGetters.get_auth_token
    return await this.$axios.$post('v1/admin/songs/add-track/' + song_id, form, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      commit("UPDATE_SONG_INFORMATION", res.data)
      return true
    }).catch(err => {
      console.log(err)
      return false
    })
  }
}

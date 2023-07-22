export const state = () => ({
  albums: []
})

export const getters = {
  get_albums(state) {
    return state.albums
  }
}

export const mutations = {
  SET_ALBUMS_LIST(state, list) {
    state.albums = list
  },
  PUSH_ONE_ALBUM(state, data) {
    state.albums.push(data)
  },
  REMOVE_ONE_ALBUM(state, album_id) {
    state.albums = state.albums.filter(x => x.id !== album_id)
  },
  UPDATE_ONE_ALBUM(state, data) {
    state.albums = state.albums.map(x => x.id === data.id ? data : x)
  }
}

export const actions = {
  async loadAllAlbums({commit, rootGetters}) {
    let token = rootGetters.get_auth_token
    await this.$axios.$get('/v1/albums/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      commit("SET_ALBUMS_LIST", res.data)
    }).catch(err => {
      console.log(err)
      commit("SET_ALBUMS_LIST", [])
    })
  },
  async createAlbum({commit, rootGetters}, data) {
    let token = rootGetters.get_auth_token
    return await this.$axios.$post('v1/albums/create', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      commit("PUSH_ONE_ALBUM", res.data)
      return true
    }).catch(err => {
      console.log(err)
      return false
    })
  },
  async updateAlbumDetail({commit, rootGetters}, {album_id, data}) {
    let token = rootGetters.get_auth_token
    return await this.$axios.$put('v1/albums/update/' + album_id, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      commit("UPDATE_ONE_ALBUM", res.data)
      return true
    }).catch(err => {
      console.log(err)
      return false
    })
  },
  async removeAlbum({commit, rootGetters}, album_id) {
    let token = rootGetters.get_auth_token
    return await this.$axios.$delete('v1/albums/delete/' + album_id, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      commit("REMOVE_ONE_ALBUM", album_id)
      return true
    }).catch(err => {
      console.log(err)
      return false
    })
  },
  async addImage({commit, rootGetters}, {album_id, form}) {
    let token = rootGetters.get_auth_token
    return await this.$axios.$post('v1/albums/add-image/' + album_id, form, {
      headers: `Bearer ${token}`
    }).then(res => {
      commit("UPDATE_ONE_ALBUM", res.data)
      return true
    }).catch(err => {
      console.log(err)
      return false
    })
  }
}

<template>
  <v-app>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      clipped
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      clipped-left
      fixed
      app
    >
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>

      <v-toolbar-title>{{ title }}</v-toolbar-title>

    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt/>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      items: [
        {
          icon: 'mdi-chart-bubble',
          title: 'Dashboard',
          to: '/dashboard'
        },
        {
          icon: 'mdi-playlist-music',
          title: 'Songs',
          to: '/songs'
        },
        {
          icon: 'mdi-playlist-music',
          title: 'Song information',
          to: '/song-informations'
        },
        {
          icon: 'mdi-playlist-music',
          title: 'Albums',
          to: '/albums'
        }
      ],
      miniVariant: false,
      right: true,
      title: 'Lets dance'
    }
  }
}
</script>

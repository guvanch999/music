export const state = () => ({
  crud_types: {
    genre: {
      title: "Genres",
      url_path: 'genres',
      headers: [
        {
          text: "Id",
          value: "id",
          width: "5%"
        },
        {
          text: "Image",
          value: "image",
          width: "20%"
        },
        {
          text: 'Name',
          value: "name"
        },
        {
          text: "Actions",
          value: 'actions',
          align: "right",
          width: "10%"
        }
      ],
      model: {
        name: null,
        name_ru: null
      },
      modelParams: {
        name: {
          label: 'Name(TM): ',
          type: "text-field"
        },
        name_ru: {
          label: 'Name(RU): ',
          type: "text-field"
        }
      },
      has_image: true
    },
    era: {
      title: "Era",
      url_path: 'era',
      headers: [
        {
          text: "Id",
          value: "id",
          width: "5%"
        },
        {
          text: 'Active years',
          value: "active_years"
        },
        {
          text: "Actions",
          value: 'actions',
          align: "right",
          width: "10%"
        }
      ],
      model: {
        active_years: null,
      },
      modelParams: {
        active_years: {
          label: 'Active years(TM): ',
          type: "text-field"
        },
      },
      has_image: false
    },
    artist: {
      title: "Artists",
      url_path: 'artists',
      headers: [
        {
          text: "Id",
          value: "id",
          width: "5%"
        },
        {
          text: "Image",
          value: "image",
        },
        {
          text: 'Name',
          value: "name"
        },
        {
          text: "Bio",
          value: "bio"
        },
        {
          text: "Bio(RU)",
          value: "bio_ru"
        },
        {
          text: "Actions",
          value: 'actions',
          align: "right",
          width: "10%"
        }
      ],
      model: {
        name: null,
        name_ru: null,
        bio: null,
        bio_ru: null
      },
      modelParams: {
        name: {
          label: 'Name(TM): ',
          type: "text-field"
        },
        name_ru: {
          label: 'Name(RU): ',
          type: "text-field"
        },
        bio: {
          label: "Biography:",
          type: "text-area"
        },
        bio_ru: {
          label: "Biography(RU):",
          type: "text-area"
        }
      },
      has_image: true
    },
    country: {
      title: "Countries",
      url_path: 'countries',
      headers: [
        {
          text: "Id",
          value: "id",
          width: "5%"
        },

        {
          text: 'Name',
          value: "name"
        },
        {
          text: "Actions",
          value: 'actions',
          align: "right",
          width: "10%"
        }
      ],
      model: {
        name: null,
        name_ru: null,
      },
      modelParams: {
        name: {
          label: 'Name(TM): ',
          type: "text-field"
        },
        name_ru: {
          label: 'Name(RU): ',
          type: "text-field"
        },
      },
      has_image: false
    },
    tag: {
      title: "Tags",
      url_path: 'tags',
      headers: [
        {
          text: "Id",
          value: "id",
          width: "5%"
        },
        {
          text: 'Tag',
          value: "tag"
        },
        {
          text: "Actions",
          value: 'actions',
          align: "right",
          width: "10%"
        }
      ],
      model: {
        tag: null
      },
      modelParams: {
        tag: {
          label: 'Tag: ',
          type: "text-field"
        },
      },
      has_image: false
    },
    category: {
      title: "Categories",
      url_path: 'categories',
      headers: [
        {
          text: "Id",
          value: "id",
          width: "5%"
        },
        {
          text: "Image",
          value: "image",
        },
        {
          text: 'Name',
          value: "name"
        },
        {
          text: "Actions",
          value: 'actions',
          align: "right",
          width: "10%"
        }
      ],
      model: {
        name: null,
        name_ru: null,
      },
      modelParams: {
        name: {
          label: 'Name(TM): ',
          type: "text-field"
        },
        name_ru: {
          label: 'Name(RU): ',
          type: "text-field"
        },
      },
      has_image: true
    },
  }
})

export const getters = {
  get_crud_type(state) {
    return state.crud_types
  }
}

export const mutations = {}

export const actions = {}

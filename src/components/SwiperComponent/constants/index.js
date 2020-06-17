import moment from 'moment';

const media = [
  {
    id: '1435',
    url:
      'https://images.unsplash.com/photo-1532579853048-ec5f8f15f88d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    type: 'image',
    message: 'In 2012 Mark Zuckerberg commented, "The biggest mistake we made as a company was betting too much on HTML as opposed to native".[8] He promised that Facebook would soon deliver a better mobile experience.Inside Facebook, Jordan Walke found a way to generate UI elements for iOS from a background JavaScript thread.[9] They decided to organise an internal Hackathon to perfect this prototype in order to be able to build native apps with this technology.[10]After months of development, Facebook released the first version for the React JavaScript Configuration in 2015. During a technical talk,[11] Christopher Chedeau explained that Facebook was already using React Native in production for their Group App and their Ads Manager App.',
    creator: {
      name: 'Amit',
      profile: 'https://avatars0.githubusercontent.com/u/16208872?s=460&v=4',
      updated_at: moment().format(),
    },
  },

  {
    id: '8756',
    url:
      '/storage/emulated/0/beats/APOLOGY Dancehall x Afrobeat x Wizkid Type Beat Instrumental.mp4',
    type: 'video',
    message: 'was betting too much on HTML as opposed https://avatars0.githubusercontent.com/u/16208872?s=460&v=4 ',
    creator: {
      name: 'Trinadh',
      profile: 'https://avatars2.githubusercontent.com/u/45196619?s=460&v=4',
      updated_at: moment().format(),
    },
  }, 

  {
    id: '2546',
    url:
      'https://images.unsplash.com/photo-1500099817043-86d46000d58f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    type: 'image',
    message: '',
    creator: {
      name: 'Trinadh',
      profile: 'https://avatars2.githubusercontent.com/u/45196619?s=460&v=4',
      updated_at: moment().format(),
    },
  },

  {
    id: '342',
    url:
      'https://images.unsplash.com/photo-1476292026003-1df8db2694b8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    type: 'image',
    message: '',
    creator: {
      name: 'Trinadh',
      profile: 'https://avatars2.githubusercontent.com/u/45196619?s=460&v=4',
      updated_at: moment().format(),
    },
  },

  {
    id: '1423',
    url:
      'https://images.unsplash.com/photo-1498982261566-1c28c9cf4c02?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    type: 'image',
    duration: 2,
    isReadMore: true,
    message: '',
    creator: {
      name: 'Trinadh',
      profile: 'https://avatars2.githubusercontent.com/u/45196619?s=460&v=4',
      updated_at: moment().format(),
    },
  },
];

export default media;


/**
  {
    username: 'Trinadh',
    profile: 'https://avatars2.githubusercontent.com/u/45196619?s=460&v=4',
    title: 'My Gallery',
    stories: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1500099817043-86d46000d58f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        type: 'image',
        duration: 2,
        isReadMore: true,
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1476292026003-1df8db2694b8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        type: 'image',
        duration: 2,
        isSeen: false,
        isReadMore: true,
        isPaused: true,
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1498982261566-1c28c9cf4c02?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        type: 'image',
        duration: 2,
        isSeen: false,
        isReadMore: true,
        isPaused: true,
      },
    ],
  },


  {
    username: 'Steve Jobs',
    profile: 'https://s3.amazonaws.com/media.eremedia.com/uploads/2012/05/15181015/stevejobs.jpg',
    title: ' Beach Moves',
    stories: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1515578706925-0dc1a7bfc8cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        type: 'image',
        duration: 2,
        isReadMore: true,
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1496287437689-3c24997cca99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        type: 'image',
        duration: 2,
        isSeen: false,
        isReadMore: true,
        isPaused: true,
      },
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1514870262631-55de0332faf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        type: 'image',
        duration: 2,
        isSeen: false,
        isReadMore: true,
        isPaused: true,
      },

    ],
  },
  {
    username: 'Rahul',
    profile: 'https://images.unsplash.com/profile-1531581190171-0cf831d86212?dpr=2&auto=format&fit=crop&w=150&h=150&q=60&crop=faces&bg=fff',
    title: 'Beauties @Beach',
    stories: [
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1512101176959-c557f3516787?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        type: 'image',
        duration: 2,
        isReadMore: true,
      },
      {
        id: 5,
        url: 'https://images.unsplash.com/photo-1478397453044-17bb5f994100?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        type: 'image',
        duration: 2,
        isSeen: false,
        isReadMore: true,
        isPaused: true,
      },
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=581&q=80',
        type: 'image',
        duration: 2,
        isSeen: false,
        isReadMore: true,
        isPaused: true,
      },
    ],
  }, */

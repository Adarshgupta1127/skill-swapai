import { UserProfile, Skill } from './types';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'u2',
    name: 'Elena Rodriguez',
    bio: 'Graphic designer looking to improve my Spanish conversation skills.',
    avatar: 'https://picsum.photos/seed/elena/200/200',
    skillsOffered: [{ id: 's1', name: 'Adobe Photoshop', level: 'Expert' }, { id: 's2', name: 'UI Design', level: 'Intermediate' }],
    skillsWanted: ['Spanish', 'Cooking'],
    isOnline: true
  },
  {
    id: 'u3',
    name: 'Kenji Sato',
    bio: 'Software engineer who loves guitar. Wants to learn French.',
    avatar: 'https://picsum.photos/seed/kenji/200/200',
    skillsOffered: [{ id: 's3', name: 'React', level: 'Expert' }, { id: 's4', name: 'Guitar', level: 'Intermediate' }],
    skillsWanted: ['French', 'Public Speaking'],
    isOnline: false
  },
  {
    id: 'u4',
    name: 'Sarah Jenkins',
    bio: 'Chef based in NYC. I want to learn how to code a website.',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    skillsOffered: [{ id: 's5', name: 'French Cooking', level: 'Expert' }, { id: 's6', name: 'Baking', level: 'Expert' }],
    skillsWanted: ['Web Development', 'React', 'HTML/CSS'],
    isOnline: true
  },
  {
    id: 'u5',
    name: 'David Chen',
    bio: 'Native Mandarin speaker, looking for piano lessons.',
    avatar: 'https://picsum.photos/seed/david/200/200',
    skillsOffered: [{ id: 's7', name: 'Mandarin', level: 'Expert' }, { id: 's8', name: 'Math', level: 'Expert' }],
    skillsWanted: ['Piano', 'Music Theory'],
    isOnline: true
  },
  {
    id: 'u6',
    name: 'Aisha Osei',
    bio: 'Digital marketer wanting to learn Python for data analysis.',
    avatar: 'https://picsum.photos/seed/aisha/200/200',
    skillsOffered: [{ id: 's9', name: 'SEO', level: 'Expert' }, { id: 's10', name: 'Content Marketing', level: 'Intermediate' }],
    skillsWanted: ['Python', 'Data Science'],
    isOnline: false
  },
  {
    id: 'u7',
    name: 'Marco Rossi',
    bio: 'Italian native, I can teach Italian language. I want to learn Guitar.',
    avatar: 'https://picsum.photos/seed/marco/200/200',
    skillsOffered: [{ id: 's11', name: 'Italian', level: 'Expert' }],
    skillsWanted: ['Guitar', 'Singing'],
    isOnline: true
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'me',
  name: 'Alex Doe',
  bio: 'Enthusiastic learner ready to swap skills!',
  avatar: 'https://picsum.photos/seed/alex/200/200',
  skillsOffered: [{ id: 's_me_1', name: 'English', level: 'Expert' }],
  skillsWanted: ['Spanish']
};

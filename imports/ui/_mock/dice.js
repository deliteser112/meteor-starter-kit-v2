import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const DICE_TITLES = [
  'Red Two Dices',
  'Red Two Dices',
  'Blue background two dices',
  'Four dices on black background',
  'Large two dices',
  'Reflection dices',
  'A lots of dices',
  'The dices thrown by cup'
];

const dices = [...Array(7)].map((_, index) => ({
  id: faker.datatype.uuid(),
  cover: `/static/mock-images/covers/cover_${index + 1}.jpg`,
  title: DICE_TITLES[index + 1],
  createdAt: faker.date.past(),
  author: {
    name: faker.name.findName(),
    avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
  },
}));

export default dices;

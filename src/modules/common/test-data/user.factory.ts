import { User, USERTYPE } from 'src/domain/users/user.entity';

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: `${Math.random() * 8}-0000-0000-0000-000000000000`,
  firstName: 'Test',
  lastName: 'Test',
  email: `test${Math.random() * 1000}@test.com`,
  password: 'lorem ipsum5!',
  details: {
    type: USERTYPE.Standard,
    enabled: true,
  },
  preferences: {},
  createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  updatedAt: new Date(),
  configureUserDetails: () => {},
  ...overrides,
});

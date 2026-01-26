import { User, USERTYPE } from 'src/users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: uuidv4(),
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

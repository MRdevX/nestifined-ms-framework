import { mock, MockProxy } from 'jest-mock-extended';

export const createMockEntity = <T>(entity: new () => T, properties: Partial<T>): T => {
  const entityMock: MockProxy<T> = mock<T>();
  Object.assign(entityMock, properties);
  return entityMock;
};

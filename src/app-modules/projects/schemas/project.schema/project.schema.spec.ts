import { ProjectSchema } from './project.schema';

describe('ProjectSchema', () => {
  it('should be defined', () => {
    expect(new ProjectSchema()).toBeDefined();
  });
});

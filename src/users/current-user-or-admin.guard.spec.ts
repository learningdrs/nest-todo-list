import { CurrentUserOrAdminGuard } from './current-user-or-admin.guard';

describe('CurrentUserOrAdminGuard', () => {
  it('should be defined', () => {
    expect(new CurrentUserOrAdminGuard()).toBeDefined();
  });
});

import * as React from 'react';
import * as ahgora from './ahgora';

describe('ahgoraService', () => {
  describe('when requesting login', () => {
    it('should retrieve response cookie', async () => {
      const cookie = await ahgora.login();

      expect(cookie).toContain('path=/');
    });
  });

  describe('when requesting times', () => {
    it('should retrieve today message', async () => {
      const result = await ahgora.getTimes();
      const today = ahgora.getToday(result.times);
      const message = ahgora.parseResult(result.times);

      expect(message).toContain('times');
    });
  });
});

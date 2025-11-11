const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

require('@testing-library/jest-dom');

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  });
});

afterEach(() => {
  if (global.fetch?.mockReset) {
    global.fetch.mockReset();
  }
});

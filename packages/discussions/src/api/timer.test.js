import { Timer } from './timer';

jest.useFakeTimers();

describe('Timer', () => {
  let callback;

  beforeEach(() => {
    callback = jest.fn();
  });
  test('callback is called after the timeout', () => {
    const timer = new Timer(callback);
    expect(timer.attempts).toBe(0);
    expect(callback).not.toBeCalled();
    timer.execute();

    jest.runAllTimers();
    expect(timer.attempts).toBe(1);
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('callback is called each time', () => {
    const timer = new Timer(callback);
    timer.execute();
    jest.runAllTimers();
    timer.execute();
    jest.runAllTimers();
    expect(timer.attempts).toBe(2);
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('gets the next timeout using attempts', () => {
    const timingFn = jest.fn();
    const timer = new Timer(callback, timingFn);
    timer.attempts = 2;

    timer.execute();
    jest.runAllTimers();

    expect(timingFn).toBeCalled();
    expect(timingFn).toHaveBeenCalledTimes(1);
    expect(timingFn).toBeCalledWith(2);
    expect(timer.attempts).toBe(3);
  });

  test('reset sets clears the attempts and timeout', () => {
    const timer = new Timer(callback, () => 1000);
    timer.attempts = 2;
    timer.execute();
    jest.runTimersToTime(500);
    timer.reset();
    jest.runAllTimers();
    expect(callback).not.toHaveBeenCalled();
    expect(timer.attempts).toBe(0);
  });
});
